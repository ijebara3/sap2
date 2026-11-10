import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { ArrowLeft, ArrowRight, Pause, Play } from "lucide-react";
import { useLang } from "@/i18n/LanguageContext";
import { studioImages, fullWidthImageSizes } from "@/lib/studio-images";
import { impressionImages } from "@/lib/impression-images";
import { prepareImage } from "@/lib/responsive-image";
import { usePreparedImage } from "@/hooks/use-prepared-image";

const PHOTOS = [
  { ...studioImages[0], alt: { nl: "Opnametafel met twee microfoons en camera", en: "Recording table with two microphones and a camera" } },
  { ...studioImages[2], alt: { nl: "Zithoek van de podcaststudio met studioverlichting", en: "Podcast studio seating area with studio lighting" } },
  { ...studioImages[3], alt: { nl: "Camera op statief gericht op de opnameplek", en: "Camera on a tripod facing the recording area" } },
  { ...studioImages[1], alt: { nl: "Detailopname van een professionele studiomicrofoon", en: "Close-up of a professional studio microphone" } },
  { ...impressionImages[0], alt: { nl: "Vier microfoons rond de opnametafel met blauwe bloemen", en: "Four microphones around the recording table with blue flowers" } },
  { ...impressionImages[1], alt: { nl: "Microfoon bij de zithoek met het studiobanner op de achtergrond", en: "Microphone by the seating area with the studio banner behind it" } },
  { ...impressionImages[2], alt: { nl: "Zithoek met fauteuil, bank en studiomicrofoons", en: "Seating area with an armchair, sofa and studio microphones" } },
  { ...impressionImages[3], alt: { nl: "Bank met twee microfoons en bloemen op de salontafel", en: "Sofa with two microphones and flowers on the coffee table" } },
  { ...impressionImages[4], alt: { nl: "Zithoek naast een houten kast en plant", en: "Seating area beside a wooden cabinet and plant" } },
  { ...impressionImages[5], alt: { nl: "Opnametafel met vier microfoons en audioapparatuur", en: "Recording table with four microphones and audio equipment" } },
  { ...impressionImages[6], alt: { nl: "Microfoons en blauwe bloemen voor het studioscherm", en: "Microphones and blue flowers in front of the studio display" } },
  { ...impressionImages[7], alt: { nl: "Close-up van een RODE-microfoon en mengpaneel", en: "Close-up of a RODE microphone and audio mixer" } },
  { ...impressionImages[8], alt: { nl: "Opnametafel met stoelen tussen twee studiobanners", en: "Recording table and chairs between two studio banners" } },
  { ...impressionImages[9], alt: { nl: "Overzicht van de opnametafel, stoelen en studio-inrichting", en: "View of the recording table, chairs and studio interior" } },
];

const Impressie = () => {
  const { t, lang } = useLang();
  const reduce = useReducedMotion();
  const [[index, dir], setState] = useState<[number, number]>([0, 0]);
  const visibleIndex = usePreparedImage(index, PHOTOS, fullWidthImageSizes);
  const galleryRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(galleryRef, { amount: 0.25 });
  const [isInteracting, setIsInteracting] = useState(false);
  const [pausedByUser, setPausedByUser] = useState(false);
  const [isHidden, setIsHidden] = useState(document.hidden);

  useEffect(() => {
    const updateVisibility = () => setIsHidden(document.hidden);
    document.addEventListener("visibilitychange", updateVisibility);
    return () => document.removeEventListener("visibilitychange", updateVisibility);
  }, []);

  useEffect(() => {
    if (reduce || pausedByUser || !isInView || isInteracting || isHidden || visibleIndex !== index) return;
    // Warm only the next responsive image so automatic transitions do not flash blank.
    void prepareImage(PHOTOS[(index + 1) % PHOTOS.length], fullWidthImageSizes);
    const timer = window.setTimeout(() => {
      setState(([i]) => [(i + 1) % PHOTOS.length, 1]);
    }, 3000);
    return () => window.clearTimeout(timer);
  }, [index, visibleIndex, dir, isInView, isInteracting, isHidden, reduce, pausedByUser]);

  const paginate = (delta: number) =>
    setState(([i]) => [(i + delta + PHOTOS.length) % PHOTOS.length, delta]);

  return (
    <section id="impressie" className="bg-ink text-ink-foreground py-16 sm:py-24 lg:py-32 overflow-hidden">
      <div className="container mx-auto px-6 lg:px-10">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: reduce ? 0 : 0.7 }}
          >
            <span className="section-label text-primary">{t.impression.label}</span>
            <h2 className="mt-4 text-4xl md:text-6xl font-semibold leading-none">{t.impression.title}</h2>
            <p className="mt-4 lead text-ink-foreground/80">{t.impression.sub}</p>
          </motion.div>

          <div className="flex items-center gap-3">
            {!reduce && (
              <button
                type="button"
                onClick={() => setPausedByUser((paused) => !paused)}
                aria-label={pausedByUser ? t.impression.play : t.impression.pause}
                aria-pressed={pausedByUser}
                className="h-12 w-12 rounded-full border border-ink-border flex items-center justify-center smooth-hover hover:bg-ink-foreground/10 active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
              >
                {pausedByUser ? <Play className="h-5 w-5" /> : <Pause className="h-5 w-5" />}
              </button>
            )}
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
          ref={galleryRef}
          role="region"
          aria-label={t.impression.label}
          tabIndex={0}
          onPointerDownCapture={() => setIsInteracting(true)}
          onPointerUpCapture={() => setIsInteracting(false)}
          onPointerCancelCapture={() => setIsInteracting(false)}
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
              key={visibleIndex}
              custom={dir}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.18}
              onDragEnd={(_, info) => {
                setIsInteracting(false);
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
                {...PHOTOS[visibleIndex]}
                alt={PHOTOS[visibleIndex].alt[lang]}
                sizes={fullWidthImageSizes}
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
          <div className="shrink-0 font-display text-3xl font-semibold tabular-nums">
            <motion.span key={index} initial={reduce ? false : { y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: reduce ? 0 : 0.3 }} className="inline-block">
              {String(index + 1).padStart(2, "0")}
            </motion.span>
            <span className="text-ink-foreground/40 text-xl"> / {String(PHOTOS.length).padStart(2, "0")}</span>
          </div>
          <div className="grid min-w-0 flex-1 grid-cols-5 sm:grid-cols-7 lg:flex gap-x-2">
            {PHOTOS.map((_, i) => (
              <button
                key={i}
                onClick={() => setState([i, i > index ? 1 : -1])}
                aria-label={`${t.impression.label} ${i + 1}`}
                aria-current={i === index ? "true" : undefined}
                className="group min-w-0 flex-1 py-3"
              >
                <span className="block h-[3px] w-full overflow-hidden rounded-full bg-ink-foreground/20">
                  <motion.span
                    className="block h-full bg-primary"
                    initial={false}
                    animate={{ width: i === index ? "100%" : "0%" }}
                    transition={{ duration: reduce ? 0 : 0.5, ease: [0.22, 1, 0.36, 1] }}
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
