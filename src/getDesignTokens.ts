import { ThemeConfig } from "antd";
import { Theme } from "./App.types";
import themes from "./themes";

const getDesignTokens = (theme: Theme): ThemeConfig => {
  return {
    token: {
      colorBgBase: themes[theme].background,
      colorTextBase: themes[theme].foreground,
      colorPrimary:
        themes[theme].lineHighlight ?? themes[theme].gutterForeground,
      fontSize: 16,
    },
    components: {
      Select: {
        fontSize: 18,
      },
      Popover: {
        colorBgElevated:
          themes[theme].lineHighlight ?? themes[theme].gutterForeground,
      },
    },
  };
};

export default getDesignTokens;
