import { langs } from "@uiw/codemirror-extensions-langs";
import themes from "./themes";

export interface Comment {
  line: number;
  text: string;
}

export interface UrlDataModel {
  value: string;
  comments: Comment[];
  lang: Lang;
  theme: Theme;
}

export type Lang = keyof typeof langs;

export type Theme = keyof typeof themes;
// export type Theme = keyof typeof themes | "light" | "dark";
