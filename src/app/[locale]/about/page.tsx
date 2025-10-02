import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import Image from 'next/image';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'about' });
  
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
  };
}

export default function AboutPage() {
  const t = useTranslations('about');
  
  const values = [
    { icon: 'fa-heart', text: t('value1') },
    { icon: 'fa-star', text: t('value2') },
    { icon: 'fa-lightbulb', text: t('value3') },
    { icon: 'fa-lock', text: t('value4') }
  ];

  const whyChoose = [
    { icon: 'fa-user-check', title: t('whyServiceTitle'), description: t('whyServiceDesc'), color: 'brand-turquoise' },
    { icon: 'fa-headset', title: t('whySupportTitle'), description: t('whySupportDesc'), color: 'brand-orange' },
    { icon: 'fa-gem', title: t('whyExclusiveTitle'), description: t('whyExclusiveDesc'), color: 'brand-turquoise' }
  ];

  return (
    <main>
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="relative h-28 w-48 mx-auto mb-6">
              <Image src="https://i.imgur.com/k1mDOKv.jpeg" alt="Logo SR Global Experiences" fill className="object-contain" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-[#009688] mb-2">{t('title')}</h1>
            <div className="w-24 h-1 bg-[#ff7043] mx-auto mt-4"></div>
          </div>

          {/* Historia */}
          <div className="flex flex-col md:flex-row gap-8 mb-16">
            <div className="md:w-2/3 bg-[#ff7043] rounded-xl shadow-lg overflow-hidden">
              <div className="p-8 md:p-10 relative">
                <div className="text-white text-lg">
                  <h2 className="text-2xl font-bold mb-6 flex items-center">
                    <i className="fas fa-globe-americas mr-3"></i>
                    {t('historyTitle')}
                  </h2>
                  <p className="mb-6">{t('historyP1')}</p>
                  <p className="mb-6">{t('historyP2')}</p>
                  <p className="font-semibold">{t('historyQuote')}</p>
                </div>
              </div>
            </div>
            <div className="md:w-1/3">
              <div className="flex flex-col gap-4 h-full">
                <div className="bg-white rounded-xl shadow-lg overflow-hidden flex-1">
                  <div className="p-6 text-center">
                    <div className="flex justify-center mb-4">
                      <div className="w-16 h-16 bg-[#ff7043] bg-opacity-10 rounded-full flex items-center justify-center">
                        <i className="fas fa-handshake text-[#ff7043] text-3xl"></i>
                      </div>
                    </div>
                    <h3 className="text-xl font-bold mb-3">{t('guaranteeTitle')}</h3>
                    <p className="text-gray-600">{t('guaranteeDesc')}</p>
                  </div>
                </div>
                <div className="bg-[#009688] rounded-xl shadow-lg p-6 flex-1">
                  <h3 className="text-xl font-bold mb-3 text-white">{t('excellenceTitle')}</h3>
                  <p className="text-white">{t('excellenceDesc')}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Misión, Visión, Valores */}
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all">
              <div className="h-3 bg-[#009688]"></div>
              <div className="p-8">
                <div className="w-20 h-20 rounded-full bg-[#009688] bg-opacity-10 flex items-center justify-center mx-auto mb-6">
                  <i className="fas fa-rocket text-[#009688] text-3xl"></i>
                </div>
                <h2 className="text-2xl font-bold text-[#009688] mb-6 text-center">{t('missionTitle')}</h2>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <p className="text-gray-700 text-lg leading-relaxed text-center font-medium">{t('missionDesc')}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all">
              <div className="h-3 bg-[#ff7043]"></div>
              <div className="p-8">
                <div className="w-20 h-20 rounded-full bg-[#ff7043] bg-opacity-10 flex items-center justify-center mx-auto mb-6">
                  <i className="fas fa-eye text-[#ff7043] text-3xl"></i>
                </div>
                <h2 className="text-2xl font-bold text-[#ff7043] mb-6 text-center">{t('visionTitle')}</h2>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <p className="text-gray-700 text-lg leading-relaxed text-center font-medium">{t('visionDesc')}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all">
              <div className="h-3 bg-[#009688]"></div>
              <div className="p-8">
                <div className="w-20 h-20 rounded-full bg-[#009688] bg-opacity-10 flex items-center justify-center mx-auto mb-6">
                  <i className="fas fa-medal text-[#009688] text-3xl"></i>
                </div>
                <h2 className="text-2xl font-bold text-[#009688] mb-6 text-center">{t('valuesTitle')}</h2>
                <ul className="space-y-4">
                  {values.map((value, index) => (
                    <li key={index} className="flex items-center p-2 rounded-md hover:bg-gray-50 transition-colors">
                      <div className="bg-[#ff7043] bg-opacity-10 rounded-full p-3 mr-3 flex-shrink-0">
                        <i className={`fas ${value.icon} text-[#ff7043] text-lg`}></i>
                      </div>
                      <span className="text-gray-700 font-medium">{value.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Por qué elegirnos */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">
              {t('whyTitle')} <span className="text-[#009688]">SR Global Experiences</span>?
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {whyChoose.map((item, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow">
                  <div className="flex justify-center mb-4">
                    <div className={`w-16 h-16 bg-${item.color} bg-opacity-10 rounded-full flex items-center justify-center`}>
                      <i className={`fas ${item.icon} text-2xl text-${item.color}`}></i>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-center mb-3">{item.title}</h3>
                  <p className="text-gray-600 text-center">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="bg-[#ff7043] rounded-xl shadow-lg overflow-hidden">
            <div className="p-8 md:p-10 text-center">
              <h2 className="text-2xl font-bold text-white mb-4">{t('ctaTitle')}</h2>
              <p className="text-white mb-8 max-w-2xl mx-auto">{t('ctaDesc')}</p>
              <a href="/contact" className="bg-white hover:bg-gray-50 text-[#009688] font-bold py-3 px-8 rounded-lg inline-flex items-center transition-colors">
                <i className="fas fa-paper-plane mr-2"></i>
                {t('ctaButton')}
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
