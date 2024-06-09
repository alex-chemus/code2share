import { useLocation, useNavigate } from "react-router-dom";
import { CreateThemeOptions } from "@uiw/codemirror-themes";
// @ts-ignore
import * as pako from "pako";
import { UrlDataModel, Comment } from "./App.types";

export const compress = (value: string): string => {
  /* eslint-disable */
  const u8 = pako.deflate(value);
  const binaryString = String.fromCharCode.apply(null, u8);
  return btoa(binaryString);
  /* eslint-enable */
};

export const decompress = (value: string): string => {
  /* eslint-disable */
  const binaryString = atob(value);
  const buff = binaryString.split("").map((char) => char.charCodeAt(0));
  const u8 = new Uint8Array(buff.length);
  buff.forEach((char, i) => (u8[i] = char));
  return pako.inflate(u8, { to: "string" });
  /* eslint-enable */
};

export const useDataFromUrl = () => {
  const location = useLocation();

  return () => {
    const search = new URLSearchParams(location.search);
    const extractedEncoding = search.get("c");
    const decompressedData =
      extractedEncoding !== null
        ? (JSON.parse(decompress(extractedEncoding)) as UrlDataModel)
        : null;
    return decompressedData ?? null;
  };
};

export const useDataToUrl = () => {
  const navigate = useNavigate();

  return (data: UrlDataModel) => {
    const searchParams = new URLSearchParams();
    const encoding = compress(JSON.stringify(data));
    searchParams.set("c", encoding);
    const newUrl = `${import.meta.env.BASE_URL}?${searchParams.toString()}`;
    navigate(newUrl);
  };
};

export const sameComments = (arr1: Comment[], arr2: Comment[]) => {
  return (
    arr1.length === arr2.length &&
    arr1.every((item1, i) => {
      return arr2[i].line === item1.line && arr2[i].text === item1.text;
    })
  );
};

export const throttle = (fn: () => void, delay: number) => {
  let flag = true;
  return () => {
    if (flag) {
      fn();
      flag = false;
      setTimeout(() => (flag = true), delay);
    }
  };
};

export const testTheme = (settings: CreateThemeOptions["settings"]) => {
  /* eslint-disable no-prototype-builtins */
  console.log(settings);
  console.log("background", settings.hasOwnProperty("background"));
  console.log("caret", settings.hasOwnProperty("caret"));
  console.log("foreground", settings.hasOwnProperty("foreground"));
  console.log(
    "gutterActiveForeground",
    settings.hasOwnProperty("gutterActiveForeground")
  );
  console.log("gutterBackground", settings.hasOwnProperty("gutterBackground"));
  console.log("gutterForeground", settings.hasOwnProperty("gutterForeground"));
  console.log("lineHighlight", settings.hasOwnProperty("lineHighlight"));
  console.log("selection", settings.hasOwnProperty("selection"));
  console.log("selectionMatch", settings.hasOwnProperty("selectionMatch"));
  /* eslint-enable no-prototype-builtins */
};
