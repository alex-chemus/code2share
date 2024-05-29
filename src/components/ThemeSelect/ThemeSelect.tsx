import { Select } from "antd";
import s from "./ThemeSelect.module.scss";
import { Theme } from "../../App.types";
import themes from "../../themes";

const themeOptions = ["dark", "light"]
  .concat(Object.keys(themes))
  .map((item) => ({ value: item, label: item }));

interface ThemeSelectProps {
  onChange: (theme: Theme) => void;
  value: Theme;
}

export default function ThemeSelect({ onChange, value }: ThemeSelectProps) {
  return (
    <div className={s["theme-select"]}>
      <Select
        options={themeOptions}
        onChange={onChange}
        value={value}
        showSearch
      />
    </div>
  );
}
