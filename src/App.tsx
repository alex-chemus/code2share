import { Route, Routes, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import CodeEditor, { ReactCodeMirrorRef } from "@uiw/react-codemirror";
import * as alls from "@uiw/codemirror-themes-all";
import CommentPopover from "./components/CommentPopover/CommentPopover";
import { useDataToUrl, useDataFromUrl, sameComments } from "./App.utils";
import { Comment, Lang, Theme } from "./App.types";
import LineControls from "./components/LineControls/LineControls";
import linesStore from "./stores/LinesStore";
import ThemeSelect from "./components/ThemeSelect/ThemeSelect";
import LangsSelect from "./components/LangsSelect/LangsSelect";
import { langs } from "@uiw/codemirror-extensions-langs";
import { ConfigProvider } from "antd";
import getDesignTokens from "./getDesignTokens";
import themes from "./themes";
import editorStore from "./stores/EditorStore";
import MainControls from "./components/MainControls/MainControls";
import "./App.scss";

function App() {
  const location = useLocation();

  const editorRef = useRef<ReactCodeMirrorRef | null>(null);

  // Код, отображаемый в редакторе. По умолчанию - пустая строка
  const [value, setValue] = useState("");
  // Массив комментариев. По умолчанию - пустой массив
  const [comments, setComments] = useState<Comment[]>([]);
  // Цветовая тема. По умолчанию - material
  const [theme, setTheme] = useState<Theme>("material");
  // Язык программирования. По умолчанию - C
  const [lang, setLang] = useState<Lang>("c");
  // Флаг, открыто ли боковое меню. По умолчанию - false
  const [lineControlsOpen, setLineControlsOpen] = useState(false);

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
    root.dataset.testid = "root";
    root.dataset.lang = lang;
  }, [lang]);

  useEffect(() => {
    const root = document.querySelector("#root") as HTMLElement;
    const cmTheme = document.querySelector<HTMLDivElement>(".cm-theme");
    root.style.backgroundColor = themes[theme].background ?? "";
    if (cmTheme)
      cmTheme.style.border = `1px solid ${
        themes[theme].lineHighlight ?? themes[theme].selection
      }`;

    root.dataset.testid = "root";
    root.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    if (editorRef.current) {
      editorStore.setRef(editorRef.current);
    }
  }, [editorRef.current]);

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
              <MainControls
                sidebarOpen={lineControlsOpen}
                onSidebarChange={setLineControlsOpen}
              />
              <div className="edit-section">
                <CodeEditor
                  ref={editorRef}
                  value={value}
                  onChange={handleChange}
                  onStatistics={linesStore.handleStatsUpdate}
                  onUpdate={() => editorStore.refresh()}
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
                {lineControlsOpen &&
                  comments.map((comment) => (
                    <CommentPopover
                      key={comment.line}
                      comment={comment}
                      onDelete={handleDeleteComment}
                      onEdit={handleEditComment}
                    />
                  ))}
                <LineControls
                  sidebarOpen={lineControlsOpen}
                  onCommentSave={handleSaveComment}
                  onSidebarChange={setLineControlsOpen}
                />
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
