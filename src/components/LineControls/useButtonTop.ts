import { useEffect, useState } from "react";
import linesStore from "../../stores/LinesStore";

const throttle = (fn: () => void, delay: number) => {
  let flag = true;
  return () => {
    if (flag) {
      fn();
      flag = false;
      setTimeout(() => (flag = true), delay);
    }
  };
};

export default function useButtonTop() {
  const [buttonTop, setButtonTop] = useState(0);

  useEffect(() => {
    const scrollerElem = document.querySelector<HTMLDivElement>(".cm-scroller");

    const handleContentScroll = throttle(() => {
      const scrollerElem =
        document.querySelector<HTMLDivElement>(".cm-scroller");
      const currentLineElem =
        document.querySelector<HTMLDivElement>(".cm-activeLine");

      const offsetTop =
        (currentLineElem?.offsetTop ?? 0) - (scrollerElem?.scrollTop ?? 0);

      setButtonTop(offsetTop);
    }, 15);

    setTimeout(() =>
      scrollerElem?.addEventListener("scroll", handleContentScroll)
    );

    return () => {
      scrollerElem?.removeEventListener("scroll", handleContentScroll);
    };
  }, []);

  useEffect(() => {
    const scrollerElem = document.querySelector<HTMLDivElement>(".cm-scroller");
    const currentLineElem = document.querySelector<HTMLDivElement>(
      `.cm-line:nth-child(${linesStore.currentLine})`
    );

    const topOffset =
      (currentLineElem?.offsetTop ?? 0) - (scrollerElem?.scrollTop ?? 0);

    setButtonTop(topOffset);
  }, [linesStore.currentLine]);

  return { buttonTop };
}
