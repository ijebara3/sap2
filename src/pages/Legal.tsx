import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Nav from "@/components/site/Nav";
import SiteFooter from "@/components/site/SiteFooter";
import { useLang } from "@/i18n/LanguageContext";

const Legal = ({ variant }: { variant: "privacy" | "terms" }) => {
  const { t } = useLang();
  const title = variant === "privacy" ? t.legal.privacyTitle : t.legal.termsTitle;
  const body = variant === "privacy" ? t.legal.privacyBody : t.legal.termsBody;

  return (
    <div className="min-h-screen flex flex-col">
      <Nav />
      <main className="flex-1 container mx-auto px-6 lg:px-10 pt-40 pb-24 max-w-3xl">
        <h1 className="text-4xl md:text-5xl font-semibold">{title}</h1>
        <p className="mt-6 lead text-muted-foreground">{body}</p>
        <a
          href="mailto:info@studioamsterdampodgast.nl"
          className="mt-4 inline-block text-lg font-semibold hover:text-primary smooth-hover"
        >
          info@studioamsterdampodgast.nl
        </a>
        <div className="mt-12">
          <Link to="/" className="inline-flex items-center gap-2 text-lg font-medium hover:text-primary smooth-hover">
            <ArrowLeft className="h-4 w-4" />
            {t.legal.back}
          </Link>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
};

export default Legal;
