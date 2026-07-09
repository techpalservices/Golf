import { Link } from 'react-router-dom';

interface FeatureSectionProps {
  title: string;
  text: string;
  image: string;
  button: string;
  reverse?: boolean;
}

export default function FeatureSection({ title, text, image, button, reverse }: FeatureSectionProps) {
  return (
    <section className={`py-10 ${reverse ? 'pl-20 bg-secondary-hover' : 'pr-20'}`}>
      <div className={`mx-auto flex max-w-7xl items-center gap-12 px-6 ${reverse ? 'flex-row-reverse' : ''}`}>
        {/* Text */}
        <div className="flex-1 px-20 gap-y-10">
          <h1 className="font-serif text-5xl font-bold text-primary-hover md:text-[40px]">{title}</h1>
          <p className={`mt-4 text-[16px] text-muted-foreground ${reverse ? ' text-white' : 'text-muted-foreground'} mb-5`}>{text}</p>
          <Link
            to="/login"
            className="relative text-base font-medium tracking-widest text-primary-hover transition-colors after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-full after:bg-primary-hover"
          >
            {button}
          </Link>
        </div>

        {/* Image */}
        <div className="flex-1 flex justify-center">
            <img src={image} alt={title} className="h-100 w-full max-w-md rounded-lg object-cover shadow-lg" />
        </div>
      </div>
    </section>
  );
}