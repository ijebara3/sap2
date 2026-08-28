import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useLang } from "@/i18n/LanguageContext";
import studio1 from "@/assets/studio-1.jpg";
import studio2 from "@/assets/studio-2.jpg";
import studio3 from "@/assets/studio-3.jpg";

const Studio = () => {
  const { t } = useLang();
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });

  const yA = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["8%", "-10%"]);
  const yB = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["-4%", "12%"]);
  const yC = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["12%", "-6%"]);

  return (
    <section id="studio" className="bg-background py-24 lg:py-32">
      <div ref={ref} className="container mx-auto px-6 lg:px-10">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-16 items-start">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-5 lg:sticky lg:top-28"
          >
            <span className="section-label text-primary">{t.studio.label}</span>
            <h2 className="mt-5 text-3xl md:text-5xl font-semibold leading-[1.08] text-balance">
              {t.studio.title}
            </h2>
            <p className="mt-6 lead text-muted-foreground max-w-md">{t.studio.body}</p>

            <ul className="mt-8 flex flex-wrap gap-3">
              {t.studio.tags.map((tag, i) => (
                <motion.li
                  key={tag}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="rounded-full border border-border bg-secondary px-4 py-2 text-[15px] font-medium"
                >
                  {tag}
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <div className="lg:col-span-7 relative">
            <motion.div
              style={{ y: yA }}
              initial={{ opacity: 0, scale: 0.97 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="relative z-10 overflow-hidden rounded-lg shadow-lift"
            >
              <img
                src={studio1}
                alt="Opnametafel met microfoons in de podcaststudio in Amsterdam"
                loading="lazy"
                width={1600}
                height={1104}
                className="w-full h-[46vh] lg:h-[60vh] object-cover smooth-hover hover:scale-[1.03]"
              />
            </motion.div>

            <motion.div
              style={{ y: yB, rotate: reduce ? 0 : -3 }}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.9, delay: 0.15 }}
              className="absolute -bottom-16 -left-4 lg:-left-24 z-20 w-40 lg:w-60 overflow-hidden rounded-lg shadow-lift border-4 border-background"
            >
              <img
                src={studio2}
                alt="Detail van een professionele microfoon in de studio"
                loading="lazy"
                width={1408}
                height={1760}
                className="w-full h-56 lg:h-80 object-cover"
              />
            </motion.div>

            <motion.div
              style={{ y: yC, rotate: reduce ? 0 : 2 }}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.9, delay: 0.25 }}
              className="hidden lg:block absolute -bottom-24 right-0 z-0 w-72 overflow-hidden rounded-lg shadow-lift border-4 border-background"
            >
              <img
                src={studio3}
                alt="Zithoek van de podcaststudio met opnameopstelling"
                loading="lazy"
                width={1600}
                height={1104}
                className="w-full h-48 object-cover"
              />
            </motion.div>
          </div>
        </div>
        <div className="h-24 lg:h-32" />
      </div>
    </section>
  );
};

export default Studio;
