import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { Mail, MapPin } from "lucide-react";
import { useLang } from "@/i18n/LanguageContext";

const MAP_SRC =
  "https://www.google.com/maps?q=Oeverpad+300,+1068+PJ+Amsterdam,+Nederland&output=embed";

const LocationContact = () => {
  const { t } = useLang();
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["6%", "-6%"]);

  const addressLines = ["Oeverpad 300", "1068 PJ Amsterdam", t.location.name === "Amsterdam Studio Podcast" ? "Nederland" : "Netherlands"];

  return (
    <section id="locatie" className="bg-background py-24 lg:py-32">
      <div ref={ref} className="container mx-auto px-6 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16 items-stretch">
          <div className="lg:col-span-5">
            <motion.span
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.6 }}
              className="section-label text-primary block"
            >
              {t.location.label}
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.7, delay: 0.05 }}
              className="mt-5 text-3xl md:text-5xl font-semibold leading-[1.08]"
            >
              {t.location.title}
            </motion.h2>

            <div className="mt-10">
              <p className="section-label text-muted-foreground">{t.location.addressLabel}</p>
              <address className="mt-3 not-italic">
                <span className="block text-xl font-semibold">{t.location.name}</span>
                {addressLines.map((line, i) => (
                  <motion.span
                    key={line}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.6 }}
                    transition={{ duration: 0.5, delay: 0.1 + i * 0.1 }}
                    className="block text-lg text-muted-foreground"
                  >
                    {line}
                  </motion.span>
                ))}
              </address>
            </div>

            <div className="mt-8">
              <p className="section-label text-muted-foreground">{t.location.emailLabel}</p>
              <a
                href={`mailto:${t.location.email}`}
                className="mt-3 inline-flex items-center gap-2 text-lg font-semibold smooth-hover hover:text-primary"
              >
                <Mail className="h-4 w-4" />
                {t.location.email}
              </a>
            </div>

            <div className="mt-10 rounded-lg border border-border bg-secondary/60 p-6">
              <p className="section-label text-muted-foreground">{t.location.soonLabel}</p>
              <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-[17px] text-muted-foreground">
                {t.location.soon.map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <motion.div
            style={{ y }}
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-7 overflow-hidden rounded-lg border border-border shadow-lift min-h-[380px]"
          >
            <iframe
              title={t.location.mapTitle}
              src={MAP_SRC}
              className="h-full min-h-[380px] w-full lg:min-h-[560px]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              style={{ border: 0 }}
              allowFullScreen
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default LocationContact;
