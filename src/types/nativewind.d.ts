declare module "nativewind" {
  import { ComponentType } from "react";
  import { ViewProps, TextProps } from "react-native";

  type StyledProps = {
    className?: string;
  };

  export function styled<T extends ComponentType<any>>(
    Component: T
  ): ComponentType<T extends ComponentType<infer P> ? P & StyledProps : never>;
}
