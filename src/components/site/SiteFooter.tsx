import { Link, useNavigate, useLocation } from "react-router-dom";
import { AudioLines } from "lucide-react";
import { useLang } from "@/i18n/LanguageContext";
import LangSwitch from "./LangSwitch";

const SiteFooter = () => {
  const { t } = useLang();
  const navigate = useNavigate();
  const location = useLocation();

  const goTo = (id: string) => {
    if (location.pathname !== "/") {
      navigate(`/#${id}`);
      return;
    }
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="bg-ink text-ink-foreground border-t border-ink-border">
      <div className="container mx-auto px-6 lg:px-10 py-16">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="flex items-center gap-2.5">
              <AudioLines className="h-5 w-5 text-primary" />
              <span className="text-lg font-semibold tracking-tight">Amsterdam Studio Podcast</span>
            </div>
            <p className="mt-4 text-ink-foreground/75 text-[17px] leading-relaxed">
              Oeverpad 300, 1068 PJ Amsterdam
            </p>
            <a
              href="mailto:info@studioamsterdampodgast.nl"
              className="mt-2 inline-block text-[17px] font-medium smooth-hover hover:text-primary"
            >
              info@studioamsterdampodgast.nl
            </a>
          </div>

          <nav className="flex flex-wrap gap-x-8 gap-y-3 text-[17px]">
            <button onClick={() => goTo("studio")} className="text-ink-foreground/80 hover:text-primary smooth-hover">
              {t.footer.studio}
            </button>
            <button onClick={() => goTo("prijzen")} className="text-ink-foreground/80 hover:text-primary smooth-hover">
              {t.footer.pricing}
            </button>
            <button onClick={() => goTo("locatie")} className="text-ink-foreground/80 hover:text-primary smooth-hover">
              {t.footer.location}
            </button>
            <a
              href="mailto:info@studioamsterdampodgast.nl"
              className="text-ink-foreground/80 hover:text-primary smooth-hover"
            >
              {t.footer.contact}
            </a>
            <Link to="/privacy" className="text-ink-foreground/80 hover:text-primary smooth-hover">
              {t.footer.privacy}
            </Link>
            <Link to="/voorwaarden" className="text-ink-foreground/80 hover:text-primary smooth-hover">
              {t.footer.terms}
            </Link>
          </nav>

          <LangSwitch />
        </div>

        <div className="mt-12 border-t border-ink-border pt-6 text-[15px] text-ink-foreground/55">
          &copy; {new Date().getFullYear()} Amsterdam Studio Podcast. {t.footer.rights}
        </div>
      </div>
    </footer>
  );
};

export default SiteFooter;
