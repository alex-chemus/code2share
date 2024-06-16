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

const URL_LIMIT = 2048;

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

  const showMessage = () => {
    /* eslint-disable @typescript-eslint/no-floating-promises */
    if (window.location.href.length > URL_LIMIT) {
      messageApi.warning(
        "Ссылка очень длинная! Некоторые браузеры могут некорректно ее обрабатывать"
      );
    } else {
      messageApi.success("Скопировано!");
    }
    /* eslint-enable @typescript-eslint/no-floating-promises */
  };

  const handleShare = () => {
    try {
      const textarea = document.createElement("textarea");
      textarea.textContent = window.location.href;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      showMessage();
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
