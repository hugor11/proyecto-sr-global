import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'groups' });
  
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
  };
}

export default function GroupsPage() {
  const t = useTranslations('groups');
  
  const services = [
    {
      icon: 'fa-users',
      title: t('corporateTitle'),
      description: t('corporateDesc')
    },
    {
      icon: 'fa-briefcase',
      title: t('miceTitle'),
      description: t('miceDesc')
    },
    {
      icon: 'fa-calendar-check',
      title: t('conventionsTitle'),
      description: t('conventionsDesc')
    },
    {
      icon: 'fa-trophy',
      title: t('incentivesTitle'),
      description: t('incentivesDesc')
    }
  ];

  return (
    <main>
      <section className="py-20 bg-cover bg-center" style={{ backgroundImage: "linear-gradient(rgba(255,112,67,0.85), rgba(255,112,67,0.85)), url('https://i.imgur.com/Kp01jSr.jpeg')" }}>
        <div className="container mx-auto px-6 text-center text-white">
          <h1 className="text-5xl font-pacifico mb-4">{t('title')}</h1>
          <p className="text-xl max-w-3xl mx-auto">{t('subtitle')}</p>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-brand-dark mb-12">{t('servicesTitle')}</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-start">
                  <div className="w-16 h-16 bg-brand-orange bg-opacity-10 rounded-full flex items-center justify-center mr-6 flex-shrink-0">
                    <i className={`fas ${service.icon} text-brand-orange text-2xl`}></i>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-brand-dark mb-3">{service.title}</h3>
                    <p className="text-gray-600">{service.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-brand-dark mb-6">{t('ctaTitle')}</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">{t('ctaDesc')}</p>
          <a 
            href="/contact" 
            className="inline-block bg-brand-orange text-white font-bold py-4 px-10 rounded-lg hover:bg-opacity-90 transition-all hover:scale-105"
          >
            <i className="fas fa-paper-plane mr-2"></i>
            {t('contactBtn')}
          </a>
        </div>
      </section>
    </main>
  );
}
