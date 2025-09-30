#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const projectRoot = path.resolve(__dirname, "..");
const imagesDir = path.join(projectRoot, "src", "assets", "images");
const videosDir = path.join(projectRoot, "src", "assets", "videos");
const outputFile = path.join(projectRoot, "src", "data", "cards.generated.ts");

if (!fs.existsSync(imagesDir)) {
  console.error(`[generate-cards] Images directory not found: ${imagesDir}`);
  process.exit(1);
}

const files = fs
  .readdirSync(imagesDir)
  .filter((file) => file.toLowerCase().endsWith(".png"))
  .sort((a, b) => {
    const numA = parseInt(a, 10);
    const numB = parseInt(b, 10);
    if (!Number.isNaN(numA) && !Number.isNaN(numB) && numA !== numB) {
      return numA - numB;
    }
    return a.localeCompare(b);
  });

if (!files.length) {
  console.error("[generate-cards] No .png files found under src/assets/images");
  process.exit(1);
}

const issues = [];
const cardEntries = files.map((file) => {
  const withoutExt = file.replace(/\.png$/i, "");
  const segments = withoutExt.split("__");

  if (segments.length < 2) {
    issues.push(
      `Filename does not follow 'NN__[meta__]Text.png' format: ${file}`
    );
    return null;
  }

  const id = parseInt(segments[0], 10);
  if (Number.isNaN(id)) {
    issues.push(`Unable to parse numeric id from filename: ${file}`);
  }

  const metaSegments = segments.slice(1, -1);
  const text = segments[segments.length - 1];

  let preferredTone;
  const toneSegment = metaSegments.find((segment) =>
    segment.startsWith("tone-")
  );
  if (toneSegment) {
    const toneValue = toneSegment.split("-")[1]?.toLowerCase();
    if (toneValue === "light" || toneValue === "dark") {
      preferredTone = toneValue;
    } else {
      issues.push(`Unrecognised tone value '${toneSegment}' in ${file}`);
    }
  }

  const safeText = text.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
  const safeRequire = file.replace(/\\/g, "\\\\").replace(/"/g, '\\"');

  // Look for matching animated videos in src/assets/videos
  // Supported naming conventions:
  //  - "animated {filename without .png}.mp4"
  //  - "animated_{filename without .png}.mp4"
  const videoPrimaryFilenameSpace = `animated ${withoutExt}.mp4`;
  const videoPrimaryFilenameUnderscore = `animated_${withoutExt}.mp4`;
  const videoSecondaryFilenameSpace = `animated ${withoutExt} (after 3m).mp4`;
  const videoSecondaryFilenameUnderscore = `animated_${withoutExt} (after 3m).mp4`;

  const videoPrimaryPathSpace = path.join(videosDir, videoPrimaryFilenameSpace);
  const videoPrimaryPathUnderscore = path.join(
    videosDir,
    videoPrimaryFilenameUnderscore
  );
  const videoSecondaryPathSpace = path.join(
    videosDir,
    videoSecondaryFilenameSpace
  );
  const videoSecondaryPathUnderscore = path.join(
    videosDir,
    videoSecondaryFilenameUnderscore
  );

  const hasVideoPrimarySpace = fs.existsSync(videoPrimaryPathSpace);
  const hasVideoPrimaryUnderscore = fs.existsSync(videoPrimaryPathUnderscore);
  const hasVideoSecondarySpace = fs.existsSync(videoSecondaryPathSpace);
  const hasVideoSecondaryUnderscore = fs.existsSync(
    videoSecondaryPathUnderscore
  );

  const hasVideoPrimary = hasVideoPrimarySpace || hasVideoPrimaryUnderscore;
  const hasVideoSecondary =
    hasVideoSecondarySpace || hasVideoSecondaryUnderscore;

  const chosenPrimaryFilename = hasVideoPrimarySpace
    ? videoPrimaryFilenameSpace
    : hasVideoPrimaryUnderscore
    ? videoPrimaryFilenameUnderscore
    : null;
  const chosenSecondaryFilename = hasVideoSecondarySpace
    ? videoSecondaryFilenameSpace
    : hasVideoSecondaryUnderscore
    ? videoSecondaryFilenameUnderscore
    : null;

  const safeVideoPrimaryRequire = chosenPrimaryFilename
    ? `../assets/videos/${chosenPrimaryFilename
        .replace(/\\/g, "\\\\")
        .replace(/"/g, '\\"')}`
    : null;
  const safeVideoSecondaryRequire = chosenSecondaryFilename
    ? `../assets/videos/${chosenSecondaryFilename
        .replace(/\\/g, "\\\\")
        .replace(/"/g, '\\"')}`
    : null;

  return {
    id,
    text,
    safeText,
    requirePath: `../assets/images/${safeRequire}`,
    preferredTone,
    hasVideoPrimary,
    hasVideoSecondary,
    videoPrimaryRequire: safeVideoPrimaryRequire,
    videoSecondaryRequire: safeVideoSecondaryRequire,
  };
});

if (issues.length) {
  issues.forEach((issue) => console.error(`[generate-cards] ${issue}`));
  process.exit(1);
}

const header = `/**
 * AUTO-GENERATED FILE. DO NOT EDIT.
 * Run \`npm run generate:cards\` to regenerate.
 */\n\nimport type { ImageSourcePropType } from "react-native";\n\nexport type GeneratedCard = {\n  id: number;\n  text: string;\n  image: ImageSourcePropType;\n  preferredTone?: "light" | "dark";\n  video?: any;\n  videoAfter3m?: any;\n};\n\nexport const generatedCards: GeneratedCard[] = [\n`;

const body = cardEntries
  .map((entry) => {
    if (!entry) return "";
    const toneLine = entry.preferredTone
      ? `\n    preferredTone: "${entry.preferredTone}",`
      : "";
    const videoPrimaryLine = entry.hasVideoPrimary
      ? `\n    video: require("${entry.videoPrimaryRequire}"),`
      : "";
    const videoSecondaryLine = entry.hasVideoSecondary
      ? `\n    videoAfter3m: require("${entry.videoSecondaryRequire}"),`
      : "";
    return `  {\n    id: ${entry.id},\n    text: "${entry.safeText}",\n    image: require("${entry.requirePath}"),${toneLine}${videoPrimaryLine}${videoSecondaryLine}\n  },`;
  })
  .join("\n");

const footer = "\n];\n";

fs.writeFileSync(outputFile, header + body + footer, { encoding: "utf8" });

console.log(
  `[generate-cards] Wrote ${cardEntries.length} cards to ${path.relative(
    projectRoot,
    outputFile
  )}`
);
