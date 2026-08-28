import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useLang } from "@/i18n/LanguageContext";

const Step = ({
  n,
  title,
  body,
  index,
}: {
  n: string;
  title: string;
  body: string;
  index: number;
}) => {
  const ref = useRef<HTMLLIElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "start 0.45"] });
  const opacity = useTransform(scrollYProgress, [0, 1], [0.35, 1]);
  const x = useTransform(scrollYProgress, [0, 1], [24, 0]);

  return (
    <motion.li ref={ref} style={{ opacity, x }} className="relative pl-14 lg:pl-0">
      <span className="absolute left-0 top-1 h-9 w-9 -translate-x-[18px] lg:static lg:translate-x-0 lg:mb-6 lg:h-auto lg:w-auto flex items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-semibold lg:rounded-none lg:bg-transparent lg:text-primary lg:text-base lg:justify-start">
        {n}
      </span>
      <h3 className="text-2xl lg:text-3xl font-semibold leading-tight">{title}</h3>
      <p className="mt-3 text-[17px] leading-relaxed text-muted-foreground max-w-xs">{body}</p>
    </motion.li>
  );
};

const HowItWorks = () => {
  const { t } = useLang();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.75", "end 0.6"] });

  return (
    <section id="hoe-werkt-het" className="bg-background py-24 lg:py-32">
      <div className="container mx-auto px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7 }}
          className="max-w-2xl"
        >
          <span className="section-label text-primary">{t.how.label}</span>
          <h2 className="mt-5 text-3xl md:text-5xl font-semibold leading-[1.08]">{t.how.title}</h2>
        </motion.div>

        <div ref={ref} className="relative mt-16">
          {/* progress line - vertical on mobile */}
          <div className="absolute left-[3px] top-2 bottom-2 w-[2px] bg-border lg:hidden">
            <motion.div className="h-full w-full origin-top bg-primary" style={{ scaleY: scrollYProgress }} />
          </div>
          {/* progress line - horizontal on desktop */}
          <div className="hidden lg:block absolute left-0 top-0 h-[2px] w-full bg-border">
            <motion.div className="h-full w-full origin-left bg-primary" style={{ scaleX: scrollYProgress }} />
          </div>


          <ol className="grid gap-12 pt-4 lg:grid-cols-4 lg:gap-10 lg:pt-14">
            {t.how.steps.map((s, i) => (
              <Step key={s.n} n={s.n} title={s.title} body={s.body} index={i} />
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
