import { IconLayoutSidebarRight, IconMessage } from "@tabler/icons-react";
import "./LineControls.scss";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { Button, Popover, Tooltip } from "antd";
import { Comment } from "../../App.types";
import CommentFormContent from "../CommentFormContent/CommentFormContent";
import editorStore from "../../stores/EditorStore";
import { throttle } from "../../App.utils";
import linesStore from "../../stores/LinesStore";

interface LineControlsProps {
  onCommentSave: (comment: Comment) => void;
}

function LineControlsComponent({ onCommentSave }: Readonly<LineControlsProps>) {
  const [isControlsOpen, setIsControlsOpen] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [buttonTop, setButtonTop] = useState(0);

  useEffect(() => {
    const handleContentScroll = throttle(() => {
      const currentLineElem =
        editorStore.ref?.editor?.querySelector<HTMLDivElement>(
          ".cm-activeLine"
        );
      const offsetTop =
        (currentLineElem?.offsetTop ?? 0) -
        (editorStore.scroller?.scrollTop ?? 0);
      setIsVisible(offsetTop >= 0);
      setButtonTop(offsetTop);
    }, 5);

    editorStore.scroller?.addEventListener("scroll", handleContentScroll);

    return () => {
      editorStore.scroller?.removeEventListener("scroll", handleContentScroll);
    };
  }, [editorStore.refresher]);

  useEffect(() => {
    const currentLineElem = document.querySelector<HTMLDivElement>(
      `.cm-line:nth-child(${linesStore.currentLine})`
    );

    const topOffset =
      (currentLineElem?.offsetTop ?? 0) -
      (editorStore.scroller?.scrollTop ?? 0);

    setButtonTop(topOffset);
  }, [linesStore.currentLine]);

  useEffect(() => {
    setIsFormOpen(false);
  }, [buttonTop]);

  const handleCommentSave = (comment: Comment) => {
    onCommentSave(comment);
    setIsFormOpen(false);
  };

  if (!isVisible) return <div className="line-controls-wrapper" />;

  return isControlsOpen ? (
    <div className="line-controls-wrapper">
      <Popover
        open={isFormOpen}
        content={<CommentFormContent onSave={handleCommentSave} />}
      >
        <Button
          onClick={() => setIsFormOpen((prev) => !prev)}
          className="line-control-button"
          style={{ top: buttonTop }}
        >
          <IconMessage />
        </Button>
      </Popover>
    </div>
  ) : (
    <Tooltip title="Комментарии">
      <Button
        icon={<IconLayoutSidebarRight />}
        onClick={() => setIsControlsOpen(true)}
      />
    </Tooltip>
  );
}

const LineControls = observer(LineControlsComponent);
export default LineControls;
