import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { GiGolfTee } from "react-icons/gi";

export default function Hero() {
  const { t } = useTranslation('landing');

  return (
    <section className="relative flex min-h-screen items-end justify-start overflow-hidden">
      {/* Video background */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
      >
        <source src="/hero.mp4" type="video/mp4" />
      </video>

      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-linear-to-b from-transparent via-black/5 to-black/50" />

      {/* Content */}
      <div className="relative z-10 max-w-3xl px-6 pb-20 text-start ml-20">
        <h1 className="font-serif text-4xl font-bold text-white md:text-[52px]">
          {t('hero.title')}
        </h1>
        <Link
          to="/search"
          className="mt-8 inline-block rounded-md bg-primary px-12 py-4 text-base font-medium text-primary-foreground transition-colors hover:bg-primary-hover"
        >
          <div className="flex items-center gap-2">
            <GiGolfTee />
          {t('hero.cta')}
          </div>
        </Link>
      </div>
    </section>
  );
}