import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowRight } from "lucide-react";
import { useLang } from "@/i18n/LanguageContext";
import { CAL_URL } from "@/i18n/translations";
import heroVideo from "@/assets/hero-studio.mp4.asset.json";
import { studioImages } from "@/lib/studio-images";

const Hero = () => {
  const { t } = useLang();
  const [videoFailed, setVideoFailed] = useState(false);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [videoAvailable, setVideoAvailable] = useState(false);
  useEffect(() => {
    const controller = new AbortController();
    // The hosted asset route can return the SPA's HTML on other deployments.
    // Keep the photo visible and avoid handing that HTML response to a video decoder.
    void fetch(heroVideo.url, { method: "HEAD", signal: controller.signal }).then((response) => {
      const type = response.headers.get("content-type") || "";
      if ((response.ok && !/^(text\/|application\/json)/i.test(type)) || response.status === 405 || response.status === 501) {
        setVideoAvailable(true);
      }
    }).catch(() => {});
    return () => controller.abort();
  }, []);
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const { scrollYProgress: exitProgress } = useScroll({ target: ref, offset: ["end end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "18%"]);
  // Tall mobile heroes must remain readable until their bottom reaches the viewport.
  const opacity = useTransform(exitProgress, [0, 0.8], [1, reduce ? 1 : 0]);

  const ease = [0.22, 1, 0.36, 1] as const;

  return (
    <section ref={ref} className="relative min-h-[100svh] w-full overflow-hidden bg-ink">
      <motion.div style={{ y }} className="absolute inset-0 h-[118%]">
        <img
          {...studioImages[0]}
          sizes="100vw"
          alt=""
          aria-hidden="true"
          {...{ fetchpriority: "high" }}
          className="absolute inset-0 h-full w-full object-cover"
        />
        {videoAvailable && <video
          className="absolute inset-0 h-full w-full object-cover pointer-events-none"
          style={{ opacity: videoPlaying && !videoFailed ? 1 : 0 }}
          src={heroVideo.url}
          poster={studioImages[0].src}
          hidden={videoFailed}
          onPlaying={() => setVideoPlaying(true)}
          onPause={() => setVideoPlaying(false)}
          onError={() => setVideoFailed(true)}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          aria-hidden="true"
        />}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, hsl(220 14% 6% / 0.62) 0%, hsl(220 14% 6% / 0.38) 45%, hsl(220 14% 6% / 0.72) 100%)",
          }}
        />
      </motion.div>

      <motion.div
        style={{ opacity }}
        className="relative z-10 flex min-h-[100svh] flex-col items-center justify-center px-6 pt-32 pb-40 lg:py-32 text-center"
      >
        <motion.span
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease }}
          className="section-label text-primary mb-6"
        >
          {t.hero.label}
        </motion.span>

        <h1 className="w-full max-w-5xl text-[clamp(1.875rem,8vw,2.25rem)] sm:text-6xl lg:text-7xl font-semibold leading-[1.03] text-ink-foreground">
          {[t.hero.title1, t.hero.title2, t.hero.title3].map((line, i) => (
            <span key={line} className="block overflow-hidden">
              <motion.span
                className="block"
                initial={{ y: "110%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.9, delay: 0.25 + i * 0.12, ease }}
              >
                {i === 2 ? <span className="text-primary">{line}</span> : line}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.75, ease }}
          className="mt-7 max-w-xl text-lg md:text-xl leading-relaxed text-ink-foreground/90"
        >
          {t.hero.sub}
        </motion.p>

        <div className="mt-10 flex flex-col sm:flex-row items-center gap-4">
          {[
            <a
              key="primary"
              href={CAL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 rounded-full bg-primary px-8 py-4 text-base font-semibold text-primary-foreground smooth-hover hover:brightness-110 hover:scale-[1.03]"
            >
              {t.hero.cta}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>,
            <button
              key="secondary"
              onClick={() => document.getElementById("studio")?.scrollIntoView({ behavior: "smooth" })}
              className="inline-flex items-center gap-2 rounded-full border border-ink-foreground/40 bg-ink-foreground/10 px-8 py-4 text-base font-semibold text-ink-foreground backdrop-blur-md smooth-hover hover:bg-ink-foreground/20"
            >
              {t.hero.ctaSecondary}
            </button>,
          ].map((child, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.95 + i * 0.12, ease }}
            >
              {child}
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.button
        onClick={() => document.getElementById("book-arrive-record")?.scrollIntoView({ behavior: "smooth" })}
        style={{ opacity }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 flex flex-col items-center gap-2 text-ink-foreground/80"
        aria-label={t.hero.scroll}
      >
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.8 }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-xs uppercase tracking-[0.2em] font-semibold">{t.hero.scroll}</span>
          <ArrowDown className="h-4 w-4 animate-scroll-hint" />
        </motion.span>
      </motion.button>
    </section>
  );
};

export default Hero;
