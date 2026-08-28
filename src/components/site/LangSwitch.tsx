import { useLang } from "@/i18n/LanguageContext";

interface Props {
  tone?: "light" | "dark";
}

const LangSwitch = ({ tone = "light" }: Props) => {
  const { lang, setLang } = useLang();

  const base = "px-2 py-1 text-[13px] font-semibold tracking-wide rounded-full smooth-hover";
  const activeCls = tone === "light" ? "bg-primary text-primary-foreground" : "bg-foreground text-background";
  const idleCls = tone === "light" ? "text-ink-foreground/60 hover:text-ink-foreground" : "text-muted-foreground hover:text-foreground";

  return (
    <div
      className={`flex items-center gap-0.5 rounded-full border p-0.5 ${
        tone === "light" ? "border-ink-border" : "border-border"
      }`}
      role="group"
      aria-label="Language"
    >
      <button onClick={() => setLang("nl")} className={`${base} ${lang === "nl" ? activeCls : idleCls}`}>
        NL
      </button>
      <button onClick={() => setLang("en")} className={`${base} ${lang === "en" ? activeCls : idleCls}`}>
        EN
      </button>
    </div>
  );
};

export default LangSwitch;
