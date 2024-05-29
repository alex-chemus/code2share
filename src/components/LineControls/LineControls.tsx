import { IconLayoutSidebarRight, IconMessage } from "@tabler/icons-react";
import "./LineControls.scss";
import { observer } from "mobx-react-lite";
import useButtonTop from "./useButtonTop";
import { useEffect, useState } from "react";
import { Button, Popover, Tooltip } from "antd";
import { Comment } from "../../App.types";
import CommentFormContent from "../CommentFormContent/CommentFormContent";

interface LineControlsProps {
  onCommentSave: (comment: Comment) => void;
}

function LineControlsComponent({ onCommentSave }: Readonly<LineControlsProps>) {
  const [isControlsOpen, setIsControlsOpen] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const { buttonTop } = useButtonTop();

  useEffect(() => {
    setIsFormOpen(false);
  }, [buttonTop]);

  const handleCommentSave = (comment: Comment) => {
    onCommentSave(comment);
    setIsFormOpen(false);
  };

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
