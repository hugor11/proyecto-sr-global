import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import Image from 'next/image';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'promotions' });
  
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
  };
}

export default function PromotionsPage() {
  const t = useTranslations('promotions');
  
  const promotions = [
    {
      image: 'https://i.imgur.com/3y5pPHv.jpeg',
      title: t('playaDelCarmen'),
      alt: 'Promoción de viaje a Playa del Carmen'
    },
    {
      image: 'https://i.imgur.com/LV6DvOg.jpeg',
      title: t('disney'),
      alt: 'Promoción de viaje a Disney'
    },
    {
      image: 'https://i.imgur.com/gBvZAZq.jpeg',
      title: t('barrancas'),
      alt: 'Promoción de viaje a Barrancas del Cobre'
    },
    {
      image: 'https://i.imgur.com/zPwUSa5.jpeg',
      title: t('jordan'),
      alt: 'Promoción de viaje a Jordania y Egipto'
    },
    {
      image: 'https://i.imgur.com/300Oyw0.jpeg',
      title: t('guatemala'),
      alt: 'Promoción de viaje a Guatemala'
    },
    {
      image: 'https://i.imgur.com/gNYSIjK.jpeg',
      title: t('peru'),
      alt: 'Promoción de viaje a Perú'
    }
  ];

  return (
    <main>
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl font-bold text-center text-brand-dark mb-12">
            🔥 {t('title')} 🔥
          </h1>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {promotions.map((promo, index) => (
              <div 
                key={index}
                className="bg-white rounded-lg shadow-xl overflow-hidden flex flex-col hover:shadow-2xl transition-shadow"
              >
                <div className="relative h-56 w-full">
                  <Image
                    src={promo.image}
                    alt={promo.alt}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6 flex-grow flex flex-col">
                  <h3 className="text-2xl font-bold text-brand-turquoise mb-2">
                    {promo.title}
                  </h3>
                  <div className="text-center my-4 py-2 bg-gray-100 rounded-lg">
                    <p className="font-semibold text-brand-turquoise">
                      <i className="fas fa-tags mr-2"></i>
                      {t('askPackages')}
                    </p>
                  </div>
                  <a 
                    href="mailto:ventas@srglobalexperiences.com" 
                    className="block w-full text-center bg-brand-orange text-white font-bold py-3 rounded-lg hover:bg-opacity-90 mt-auto transition-all hover:scale-105"
                  >
                    {t('moreInfo')}
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
