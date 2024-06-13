import { Button, Tooltip, message } from "antd";
import {
  IconLayoutSidebarRight,
  IconLayoutSidebarRightCollapse,
  IconShare,
} from "@tabler/icons-react";
import { useMemo } from "react";
import cx from "classnames/bind";
import s from "./MainControls.module.scss";

const cn = cx.bind(s);

interface MainControlsProps {
  sidebarOpen: boolean;
  onSidebarChange: (open: boolean) => void;
}

export default function MainControls({
  sidebarOpen,
  onSidebarChange,
}: Readonly<MainControlsProps>) {
  const [messageApi, contentHolder] = message.useMessage();

  const icon = useMemo(
    () =>
      sidebarOpen ? (
        <IconLayoutSidebarRightCollapse />
      ) : (
        <IconLayoutSidebarRight />
      ),
    [sidebarOpen]
  );

  const handleShare = () => {
    try {
      const textarea = document.createElement("textarea");
      textarea.textContent = window.location.href;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      messageApi.success("Скопировано!");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className={cn("main-controls")}>
      {contentHolder}
      <Tooltip
        title={sidebarOpen ? "Закрыть комментарии" : "Открыть комментарии"}
      >
        <Button icon={icon} onClick={() => onSidebarChange(!sidebarOpen)} />
      </Tooltip>
      <Tooltip title="Поделиться">
        <Button icon={<IconShare />} onClick={handleShare} />
      </Tooltip>
    </div>
  );
}
