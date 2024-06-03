import { ReactCodeMirrorRef } from "@uiw/react-codemirror";
import { makeAutoObservable } from "mobx";

class EditorStore {
  ref: ReactCodeMirrorRef | null = null;
  refresher = Symbol();

  constructor() {
    makeAutoObservable(this);
  }

  setRef = (_ref: ReactCodeMirrorRef) => {
    this.ref = _ref;
  };

  refresh = () => {
    this.refresher = Symbol();
  };

  get scroller() {
    return this.ref?.editor
      ? this.ref.editor.querySelector<HTMLDivElement>(".cm-scroller")
      : null;
  }
}

const editorStore = new EditorStore();
export default editorStore;
