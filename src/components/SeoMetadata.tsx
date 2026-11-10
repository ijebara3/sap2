import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useLang } from "@/i18n/LanguageContext";

const SITE_URL = "https://studioamsterdampodgast.nl";
const SOCIAL_IMAGE = `${SITE_URL}/assets/studio-1-1280-BXcpK6hy.webp`;

const pages = {
  nl: {
    home: {
      title: "Podcaststudio huren in Amsterdam vanaf €99 | Amsterdam Studio Podcast",
      description: "Huur een professionele podcaststudio in Amsterdam. Neem audio en video op met microfoons, camera's en licht die klaarstaan. Bekijk beschikbaarheid vanaf €99.",
      imageAlt: "Opnametafel met twee microfoons en camera in de podcaststudio",
      businessDescription: "Professionele podcaststudio in Amsterdam voor audio- en video-opnames, met een voorbereide opnameset.",
    },
    privacy: "Privacy | Amsterdam Studio Podcast",
    terms: "Voorwaarden | Amsterdam Studio Podcast",
    notFound: "Pagina niet gevonden | Amsterdam Studio Podcast",
  },
  en: {
    home: {
      title: "Podcast Studio Rental in Amsterdam from €99 | Amsterdam Studio Podcast",
      description: "Rent a professional podcast studio in Amsterdam for audio and video recording. Microphones, cameras and lighting are ready. Check availability from €99.",
      imageAlt: "Podcast recording table with two microphones and a camera",
      businessDescription: "Professional podcast studio in Amsterdam for audio and video recording, with a prepared recording setup.",
    },
    privacy: "Privacy | Amsterdam Studio Podcast",
    terms: "Terms | Amsterdam Studio Podcast",
    notFound: "Page not found | Amsterdam Studio Podcast",
  },
} as const;

const setMeta = (attribute: "name" | "property", key: string, content?: string) => {
  const selector = `meta[${attribute}="${key}"]`;
  let element = document.head.querySelector<HTMLMetaElement>(selector);
  if (!content) {
    element?.remove();
    return;
  }
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.content = content;
};

const setCanonical = (url?: string) => {
  let element = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!url) {
    element?.remove();
    return;
  }
  if (!element) {
    element = document.createElement("link");
    element.rel = "canonical";
    document.head.appendChild(element);
  }
  element.href = url;
};

const SeoMetadata = () => {
  const { pathname } = useLocation();
  const { lang } = useLang();

  useEffect(() => {
    const home = pathname === "/";
    const page = pages[lang];
    const title = home
      ? page.home.title
      : pathname === "/privacy"
        ? page.privacy
        : pathname === "/voorwaarden"
          ? page.terms
          : page.notFound;
    const description = home ? page.home.description : undefined;

    document.title = title;
    document.documentElement.lang = lang;
    setMeta("name", "description", description);
    setMeta("name", "robots", home ? "index, follow" : "noindex, follow");
    setMeta("property", "og:title", title);
    setMeta("property", "og:description", description);
    setMeta("property", "og:type", home ? "website" : undefined);
    setMeta("property", "og:url", home ? `${SITE_URL}/` : undefined);
    setMeta("property", "og:site_name", "Amsterdam Studio Podcast");
    setMeta("property", "og:locale", lang === "nl" ? "nl_NL" : "en_NL");
    setMeta("property", "og:locale:alternate", lang === "nl" ? "en_NL" : "nl_NL");
    setMeta("property", "og:image", home ? SOCIAL_IMAGE : undefined);
    setMeta("property", "og:image:alt", home ? page.home.imageAlt : undefined);
    setMeta("name", "twitter:card", home ? "summary_large_image" : undefined);
    setMeta("name", "twitter:title", home ? title : undefined);
    setMeta("name", "twitter:description", description);
    setMeta("name", "twitter:image", home ? SOCIAL_IMAGE : undefined);
    setMeta("name", "twitter:image:alt", home ? page.home.imageAlt : undefined);
    setCanonical(home ? `${SITE_URL}/` : undefined);

    let businessSchema = document.getElementById("business-schema");
    if (home && !businessSchema) {
      const script = document.createElement("script");
      script.id = "business-schema";
      script.type = "application/ld+json";
      document.head.appendChild(script);
      businessSchema = script;
    }
    if (home && businessSchema) {
      businessSchema.textContent = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "@id": `${SITE_URL}/#localbusiness`,
        name: "Amsterdam Studio Podcast",
        url: `${SITE_URL}/`,
        image: SOCIAL_IMAGE,
        description: page.home.businessDescription,
        email: "info@studioamsterdampodgast.nl",
        address: {
          "@type": "PostalAddress",
          streetAddress: "Oeverpad 300",
          postalCode: "1068 PJ",
          addressLocality: "Amsterdam",
          addressCountry: "NL",
        },
      });
    } else {
      businessSchema?.remove();
    }
  }, [lang, pathname]);

  return null;
};

export default SeoMetadata;
