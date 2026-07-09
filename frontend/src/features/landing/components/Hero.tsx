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
        style={{ objectPosition: '70% 30%' }}
      >
        <source src="/hero.mp4" type="video/mp4" />
      </video>

      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-linear-to-b from-transparent via-black/5 to-black/50" />

      {/* Content */}
      <div className="relative z-10 max-w-3xl px-6 pb-16 text-start md:ml-20 md:pb-20">
        <h1 className="font-serif text-3xl font-bold text-white md:text-[52px]">
          {t('hero.title')}
        </h1>
        <Link
          to="/search"
          className="mt-6 inline-block rounded-md bg-primary px-8 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover md:mt-8 md:px-12 md:py-4 md:text-base"
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