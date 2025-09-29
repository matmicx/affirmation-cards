declare module "react-native-svg" {
  import * as React from "react";
  import { ViewProps } from "react-native";

  export interface SvgProps extends ViewProps {
    width?: number | string;
    height?: number | string;
    viewBox?: string;
    preserveAspectRatio?: string;
  }

  export default class Svg extends React.Component<SvgProps> {}

  export interface CircleProps extends SvgProps {
    cx?: number | string;
    cy?: number | string;
    r?: number | string;
    stroke?: string;
    strokeWidth?: number | string;
    strokeDasharray?: string | number[];
    strokeDashoffset?: number;
    strokeLinecap?: "butt" | "round" | "square";
    fill?: string;
  }

  export class Circle extends React.Component<CircleProps> {}

  export interface RectProps extends SvgProps {
    x?: number | string;
    y?: number | string;
    width?: number | string;
    height?: number | string;
    rx?: number | string;
    ry?: number | string;
    stroke?: string;
    strokeWidth?: number | string;
    strokeDasharray?: string | number[];
    strokeDashoffset?: number;
    strokeLinecap?: "butt" | "round" | "square";
    fill?: string;
    transform?: string;
  }

  export class Rect extends React.Component<RectProps> {}

  export interface DefsProps {
    children?: React.ReactNode;
  }
  export class Defs extends React.Component<DefsProps> {}

  export interface LinearGradientProps {
    id?: string;
    x1?: number | string;
    y1?: number | string;
    x2?: number | string;
    y2?: number | string;
    children?: React.ReactNode;
  }
  export class LinearGradient extends React.Component<LinearGradientProps> {}

  export interface StopProps {
    offset?: number | string;
    stopColor?: string;
    stopOpacity?: number | string;
  }
  export class Stop extends React.Component<StopProps> {}

  export interface PathProps extends SvgProps {
    d: string;
    stroke?: string;
    strokeWidth?: number | string;
    strokeDasharray?: string | number[];
    strokeDashoffset?: number | string;
    strokeLinecap?: "butt" | "round" | "square";
    fill?: string;
    transform?: string;
  }
  export class Path extends React.Component<PathProps> {}
}
