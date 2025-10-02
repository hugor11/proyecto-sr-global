import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import Image from 'next/image';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'destinations' });
  
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
  };
}

export default function DestinationsPage() {
  const t = useTranslations('destinations');
  
  const destinations = [
    {
      name: t('rivieraMaya'),
      description: t('rivieraMayaDesc'),
      image: 'https://mexicancaribbean.travel/wp-content/uploads/2024/09/RIVIERA-MAYA_PLAYA-MAROMA_11zon-scaled.jpg'
    },
    {
      name: t('cancun'),
      description: t('cancunDesc'),
      image: 'https://i.imgur.com/xCiA7V1.jpeg'
    },
    {
      name: t('europe'),
      description: t('europeDesc'),
      image: 'https://elviajerofeliz.com/wp-content/uploads/2015/04/venecia-romance.jpg'
    },
    {
      name: t('asia'),
      description: t('asiaDesc'),
      image: 'https://i.imgur.com/zPwUSa5.jpeg'
    }
  ];

  return (
    <main>
      <section className="py-20 bg-cover bg-center" style={{ backgroundImage: "linear-gradient(rgba(0,150,136,0.85), rgba(0,150,136,0.85)), url('https://i.imgur.com/xCiA7V1.jpeg')" }}>
        <div className="container mx-auto px-6 text-center text-white">
          <h1 className="text-5xl font-pacifico mb-4">{t('title')}</h1>
          <p className="text-xl max-w-3xl mx-auto">{t('subtitle')}</p>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-brand-dark mb-12">{t('exploreTitle')}</h2>
          
          <div className="grid md:grid-cols-2 gap-10">
            {destinations.map((dest, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow">
                <div className="relative h-64 w-full">
                  <Image src={dest.image} alt={dest.name} fill className="object-cover" />
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-brand-turquoise mb-3">{dest.name}</h3>
                  <p className="text-gray-600 mb-6">{dest.description}</p>
                  <a 
                    href="/contact" 
                    className="inline-block bg-brand-orange text-white py-3 px-8 rounded-lg hover:bg-opacity-90 transition-all hover:scale-105 font-bold"
                  >
                    {t('learnMore')}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
