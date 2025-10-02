'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useState } from 'react';

export default function RomancePage() {
  const t = useTranslations('romance');
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const experiences = [
    {
      id: 'honeymoon',
      image: 'https://i.imgur.com/S3WYJ7f.jpeg',
      title: t('honeymoonTitle'),
      description: t('honeymoonDesc'),
      color: 'brand-orange',
      icon: 'fa-heart'
    },
    {
      id: 'bachelor',
      image: 'https://i.imgur.com/pWhw8eY.jpeg',
      title: t('bachelorTitle'),
      description: t('bachelorDesc'),
      color: 'brand-turquoise',
      icon: 'fa-glass-cheers'
    },
    {
      id: 'anniversary',
      image: 'https://i.imgur.com/QcNroLQ.jpeg',
      title: t('anniversaryTitle'),
      description: t('anniversaryDesc'),
      color: 'brand-blue',
      icon: 'fa-heart'
    }
  ];

  const destinations = [
    {
      image: 'https://mexicancaribbean.travel/wp-content/uploads/2024/09/RIVIERA-MAYA_PLAYA-MAROMA_11zon-scaled.jpg',
      title: t('rivieraMayaTitle'),
      description: t('rivieraMayaDesc')
    },
    {
      image: 'https://elviajerofeliz.com/wp-content/uploads/2015/04/venecia-romance.jpg',
      title: t('parisEuropeTitle'),
      description: t('parisEuropeDesc')
    }
  ];

  return (
    <main>
      {/* Banner */}
      <section className="py-20 bg-cover bg-center" style={{ backgroundImage: "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('https://i.imgur.com/S3WYJ7f.jpeg')" }}>
        <div className="container mx-auto px-6 text-center text-white">
          <h1 className="text-5xl font-pacifico mb-4">{t('bannerTitle')}</h1>
          <p className="text-xl max-w-3xl mx-auto">{t('bannerSubtitle')}</p>
        </div>
      </section>

      {/* Experiencias */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-brand-dark mb-4">{t('exploreTitle')}</h2>
          <p className="text-lg text-gray-600 mb-12 max-w-3xl mx-auto">{t('exploreDesc')}</p>

          <div className="grid md:grid-cols-3 gap-8">
            {experiences.map((exp) => (
              <div key={exp.id} className="bg-gray-50 rounded-xl shadow-lg overflow-hidden transform transition duration-300 hover:-translate-y-2 hover:shadow-xl">
                <div className="relative h-64 w-full">
                  <Image src={exp.image} alt={exp.title} fill className="object-cover" />
                </div>
                <div className="p-6">
                  <h3 className={`text-2xl font-bold text-${exp.color} mb-3`}>{exp.title}</h3>
                  <p className="text-gray-600 mb-4">{exp.description}</p>
                  <button 
                    onClick={() => setActiveModal(exp.id)}
                    className={`inline-block bg-${exp.color} text-white py-2 px-6 rounded-lg hover:bg-opacity-90 transition-colors`}
                  >
                    {t('discoverMore')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Destinos Románticos */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-brand-dark mb-12">{t('destinationsTitle')}</h2>
          <div className="grid md:grid-cols-2 gap-10">
            {destinations.map((dest, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col md:flex-row">
                <div className="relative w-full md:w-2/5 h-60 md:h-auto">
                  <Image src={dest.image} alt={dest.title} fill className="object-cover" />
                </div>
                <div className="p-6 md:w-3/5">
                  <h3 className="text-2xl font-bold text-brand-orange mb-3">{dest.title}</h3>
                  <p className="text-gray-600 mb-4">{dest.description}</p>
                  <a href="/contact" className="inline-block bg-brand-turquoise text-white py-2 px-6 rounded-lg hover:bg-opacity-90 transition-colors">
                    {t('consult')}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modal Honeymoon */}
      {activeModal === 'honeymoon' && (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center" onClick={() => setActiveModal(null)}>
          <div className="bg-white rounded-xl max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-3xl font-bold text-brand-orange">{t('honeymoonModalTitle')}</h2>
                <button onClick={() => setActiveModal(null)} className="text-gray-500 hover:text-gray-800 text-2xl">
                  <i className="fas fa-times"></i>
                </button>
              </div>
              <div className="mb-6">
                <div className="relative h-64 w-full mb-4 rounded-lg overflow-hidden">
                  <Image src="https://i.imgur.com/S3WYJ7f.jpeg" alt="Luna de Miel" fill className="object-cover" />
                </div>
                <p className="text-gray-700 mb-4">{t('honeymoonModalDesc')}</p>
                <ul className="space-y-3 text-gray-600 mb-6">
                  <li className="flex items-start">
                    <i className="fas fa-heart text-brand-orange mt-1 mr-3"></i>
                    <span>{t('honeymoonPoint1')}</span>
                  </li>
                  <li className="flex items-start">
                    <i className="fas fa-heart text-brand-orange mt-1 mr-3"></i>
                    <span>{t('honeymoonPoint2')}</span>
                  </li>
                  <li className="flex items-start">
                    <i className="fas fa-heart text-brand-orange mt-1 mr-3"></i>
                    <span>{t('honeymoonPoint3')}</span>
                  </li>
                  <li className="flex items-start">
                    <i className="fas fa-heart text-brand-orange mt-1 mr-3"></i>
                    <span>{t('honeymoonPoint4')}</span>
                  </li>
                </ul>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <a href="mailto:ventas@srglobalexperiences.com?subject=Información sobre Luna de Miel" className="flex-1 bg-brand-dark text-white text-center py-3 px-6 rounded-lg hover:bg-opacity-90 transition-colors flex items-center justify-center">
                  <i className="fas fa-envelope mr-2"></i>
                  {t('sendEmail')}
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Bachelor */}
      {activeModal === 'bachelor' && (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center" onClick={() => setActiveModal(null)}>
          <div className="bg-white rounded-xl max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-3xl font-bold text-brand-turquoise">{t('bachelorModalTitle')}</h2>
                <button onClick={() => setActiveModal(null)} className="text-gray-500 hover:text-gray-800 text-2xl">
                  <i className="fas fa-times"></i>
                </button>
              </div>
              <div className="mb-6">
                <div className="relative h-64 w-full mb-4 rounded-lg overflow-hidden">
                  <Image src="https://i.imgur.com/pWhw8eY.jpeg" alt="Despedidas" fill className="object-cover" />
                </div>
                <p className="text-gray-700 mb-4">{t('bachelorModalDesc')}</p>
                <ul className="space-y-3 text-gray-600 mb-6">
                  <li className="flex items-start">
                    <i className="fas fa-glass-cheers text-brand-turquoise mt-1 mr-3"></i>
                    <span>{t('bachelorPoint1')}</span>
                  </li>
                  <li className="flex items-start">
                    <i className="fas fa-glass-cheers text-brand-turquoise mt-1 mr-3"></i>
                    <span>{t('bachelorPoint2')}</span>
                  </li>
                  <li className="flex items-start">
                    <i className="fas fa-glass-cheers text-brand-turquoise mt-1 mr-3"></i>
                    <span>{t('bachelorPoint3')}</span>
                  </li>
                  <li className="flex items-start">
                    <i className="fas fa-glass-cheers text-brand-turquoise mt-1 mr-3"></i>
                    <span>{t('bachelorPoint4')}</span>
                  </li>
                </ul>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <a href="mailto:ventas@srglobalexperiences.com?subject=Información sobre Despedida" className="flex-1 bg-brand-dark text-white text-center py-3 px-6 rounded-lg hover:bg-opacity-90 transition-colors flex items-center justify-center">
                  <i className="fas fa-envelope mr-2"></i>
                  {t('sendEmail')}
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Anniversary */}
      {activeModal === 'anniversary' && (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center" onClick={() => setActiveModal(null)}>
          <div className="bg-white rounded-xl max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-3xl font-bold text-brand-blue">{t('anniversaryModalTitle')}</h2>
                <button onClick={() => setActiveModal(null)} className="text-gray-500 hover:text-gray-800 text-2xl">
                  <i className="fas fa-times"></i>
                </button>
              </div>
              <div className="mb-6">
                <div className="relative h-64 w-full mb-4 rounded-lg overflow-hidden">
                  <Image src="https://i.imgur.com/QcNroLQ.jpeg" alt="Aniversarios" fill className="object-cover" />
                </div>
                <p className="text-gray-700 mb-4">{t('anniversaryModalDesc')}</p>
                <ul className="space-y-3 text-gray-600 mb-6">
                  <li className="flex items-start">
                    <i className="fas fa-heart text-brand-blue mt-1 mr-3"></i>
                    <span>{t('anniversaryPoint1')}</span>
                  </li>
                  <li className="flex items-start">
                    <i className="fas fa-heart text-brand-blue mt-1 mr-3"></i>
                    <span>{t('anniversaryPoint2')}</span>
                  </li>
                  <li className="flex items-start">
                    <i className="fas fa-heart text-brand-blue mt-1 mr-3"></i>
                    <span>{t('anniversaryPoint3')}</span>
                  </li>
                  <li className="flex items-start">
                    <i className="fas fa-heart text-brand-blue mt-1 mr-3"></i>
                    <span>{t('anniversaryPoint4')}</span>
                  </li>
                </ul>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <a href="mailto:ventas@srglobalexperiences.com?subject=Información sobre Aniversario" className="flex-1 bg-brand-dark text-white text-center py-3 px-6 rounded-lg hover:bg-opacity-90 transition-colors flex items-center justify-center">
                  <i className="fas fa-envelope mr-2"></i>
                  {t('sendEmail')}
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
