import { langs as rawLangs } from "@uiw/codemirror-extensions-langs";
import { Select } from "antd";
import s from "./LangsSelect.module.scss";
import { Lang } from "../../App.types";

const langs = Object.keys(rawLangs).map((lang) => ({
  value: lang as Lang,
  label: lang as Lang,
}));

interface LangsSelectProps {
  onChange: (lang: Lang) => void;
  value: Lang;
}

export default function LangsSelect({ onChange, value }: LangsSelectProps) {
  return (
    <div className={s["langs-select"]}>
      <Select options={langs} onChange={onChange} value={value} showSearch />
    </div>
  );
}
