import { Button, Flex, Popover } from "antd";
import { useEffect, useMemo, useState } from "react";
import { Comment } from "../../App.types";
import linesStore from "../../stores/LinesStore";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import CommentFormContent from "../CommentFormContent/CommentFormContent";
import { throttle } from "../../App.utils";
import editorStore from "../../stores/EditorStore";
import s from "./CommentPopover.module.scss";
import cx from "classnames/bind";

const cn = cx.bind(s);

interface CommentPopoverProps {
  comment: Comment;
  onDelete: (line: number) => void;
  onEdit: (comment: Comment) => void;
}

export default function CommentPopover({
  comment,
  onDelete,
  onEdit,
}: CommentPopoverProps) {
  const [offsetTop, setOffsetTop] = useState<number | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleContentScroll = throttle(() => {
      const currentLineElem =
        editorStore.ref?.editor?.querySelector<HTMLDivElement>(
          `.cm-editor .cm-line:nth-child(${comment.line})`
        );

      const _isVisible =
        (currentLineElem?.offsetTop ?? 0) >
        (editorStore.scroller?.scrollTop ?? 0);

      if (!_isVisible) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
        const _offsetTop =
          (currentLineElem?.offsetTop ?? 0) -
          (editorStore.scroller?.scrollTop ?? 0);
        setOffsetTop(_offsetTop);
      }
    }, 5);

    editorStore.scroller?.addEventListener("scroll", handleContentScroll);

    return () => {
      editorStore.scroller?.removeEventListener("scroll", handleContentScroll);
    };
  }, [editorStore.refresher]);

  useEffect(() => {
    setTimeout(() => {
      const lineElement = document.querySelector(
        `.cm-editor .cm-line:nth-child(${comment.line})`
      );
      setOffsetTop(
        !lineElement ? null : (lineElement as HTMLElement).offsetTop - 12
      );
    }, 100);
  }, [linesStore.linesCount]);

  const popoverContent = useMemo(
    () => (
      <Flex gap="small" align="center">
        <div className={cn("comment-text")}>{comment.text}</div>
        <Button icon={<IconTrash />} onClick={() => onDelete?.(comment.line)} />
        <Button icon={<IconEdit />} onClick={() => setIsEditing(true)} />
      </Flex>
    ),
    [comment]
  );

  const handleCommentEdit = (comment: Comment) => {
    onEdit(comment);
    setIsEditing(false);
  };

  if (!isVisible) return <></>;

  return offsetTop ? (
    <Popover
      placement="rightTop"
      autoAdjustOverflow={false}
      overlayClassName={cn("comment-popover")}
      key={comment.line}
      getPopupContainer={() =>
        document.querySelector(".line-controls-wrapper") as HTMLElement
      }
      content={
        isEditing ? (
          <CommentFormContent
            value={comment.text}
            onSave={handleCommentEdit}
            line={comment.line}
          />
        ) : (
          popoverContent
        )
      }
      open={Boolean(offsetTop)}
      overlayStyle={{
        top: `${offsetTop}px`,
        left: "30px",
      }}
    />
  ) : null;
}
