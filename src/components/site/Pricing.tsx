import { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useLang } from "@/i18n/LanguageContext";
import { CAL_URL } from "@/i18n/translations";

const EASE = [0.22, 1, 0.36, 1] as const;

const Pricing = () => {
  const { t } = useLang();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const amountY = useTransform(scrollYProgress, [0, 1], [24, -24]);
  const tickerX = useTransform(scrollYProgress, [0, 1], ["4%", "-16%"]);
  const amountRef = useRef<HTMLDivElement>(null);
  const amountInView = useInView(amountRef, { once: true, amount: 0.4 });

  return (
    <section id="prijzen" ref={ref} className="relative overflow-hidden bg-surface text-surface-foreground py-24 lg:py-36">
      <div className="container mx-auto px-6 lg:px-10">
        <motion.span
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="section-label text-primary block"
        >
          {t.pricing.label}
        </motion.span>

        <div className="mt-10 grid gap-12 lg:grid-cols-12 lg:gap-16 items-end">
          <div className="lg:col-span-7">
            <div className="overflow-hidden">
              <motion.h2
                initial={{ opacity: 0, y: 48 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.9, ease: EASE }}
                className="text-4xl md:text-6xl font-semibold leading-[1.02] tracking-tight"
              >
                {t.pricing.titleA}{" "}
                <span className="text-muted-foreground font-normal italic">{t.pricing.titleB}</span>
              </motion.h2>
            </div>

            <motion.p
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.7, delay: 0.15, ease: EASE }}
              className="mt-8 lead text-muted-foreground max-w-xl"
            >
              {t.pricing.body}
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.7, delay: 0.25, ease: EASE }}
              className="mt-4 lead text-muted-foreground max-w-xl"
            >
              {t.pricing.body2}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.7, delay: 0.35, ease: EASE }}
              className="mt-10"
            >
              <a
                href={CAL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-foreground px-9 py-4.5 text-base font-semibold text-background transition-colors duration-300 hover:bg-primary hover:text-primary-foreground"
              >
                <span className="relative z-10">{t.pricing.cta}</span>
                <ArrowUpRight className="relative z-10 h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:rotate-12" />
              </a>
            </motion.div>
          </div>

          <div className="lg:col-span-5 flex justify-start lg:justify-end">
            <motion.div style={{ y: amountY }} className="relative">
              <div ref={amountRef} className="overflow-hidden">
                <motion.span
                  initial={{ opacity: 0, y: 90, rotate: -3 }}
                  animate={amountInView ? { opacity: 1, y: 0, rotate: -2 } : undefined}
                  transition={{ duration: 1.1, delay: 0.1, ease: EASE }}
                  className="block font-display text-[38vw] lg:text-[13vw] leading-[0.8] text-primary select-none"
                >
                  {t.pricing.amount}
                </motion.span>
              </div>
              <motion.span
                initial={{ scaleX: 0 }}
                animate={amountInView ? { scaleX: 1 } : undefined}
                transition={{ duration: 0.8, delay: 0.6, ease: EASE }}
                className="absolute -bottom-3 left-1 h-1.5 w-2/3 origin-left rounded-full bg-primary/40"
              />
            </motion.div>
          </div>
        </div>
      </div>

      <motion.div style={{ x: tickerX }} className="mt-16 lg:mt-20 whitespace-nowrap">
        <div className="flex items-center gap-6 lg:gap-10 w-max">
          {t.pricing.options.map((opt, i) => (
            <motion.span
              key={opt}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.6, delay: 0.15 + i * 0.08, ease: EASE }}
              className="flex items-center gap-6 lg:gap-10"
            >
              <span
                className={`font-display leading-none ${
                  i % 2 === 0
                    ? "text-4xl md:text-6xl lg:text-7xl text-foreground"
                    : "text-4xl md:text-6xl lg:text-7xl italic text-transparent [-webkit-text-stroke:1.5px_hsl(var(--foreground))]"
                }`}
              >
                {opt}
              </span>
              <span className="h-2 w-2 rounded-full bg-primary shrink-0" />
            </motion.span>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default Pricing;
