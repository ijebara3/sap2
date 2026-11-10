import { useEffect, useRef, useState } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { ArrowUpRight, Pause, Play } from "lucide-react";
import { useLang } from "@/i18n/LanguageContext";
import { CAL_URL } from "@/i18n/translations";
import broll from "@/assets/bts/broll-web.mp4";
import mobileBroll from "@/assets/bts/broll-web-mobile.mp4";
import poster from "@/assets/bts/broll-poster.webp";
import mobilePoster from "@/assets/bts/broll-poster-mobile.webp";
import primary640 from "@/assets/bts/remy-640.webp";
import primary960 from "@/assets/bts/remy-960.webp";
import secondary640 from "@/assets/bts/ref-640.webp";
import secondary960 from "@/assets/bts/ref-960.webp";
import "./StudioProof.css";

const StudioProof = () => {
  const { t } = useLang();
  const copy = t.studioProof;
  const section = useRef<HTMLElement>(null);
  const media = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const reduced = useReducedMotion();
  const approaching = useInView(media, { margin: "200px 0px", amount: 0.05 });
  const visible = useInView(media, { amount: 0.1 });
  const [loaded, setLoaded] = useState(false);
  const [source, setSource] = useState<string>();
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [pausedByUser, setPausedByUser] = useState(false);
  const [failed, setFailed] = useState(false);
  const [pageVisible, setPageVisible] = useState(!document.hidden);
  const { scrollYProgress } = useScroll({ target: section, offset: ["start end", "end start"] });
  const primaryY = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [18, -18]);
  const secondaryY = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [-12, 14]);

  useEffect(() => {
    const update = () => setPageVisible(!document.hidden);
    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, []);

  useEffect(() => {
    if (approaching) setLoaded(true);
    // Select once at first playback so resizing never downloads both video versions.
    if (approaching && !reduced && !source) setSource(window.matchMedia("(max-width: 767px)").matches ? mobileBroll : broll);
  }, [approaching, reduced, source]);

  useEffect(() => {
    const element = video.current;
    if (!element) return;
    if (!loaded || reduced || failed || !visible || !pageVisible || pausedByUser) {
      element.pause();
      return;
    }
    // Autoplay can be declined by the browser; the editorial play button remains available.
    void element.play().catch(() => {});
  }, [loaded, source, reduced, failed, visible, pageVisible, pausedByUser]);

  const togglePlayback = () => {
    const element = video.current;
    if (!element) return;
    if (playing) {
      setPausedByUser(true);
      element.pause();
    } else {
      setPausedByUser(false);
      void element.play().catch(() => {});
    }
  };

  const entrance = { duration: reduced ? 0 : 0.7, ease: [0.22, 1, 0.36, 1] as const };

  return (
    <section ref={section} id="bekend-in-de-studio" className="studio-proof bg-background" aria-labelledby="studio-proof-title">
      <div className="container mx-auto px-6 lg:px-10">
        <div className="studio-proof-heading">
          <motion.div initial={reduced ? false : { opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={entrance}>
            <span className="section-label text-accent-foreground">{copy.label}</span>
            <h2 id="studio-proof-title" className="mt-5 font-semibold">{copy.title}</h2>
          </motion.div>
          <motion.div className="studio-proof-intro" initial={reduced ? false : { opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ ...entrance, delay: reduced ? 0 : 0.12 }}>
            <p className="text-muted-foreground">{copy.body}</p>
            <a href={CAL_URL} target="_blank" rel="noopener noreferrer" className="studio-proof-book group">
              {copy.cta}<ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
          </motion.div>
        </div>

        <div className="studio-proof-stage">
          <div ref={media} className="studio-proof-film bg-ink" role="group" aria-label={copy.videoLabel}>
            <picture>
              <source media="(max-width: 767px)" srcSet={loaded ? mobilePoster : undefined} />
              <img src={loaded ? poster : undefined} width={1920} height={1080} alt="" aria-hidden="true" loading="lazy" decoding="async" className="studio-proof-poster" />
            </picture>
            <video
              ref={video}
              src={loaded && !reduced && !failed ? source : undefined}
              poster={source ? source === mobileBroll ? mobilePoster : poster : undefined}
              autoPlay={loaded && !reduced && visible && pageVisible && !pausedByUser}
              loop muted playsInline preload="none" controls={false}
              aria-hidden="true"
              className={ready && !reduced && !failed ? "is-ready" : ""}
              onLoadedData={() => setReady(true)}
              onPlaying={() => setPlaying(true)}
              onPause={() => setPlaying(false)}
              onSeeked={({ currentTarget: element }) => {
                // Some WebKit builds pause after seeking back to the start of a native loop.
                if (element.paused && element.currentTime < 0.1 && visible && pageVisible && !pausedByUser && !reduced && !failed) {
                  void element.play().catch(() => {});
                }
              }}
              onError={() => { setFailed(true); setReady(false); setPlaying(false); }}
            />
            <div className="studio-proof-film-label"><span aria-hidden="true" />{copy.filmLabel}</div>
            {loaded && !reduced && !failed && (
              <button type="button" className="studio-proof-playback" onClick={togglePlayback} aria-label={playing ? copy.pause : copy.play} aria-pressed={pausedByUser}>
                {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </button>
            )}
          </div>

          <div className="studio-proof-portraits">
            <motion.figure className="studio-proof-primary" style={{ y: primaryY }} initial={reduced ? false : { opacity: 0, scale: 0.96 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, amount: 0.15 }} transition={{ ...entrance, delay: reduced ? 0 : 0.12 }}>
              <div className="studio-proof-primary-frame">
                <img src={loaded ? primary960 : undefined} srcSet={loaded ? `${primary640} 640w, ${primary960} 960w` : undefined} sizes="(min-width: 1024px) 280px, (min-width: 640px) 250px, 48vw" width={960} height={1280} alt={copy.primaryAlt} loading="lazy" decoding="async" />
              </div>
            </motion.figure>
            <motion.figure className="studio-proof-secondary" style={{ y: secondaryY }} initial={reduced ? false : { opacity: 0, scale: 0.96 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, amount: 0.15 }} transition={{ ...entrance, delay: reduced ? 0 : 0.24 }}>
              <div className="studio-proof-secondary-frame">
                <img src={loaded ? secondary960 : undefined} srcSet={loaded ? `${secondary640} 640w, ${secondary960} 960w` : undefined} sizes="(min-width: 1024px) 210px, (min-width: 640px) 200px, 40vw" width={960} height={1280} alt={copy.secondaryAlt} loading="lazy" decoding="async" />
              </div>
            </motion.figure>
          </div>
          <p className="studio-proof-footnote text-muted-foreground"><span aria-hidden="true" />{copy.note}</p>
        </div>
      </div>
    </section>
  );
};

export default StudioProof;
