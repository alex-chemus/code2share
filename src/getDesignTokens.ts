import { ThemeConfig } from "antd";
import { Theme } from "./App.types";
import themes from "./themes";

const getDesignTokens = (theme: Theme): ThemeConfig => {
  return {
    token: {
      colorBgBase: themes[theme].gutterBackground,
      colorTextBase: themes[theme].gutterForeground,
      colorPrimary: themes[theme].caret,
      fontSize: 16,
    },
    components: {
      Select: {
        fontSize: 18,
      },
    },
  };
};

export default getDesignTokens;
