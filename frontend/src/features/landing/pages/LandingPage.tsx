import { useTranslation } from 'react-i18next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Hero from '../components/Hero';
import FeatureSection from '../components/FeatureSection';
import CTASection from '../components/CTASection';

export default function LandingPage() {
  const { t } = useTranslation('landing');

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        <Hero />

        <FeatureSection
          title={t('features.section1.title')}
          text={t('features.section1.text')}
          image="/section1.png"
          button={t('features.section1.button')}
        />

        <FeatureSection
          title={t('features.section2.title')}
          text={t('features.section2.text')}
          image="/section2.png"
          button={t('features.section2.button')}
          reverse
        />

        <FeatureSection
          title={t('features.section3.title')}
          text={t('features.section3.text')}
          image="/section3.png"
          button={t('features.section3.button')}
        />

        <CTASection />
      </main>

      <Footer />
    </div>
  );
}