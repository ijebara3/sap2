import { Link } from "react-router-dom";
import { useLang } from "@/i18n/LanguageContext";

const NotFound = () => {
  const { t } = useLang();

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted px-6 py-12">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">404</h1>
        <p className="mb-4 text-xl text-muted-foreground">{t.notFound.message}</p>
        <Link to="/" className="text-primary underline hover:text-primary/90">
          {t.notFound.back}
        </Link>
      </div>
    </main>
  );
};

export default NotFound;
