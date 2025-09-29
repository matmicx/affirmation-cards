declare module "react-native-svg" {
  import * as React from "react";
  import { ViewProps } from "react-native";

  export interface SvgProps extends ViewProps {
    width?: number | string;
    height?: number | string;
    viewBox?: string;
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
  }

  export class Rect extends React.Component<RectProps> {}
}
