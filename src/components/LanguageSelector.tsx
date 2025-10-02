// Language Selector Component
// A component for selecting app language

import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Modal,
  FlatList,
  SafeAreaView,
} from "react-native";
import { useLanguageManager } from "../i18n/hooks";
import { useCommonText } from "../i18n/hooks";
import { resolveTextColor, resolveOverlayColor } from "../theme/colors";
import { FONT_PRESETS } from "../theme/typography";

type LanguageSelectorProps = {
  isVisible: boolean;
  onClose: () => void;
};

export function LanguageSelector({
  isVisible,
  onClose,
}: LanguageSelectorProps) {
  const {
    availableLanguages,
    currentLanguage,
    setLanguage,
    getCurrentLanguageInfo,
  } = useLanguageManager();
  const commonText = useCommonText();
  const [isChanging, setIsChanging] = useState(false);

  const handleLanguageChange = async (languageCode: string) => {
    if (languageCode === currentLanguage) {
      onClose();
      return;
    }

    setIsChanging(true);
    const success = await setLanguage(languageCode);
    setIsChanging(false);

    if (success) {
      onClose();
    }
  };

  const currentLanguageInfo = getCurrentLanguageInfo();

  const renderLanguageItem = ({
    item,
  }: {
    item: (typeof availableLanguages)[0];
  }) => {
    const isSelected = item.code === currentLanguage;

    return (
      <Pressable
        style={[styles.languageItem, isSelected && styles.selectedLanguageItem]}
        onPress={() => handleLanguageChange(item.code)}
        disabled={isChanging}
      >
        <View style={styles.languageContent}>
          <Text
            style={[
              styles.languageName,
              { color: resolveTextColor("light") },
              isSelected && styles.selectedLanguageName,
            ]}
          >
            {item.nativeName}
          </Text>
          <Text
            style={[
              styles.languageCode,
              { color: resolveTextColor("light") },
              isSelected && styles.selectedLanguageCode,
            ]}
          >
            {item.name}
          </Text>
        </View>
        {isSelected && (
          <View style={styles.checkmark}>
            <Text
              style={[
                styles.checkmarkText,
                { color: resolveTextColor("light") },
              ]}
            >
              ✓
            </Text>
          </View>
        )}
      </Pressable>
    );
  };

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView
        style={[
          styles.container,
          { backgroundColor: resolveOverlayColor("dark") },
        ]}
      >
        <View style={styles.header}>
          <Text style={[styles.title, { color: resolveTextColor("light") }]}>
            Language
          </Text>
          <Pressable style={styles.closeButton} onPress={onClose}>
            <Text
              style={[
                styles.closeButtonText,
                { color: resolveTextColor("light") },
              ]}
            >
              {commonText.close}
            </Text>
          </Pressable>
        </View>

        <View style={styles.content}>
          <Text
            style={[
              styles.currentLanguageLabel,
              { color: resolveTextColor("light") },
            ]}
          >
            Current: {currentLanguageInfo.nativeName}
          </Text>

          <FlatList
            data={availableLanguages}
            keyExtractor={(item) => item.code}
            renderItem={renderLanguageItem}
            style={styles.languageList}
            showsVerticalScrollIndicator={false}
          />

          {isChanging && (
            <View style={styles.loadingOverlay}>
              <Text
                style={[
                  styles.loadingText,
                  { color: resolveTextColor("light") },
                ]}
              >
                {commonText.loading}
              </Text>
            </View>
          )}
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  title: {
    ...FONT_PRESETS.uiHeading,
    fontSize: 20,
  },
  closeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  closeButtonText: {
    ...FONT_PRESETS.uiButton,
    fontSize: 16,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  currentLanguageLabel: {
    ...FONT_PRESETS.uiCaption,
    marginTop: 20,
    marginBottom: 16,
    opacity: 0.7,
  },
  languageList: {
    flex: 1,
  },
  languageItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginVertical: 4,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
  },
  selectedLanguageItem: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  languageContent: {
    flex: 1,
  },
  languageName: {
    ...FONT_PRESETS.uiBody,
    fontSize: 18,
    fontWeight: "500",
    marginBottom: 2,
  },
  selectedLanguageName: {
    fontWeight: "600",
  },
  languageCode: {
    ...FONT_PRESETS.uiCaption,
    opacity: 0.7,
  },
  selectedLanguageCode: {
    opacity: 0.9,
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  checkmarkText: {
    ...FONT_PRESETS.uiBody,
    fontSize: 16,
    fontWeight: "600",
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    ...FONT_PRESETS.uiBody,
    fontSize: 16,
  },
});
