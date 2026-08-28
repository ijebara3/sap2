import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useLang } from "@/i18n/LanguageContext";
import { CAL_URL } from "@/i18n/translations";
import studio3 from "@/assets/studio-3.jpg";

const FinalCta = () => {
  const { t } = useLang();
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 1], reduce ? [1, 1] : [1.15, 1]);
  const y = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["-6%", "6%"]);

  return (
    <section ref={ref} className="relative isolate overflow-hidden bg-ink text-ink-foreground">
      <motion.img
        src={studio3}
        alt=""
        aria-hidden="true"
        style={{ scale, y }}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover opacity-45"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-ink/80 via-ink/60 to-ink/90" />

      <div className="relative z-10 container mx-auto px-6 lg:px-10 py-32 lg:py-48 text-center">
        <h2 className="mx-auto max-w-4xl text-4xl sm:text-6xl lg:text-7xl font-semibold leading-[1.02]">
          {[t.finalCta.title1, t.finalCta.title2].map((line, i) => (
            <span key={line} className="block overflow-hidden">
              <motion.span
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.9, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                className={`block ${i === 1 ? "text-primary" : ""}`}
              >
                {line}
              </motion.span>
            </span>
          ))}
        </h2>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mx-auto mt-7 max-w-xl text-lg md:text-xl text-ink-foreground/90"
        >
          {t.finalCta.body}
        </motion.p>

        <motion.a
          href={CAL_URL}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="group mt-10 inline-flex items-center gap-2 rounded-full bg-primary px-9 py-4 text-lg font-semibold text-primary-foreground smooth-hover hover:brightness-110 hover:scale-[1.03]"
        >
          {t.finalCta.cta}
          <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
        </motion.a>
      </div>
    </section>
  );
};

export default FinalCta;
