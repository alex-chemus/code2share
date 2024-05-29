import { Statistics } from "@uiw/react-codemirror";
import { makeAutoObservable } from "mobx";

class LinesStore {
  currentLine = 0;
  linesCount = 0;

  constructor() {
    makeAutoObservable(this);
  }

  handleStatsUpdate = (stats: Statistics) => {
    this.currentLine = stats.line.number;
    this.linesCount = stats.lineCount;
  };
}

const linesStore = new LinesStore();
export default linesStore;
