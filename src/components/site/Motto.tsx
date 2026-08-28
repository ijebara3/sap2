import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useLang } from "@/i18n/LanguageContext";

const WORDS = ["Book.", "Arrive.", "Record."];

const Motto = () => {
  const { t } = useLang();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.9", "end 0.35"] });
  const drift = useTransform(scrollYProgress, [0, 1], [40, -40]);

  return (
    <section id="book-arrive-record" className="bg-ink text-ink-foreground py-28 lg:py-40 overflow-hidden">
      <div ref={ref} className="container mx-auto px-6 lg:px-10">
        <motion.span
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.6 }}
          className="section-label text-primary block mb-10"
        >
          {t.motto.intro}
        </motion.span>

        <motion.div style={{ x: drift }} className="flex flex-col gap-1 lg:gap-3">
          {WORDS.map((word, i) => (
            <span key={word} className="block overflow-hidden">
              <motion.span
                initial={{ y: 60, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true, amount: 0.15 }}

                transition={{ duration: 0.8, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
                className={`block font-display font-semibold tracking-tightest leading-[0.95] text-[16vw] lg:text-[11vw] ${
                  i === 1 ? "lg:pl-[12%] text-primary" : i === 2 ? "lg:pl-[24%]" : ""
                }`}
              >
                {word}
              </motion.span>
            </span>
          ))}
        </motion.div>

        <div className="mt-14 grid gap-8 lg:grid-cols-2 lg:gap-16 max-w-5xl">
          {[t.motto.body, t.motto.body2].map((line, i) => (
            <motion.p
              key={line}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.7, delay: 0.1 + i * 0.15 }}
              className={`text-lg md:text-xl leading-relaxed ${
                i === 0 ? "text-ink-foreground/85" : "text-ink-foreground font-medium"
              }`}
            >
              {line}
            </motion.p>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Motto;
