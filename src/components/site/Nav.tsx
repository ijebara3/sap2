import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, AudioLines } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useLang } from "@/i18n/LanguageContext";
import { CAL_URL } from "@/i18n/translations";
import LangSwitch from "./LangSwitch";

export const NAV_IDS = [
  "studio",
  "inbegrepen",
  "impressie",
  "hoe-werkt-het",
  "prijzen",
  "locatie",
  "faq",
] as const;

const Nav = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { t } = useLang();
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const labels: Record<(typeof NAV_IDS)[number], string> = {
    studio: t.nav.studio,
    inbegrepen: t.nav.included,
    impressie: t.nav.impression,
    "hoe-werkt-het": t.nav.how,
    prijzen: t.nav.pricing,
    locatie: t.nav.location,
    faq: t.nav.faq,
  };

  const goTo = (id: string) => {
    setOpen(false);
    if (!isHome) {
      navigate(`/#${id}`);
      return;
    }
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const solid = scrolled || open || !isHome;

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        solid
          ? "bg-ink/95 backdrop-blur-xl border-b border-ink-border shadow-lift"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <nav className="container mx-auto px-6 lg:px-10">
        <div className={`flex items-center justify-between transition-all duration-500 ${solid ? "py-3.5" : "py-6"}`}>
          <button
            onClick={() => (isHome ? window.scrollTo({ top: 0, behavior: "smooth" }) : navigate("/"))}
            className="flex items-center gap-2.5 text-ink-foreground"
          >
            <AudioLines className="h-5 w-5 text-primary" />
            <span className="text-[15px] font-semibold tracking-tight">Amsterdam Studio Podcast</span>
          </button>

          <div className="hidden lg:flex items-center gap-7">
            {NAV_IDS.map((id) => (
              <button
                key={id}
                onClick={() => goTo(id)}
                className="text-[15px] font-medium text-ink-foreground/85 hover:text-ink-foreground smooth-hover relative after:absolute after:left-0 after:-bottom-1 after:h-px after:w-full after:origin-right after:scale-x-0 after:bg-primary after:transition-transform after:duration-300 hover:after:origin-left hover:after:scale-x-100"
              >
                {labels[id]}
              </button>
            ))}
            <LangSwitch />
            <a
              href={CAL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-primary px-5 py-2.5 text-[15px] font-semibold text-primary-foreground smooth-hover hover:brightness-110 hover:scale-[1.03]"
            >
              {t.nav.book}
            </a>
          </div>

          <div className="flex items-center gap-3 lg:hidden">
            <LangSwitch />
            <button
              onClick={() => setOpen((v) => !v)}
              aria-label={t.nav.menu}
              className="text-ink-foreground p-1"
            >
              {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="lg:hidden overflow-hidden"
            >
              <div className="flex flex-col gap-1 pb-6 pt-2">
                {NAV_IDS.map((id, i) => (
                  <motion.button
                    key={id}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 + i * 0.04 }}
                    onClick={() => goTo(id)}
                    className="text-left text-lg font-medium text-ink-foreground/90 py-2.5 border-b border-ink-border"
                  >
                    {labels[id]}
                  </motion.button>
                ))}
                <a
                  href={CAL_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 rounded-full bg-primary px-6 py-3.5 text-center text-base font-semibold text-primary-foreground"
                >
                  {t.nav.book}
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </motion.header>
  );
};

export default Nav;
