import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useLang } from "@/i18n/LanguageContext";
import { studioImages, fullWidthImageSizes } from "@/lib/studio-images";

const PHOTOS = [
  { ...studioImages[0], alt: "Opnametafel met twee microfoons en camera in de studio" },
  { ...studioImages[2], alt: "Zithoek van de podcaststudio met studioverlichting" },
  { ...studioImages[3], alt: "Camera op statief gericht op de opnameplek" },
  { ...studioImages[1], alt: "Detailopname van een professionele studiomicrofoon" },
  // Six detail crops from the original studio photos; no stock or invented rooms.
  { ...studioImages[4], alt: "Detail van de opnameapparatuur op de studiotafel" },
  { ...studioImages[5], alt: "Microfoon en zitplaats aan de opnametafel" },
  { ...studioImages[6], alt: "Close-up van de microfoon en microfoonhouder" },
  { ...studioImages[7], alt: "Bloemen en opnameapparatuur op de tafel" },
  { ...studioImages[8], alt: "Zithoek met microfoons en salontafel" },
  { ...studioImages[9], alt: "Fauteuil met microfoon in de podcaststudio" },
];

const Impressie = () => {
  const { t } = useLang();
  const reduce = useReducedMotion();
  const [[index, dir], setState] = useState<[number, number]>([0, 0]);

  const paginate = (delta: number) =>
    setState(([i]) => [(i + delta + PHOTOS.length) % PHOTOS.length, delta]);

  return (
    <section id="impressie" className="bg-ink text-ink-foreground py-16 sm:py-24 lg:py-32 overflow-hidden">
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

        <div
          role="region"
          aria-label={t.impression.label}
          tabIndex={0}
          onKeyDown={(event) => {
            if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
              event.preventDefault();
              paginate(event.key === "ArrowLeft" ? -1 : 1);
            }
          }}
          className="relative mt-8 sm:mt-12 aspect-[4/3] sm:aspect-[16/10] lg:aspect-auto lg:h-[68vh] lg:min-h-[340px] outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 focus-visible:ring-offset-ink rounded-xl"
        >
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
              initial={reduce ? { opacity: 0 } : { x: dir >= 0 ? "62%" : "-62%", opacity: 0, scale: 0.9, rotate: dir >= 0 ? 3 : -3 }}
              animate={{ x: 0, opacity: 1, scale: 1, rotate: 0 }}
              exit={reduce ? { opacity: 0 } : { x: dir >= 0 ? "-45%" : "45%", opacity: 0, scale: 0.92, rotate: dir >= 0 ? -2 : 2 }}
              transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 190, damping: 26, mass: 0.9 }}
              className="absolute inset-0 touch-pan-y cursor-grab active:cursor-grabbing overflow-hidden rounded-xl shadow-lift"
            >
              <img
                src={PHOTOS[index].src}
                srcSet={PHOTOS[index].srcSet}
                sizes={fullWidthImageSizes}
                width={PHOTOS[index].width}
                height={PHOTOS[index].height}
                alt={PHOTOS[index].alt}
                loading="lazy"
                decoding="async"
                draggable={false}
                className="h-full w-full object-cover select-none pointer-events-none"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/50 via-transparent to-transparent" />
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-6 sm:mt-8 flex items-center gap-4 sm:gap-6">
          <div aria-live="polite" aria-atomic="true" className="shrink-0 font-display text-3xl font-semibold tabular-nums">
            <motion.span key={index} initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="inline-block">
              {String(index + 1).padStart(2, "0")}
            </motion.span>
            <span className="text-ink-foreground/40 text-xl"> / {String(PHOTOS.length).padStart(2, "0")}</span>
          </div>
          <div className="grid min-w-0 flex-1 grid-cols-5 sm:grid-cols-10 gap-x-2">
            {PHOTOS.map((p, i) => (
              <button
                key={p.alt}
                onClick={() => setState([i, i > index ? 1 : -1])}
                aria-label={`${t.impression.label} ${i + 1}`}
                aria-current={i === index ? "true" : undefined}
                className="group min-w-0 py-3"
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
