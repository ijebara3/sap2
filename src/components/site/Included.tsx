import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLang } from "@/i18n/LanguageContext";
import studio1 from "@/assets/studio-1.jpg";
import studio2 from "@/assets/studio-2.jpg";
import studio3 from "@/assets/studio-3.jpg";
import studio4 from "@/assets/studio-4.jpg";

const IMAGES = [studio1, studio4, studio2, studio4, studio3, studio1, studio3];

const Included = () => {
  const { t } = useLang();
  const [active, setActive] = useState(0);

  return (
    <section id="inbegrepen" className="bg-surface text-surface-foreground py-24 lg:py-32">
      <div className="container mx-auto px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7 }}
          className="max-w-2xl"
        >
          <span className="section-label text-primary">{t.included.label}</span>
          <h2 className="mt-5 text-3xl md:text-5xl font-semibold leading-[1.08]">{t.included.title}</h2>
          <p className="mt-5 lead text-muted-foreground">{t.included.sub}</p>
        </motion.div>

        <div className="mt-14 grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <ul className="border-t border-border">
              {t.included.items.map((item, i) => (
                <motion.li
                  key={item.title}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.6 }}
                  transition={{ duration: 0.5, delay: (i % 4) * 0.06 }}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  tabIndex={0}
                  className={`group border-b border-border py-6 smooth-hover cursor-default outline-none ${
                    active === i ? "pl-3" : "pl-0"
                  }`}
                >
                  <div className="flex items-baseline gap-5">
                    <span
                      className={`font-display text-sm font-semibold tabular-nums smooth-hover ${
                        active === i ? "text-primary" : "text-muted-foreground"
                      }`}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h3 className="text-xl md:text-2xl font-semibold leading-snug">
                        <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_2px] bg-left-bottom bg-no-repeat transition-[background-size] duration-500 group-hover:bg-[length:100%_2px]">
                          {item.title}
                        </span>
                      </h3>
                      <p className="mt-2 text-[17px] leading-relaxed text-muted-foreground max-w-xl">{item.body}</p>
                    </div>
                  </div>
                </motion.li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-28 relative aspect-[4/5] overflow-hidden rounded-lg shadow-lift bg-ink">
              <AnimatePresence mode="wait">
                <motion.img
                  key={active}
                  src={IMAGES[active % IMAGES.length]}
                  alt={t.included.items[active].title}
                  loading="lazy"
                  initial={{ opacity: 0, scale: 1.06 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </AnimatePresence>
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/90 to-transparent p-6">
                <p className="text-ink-foreground text-lg font-semibold">{t.included.items[active].title}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Included;
