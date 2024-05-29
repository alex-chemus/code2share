import { Route, Routes, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import CodeEditor from "@uiw/react-codemirror";
import * as alls from "@uiw/codemirror-themes-all";
import CommentPopover from "./components/CommentPopover/CommentPopover";
import { useDataToUrl, useDataFromUrl, sameComments } from "./App.utils";
import { Comment, Lang, Theme } from "./App.types";
import LineControls from "./components/LineControls/LineControls";
import "./App.scss";
import linesStore from "./stores/LinesStore";
import ThemeSelect from "./components/ThemeSelect/ThemeSelect";
import LangsSelect from "./components/LangsSelect/LangsSelect";
import { langs } from "@uiw/codemirror-extensions-langs";
import { ConfigProvider } from "antd";
import getDesignTokens from "./getDesignTokens";
import themes from "./themes";

function App() {
  const location = useLocation();

  const [value, setValue] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [theme, setTheme] = useState<Theme>("material");
  const [lang, setLang] = useState<Lang>("c");

  const valueToUrl = useDataToUrl();
  const valueFromUrl = useDataFromUrl();

  useEffect(() => {
    const extractedData = valueFromUrl();
    if (
      !!extractedData &&
      (extractedData.value !== value ||
        !sameComments(extractedData.comments, comments) ||
        extractedData.lang !== lang ||
        extractedData.theme !== theme)
    ) {
      setValue(extractedData.value);
      setComments(extractedData.comments);
      setLang(extractedData.lang);
      setTheme(extractedData.theme);
    }
  }, [location.search]);

  useEffect(() => {
    const root = document.querySelector("#root") as HTMLElement;
    const appWrapper = document.querySelector("#app-wrapper") as HTMLElement;
    root.style.backgroundColor = themes[theme].background ?? "";
    appWrapper.style.border = `1px solid ${themes[theme].gutterActiveForeground}`;
  }, [theme]);

  const handleSaveComment = (comment: Comment) => {
    valueToUrl({ value, comments: [...comments, comment], lang, theme });
  };

  const handleDeleteComment = (line: number) => {
    valueToUrl({
      value,
      comments: comments.filter((comment) => comment.line !== line),
      lang,
      theme,
    });
  };

  const handleEditComment = (comment: Comment) => {
    valueToUrl({
      value,
      comments: [
        ...comments.filter((_comment) => _comment.line !== comment.line),
        comment,
      ].sort((a, b) => a.line - b.line),
      lang,
      theme,
    });
  };

  const handleLangChange = (_lang: Lang) => {
    valueToUrl({ value, comments, lang: _lang, theme });
  };

  const handleThemeChange = (_theme: Theme) => {
    console.log(_theme);
    valueToUrl({ value, comments, lang, theme: _theme });
  };

  const handleChange = (_value: string) => {
    valueToUrl({ value: _value, comments, lang, theme });
  };

  return (
    <ConfigProvider theme={getDesignTokens(theme)}>
      <Routes>
        <Route
          path="*"
          element={
            <div id="app-wrapper">
              <div className="edit-section">
                <CodeEditor
                  value={value}
                  onChange={handleChange}
                  onStatistics={linesStore.handleStatsUpdate}
                  extensions={[langs[lang]()]}
                  // @ts-ignore
                  theme={alls[theme as keyof typeof alls] || theme}
                  height="100%"
                  style={{
                    width: "100%",
                    position: "relative",
                    zIndex: 999,
                  }}
                />
                {comments.map((comment) => (
                  <CommentPopover
                    key={comment.line}
                    comment={comment}
                    onDelete={handleDeleteComment}
                    onEdit={handleEditComment}
                  />
                ))}
                <LineControls onCommentSave={handleSaveComment} />
              </div>
              <div className="edit-section__selects">
                <ThemeSelect onChange={handleThemeChange} value={theme} />
                <LangsSelect onChange={handleLangChange} value={lang} />
              </div>
            </div>
          }
        />
      </Routes>
    </ConfigProvider>
  );
}

export default App;