import { Button, Flex, Popover } from "antd";
import { useEffect, useMemo, useState } from "react";
import { Comment } from "../../App.types";
import linesStore from "../../stores/LinesStore";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import CommentFormContent from "../CommentFormContent/CommentFormContent";

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
  const [lineElement, setLineElement] = useState<Element | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setLineElement(
        document.querySelector(`.cm-editor .cm-line:nth-child(${comment.line})`)
      );
    }, 100);
  }, [linesStore.linesCount]);

  const offsetTop = useMemo(() => {
    if (!lineElement) return;
    // const { y } = lineElement.getBoundingClientRect();
    return `${(lineElement as HTMLElement).offsetTop - 12}px`;
  }, [lineElement]);

  const popoverContent = useMemo(
    () => (
      <Flex>
        <div>{comment.text}</div>
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

  return lineElement ? (
    <Popover
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
      open={Boolean(lineElement)}
      overlayStyle={{
        top: offsetTop,
        left: "30px",
      }}
    />
  ) : null;
}
