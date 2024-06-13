import { IconMessage } from "@tabler/icons-react";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { Button, Popover, theme } from "antd";
import { Comment } from "../../App.types";
import CommentFormContent from "../CommentFormContent/CommentFormContent";
import editorStore from "../../stores/EditorStore";
import { throttle } from "../../App.utils";
import linesStore from "../../stores/LinesStore";
import cn from "classnames";
import "./LineControls.scss";

interface LineControlsProps {
  sidebarOpen: boolean;
  onSidebarChange: (open: boolean) => void;
  onCommentSave: (comment: Comment) => void;
}

function LineControlsComponent({
  onCommentSave,
  onSidebarChange,
  sidebarOpen,
}: Readonly<LineControlsProps>) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [buttonTop, setButtonTop] = useState(0);

  const { token } = theme.useToken();

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

  useEffect(() => {
    if (!sidebarOpen) setIsFormOpen(false);
  }, [sidebarOpen]);

  const handleButtonClick = () => {
    setIsFormOpen((prev) => !prev);
    onSidebarChange(true);
  };

  const handleCommentSave = (comment: Comment) => {
    onCommentSave(comment);
    setIsFormOpen(false);
  };

  if (!isVisible)
    return <div className={cn("line-controls-wrapper", "--empty")} />;

  return (
    <div
      className={cn("line-controls-wrapper", {
        "--empty": !sidebarOpen,
      })}
    >
      <Popover
        open={isFormOpen}
        overlayClassName="line-controls-form"
        overlayStyle={{
          backgroundColor: token.colorBgBase,
        }}
        placement="right"
        autoAdjustOverflow={false}
        content={<CommentFormContent onSave={handleCommentSave} />}
      >
        <Button
          onClick={handleButtonClick}
          className={cn("line-control-button")}
          style={{ top: buttonTop }}
        >
          <IconMessage />
        </Button>
      </Popover>
    </div>
  );
}

const LineControls = observer(LineControlsComponent);
export default LineControls;
