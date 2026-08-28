import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useLang } from "@/i18n/LanguageContext";
import studio1 from "@/assets/studio-1.jpg";
import studio2 from "@/assets/studio-2.jpg";
import studio3 from "@/assets/studio-3.jpg";
import studio4 from "@/assets/studio-4.jpg";

const PHOTOS = [
  { src: studio1, alt: "Opnametafel met twee microfoons en camera in de studio" },
  { src: studio3, alt: "Zithoek van de podcaststudio met studioverlichting" },
  { src: studio4, alt: "Camera op statief gericht op de opnameplek" },
  { src: studio2, alt: "Detailopname van een professionele studiomicrofoon" },
];

const Impressie = () => {
  const { t } = useLang();
  const [[index, dir], setState] = useState<[number, number]>([0, 0]);

  const paginate = (delta: number) =>
    setState(([i]) => [(i + delta + PHOTOS.length) % PHOTOS.length, delta]);

  return (
    <section id="impressie" className="bg-ink text-ink-foreground py-24 lg:py-32 overflow-hidden">
      <div className="container mx-auto px-6 lg:px-10">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.7 }}
          >
            <span className="section-label text-primary">{t.impression.label}</span>
            <h2 className="mt-4 text-4xl md:text-6xl font-semibold leading-none">{t.impression.title}</h2>
            <p className="mt-4 lead text-ink-foreground/80">{t.impression.sub}</p>
          </motion.div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => paginate(-1)}
              aria-label={t.impression.prev}
              className="h-12 w-12 rounded-full border border-ink-border flex items-center justify-center smooth-hover hover:bg-ink-foreground/10 active:scale-95"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => paginate(1)}
              aria-label={t.impression.next}
              className="h-12 w-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center smooth-hover hover:brightness-110 active:scale-95"
            >
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="relative mt-12 h-[52vh] min-h-[340px] lg:h-[68vh]">
          <AnimatePresence initial={false} custom={dir} mode="popLayout">
            <motion.div
              key={index}
              custom={dir}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.18}
              onDragEnd={(_, info) => {
                if (info.offset.x < -60) paginate(1);
                else if (info.offset.x > 60) paginate(-1);
              }}
              initial={{ x: dir >= 0 ? "62%" : "-62%", opacity: 0, scale: 0.9, rotate: dir >= 0 ? 3 : -3 }}
              animate={{ x: 0, opacity: 1, scale: 1, rotate: 0 }}
              exit={{ x: dir >= 0 ? "-45%" : "45%", opacity: 0, scale: 0.92, rotate: dir >= 0 ? -2 : 2 }}
              transition={{ type: "spring", stiffness: 190, damping: 26, mass: 0.9 }}
              className="absolute inset-0 cursor-grab active:cursor-grabbing overflow-hidden rounded-xl shadow-lift"
            >
              <img
                src={PHOTOS[index].src}
                alt={PHOTOS[index].alt}
                loading="lazy"
                className="h-full w-full object-cover select-none pointer-events-none"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/50 via-transparent to-transparent" />
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-8 flex items-center gap-6">
          <div className="font-display text-3xl font-semibold tabular-nums">
            <motion.span key={index} initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="inline-block">
              {String(index + 1).padStart(2, "0")}
            </motion.span>
            <span className="text-ink-foreground/40 text-xl"> / {String(PHOTOS.length).padStart(2, "0")}</span>
          </div>
          <div className="flex flex-1 gap-2">
            {PHOTOS.map((p, i) => (
              <button
                key={p.alt}
                onClick={() => setState([i, i > index ? 1 : -1])}
                aria-label={`${t.impression.label} ${i + 1}`}
                className="group flex-1 py-3"
              >
                <span className="block h-[3px] w-full overflow-hidden rounded-full bg-ink-foreground/20">
                  <motion.span
                    className="block h-full bg-primary"
                    initial={false}
                    animate={{ width: i === index ? "100%" : "0%" }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  />
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Impressie;
