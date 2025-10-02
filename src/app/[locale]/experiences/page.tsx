import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'experiences' });
  
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
  };
}

export default function ExperiencesPage() {
  const t = useTranslations('experiences');
  
  const experiences = [
    {
      image: 'https://i.imgur.com/xCiA7V1.jpeg',
      title: t('culinaryTitle'),
      description: t('culinaryDesc'),
      gradient: 'from-black to-transparent'
    },
    {
      image: 'https://i.imgur.com/RGr2PAT.jpeg',
      title: t('wellnessTitle'),
      description: t('wellnessDesc'),
      gradient: 'from-black to-transparent'
    },
    {
      image: 'https://i.imgur.com/kEdZkFt.jpeg',
      title: t('eventsTitle'),
      description: t('eventsDesc'),
      gradient: 'from-black to-transparent'
    },
    {
      image: 'https://i.imgur.com/Kp01jSr.jpeg',
      title: t('groupsTitle'),
      description: t('groupsDesc'),
      gradient: 'from-black to-transparent'
    }
  ];

  return (
    <main>
      <section className="py-20" style={{ backgroundImage: 'linear-gradient(to right, #009688, #00796B)' }}>
        <div className="container mx-auto px-6 text-white text-center">
          <h1 className="text-4xl font-pacifico mb-4">{t('title')}</h1>
          <p className="text-lg mb-12 max-w-3xl mx-auto">
            {t('description')}
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {experiences.map((exp, index) => (
              <div 
                key={index}
                className="relative rounded-lg overflow-hidden shadow-xl h-80 flex items-end p-6 text-left"
                style={{ background: `url('${exp.image}') center/cover` }}
              >
                <div className={`absolute inset-0 bg-gradient-to-t ${exp.gradient} opacity-75`}></div>
                <div className="relative">
                  <h4 className="text-2xl font-bold">{exp.title}</h4>
                  <p className="mt-2">{exp.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
