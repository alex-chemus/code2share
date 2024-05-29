import { Button, Input } from "antd";
import { useEffect, useState } from "react";
import linesStore from "../../stores/LinesStore";
import { Comment } from "../../App.types";
import { observer } from "mobx-react-lite";

interface CommentFormContentProps {
  value?: string;
  line?: number;
  onSave: (comment: Comment) => void;
}

function CommentFormContentComponent({
  value,
  line,
  onSave,
}: CommentFormContentProps) {
  const [commentValue, setCommentValue] = useState(value ?? "");

  useEffect(() => {
    setCommentValue(value ?? "");
  }, [value]);

  const handleCommentSave = () => {
    onSave({
      line: line ?? linesStore.currentLine,
      text: commentValue,
    });
    setCommentValue("");
  };

  return (
    <>
      <Input
        value={commentValue}
        onChange={(e) => setCommentValue(e.target.value)}
      />
      <Button onClick={handleCommentSave}>Comment</Button>
    </>
  );
}

const CommentFormContent = observer(CommentFormContentComponent);
export default CommentFormContent;
