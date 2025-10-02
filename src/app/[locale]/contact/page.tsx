import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'contact' });
  
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
  };
}

export default function ContactPage() {
  const t = useTranslations('contact');
  
  return (
    <main>
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#009688]/10 via-white to-[#ff7043]/10">
        <div className="container mx-auto px-6 py-16">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold text-brand-dark mb-3">{t('heroTitle')}</h1>
            <p className="text-lg text-gray-600 mb-6">{t('heroSubtitle')}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a href="#form" className="bg-brand-orange text-white font-bold py-3 px-6 rounded-lg hover:bg-opacity-90 transition-all hover:scale-105">
                {t('sendRequest')}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <section className="py-6 bg-white border-y">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div className="flex items-center justify-center gap-3 bg-gray-50 rounded-lg py-3">
              <div className="w-10 h-10 rounded-full bg-[#009688]/10 flex items-center justify-center">
                <i className="fas fa-headset text-[#009688]"></i>
              </div>
              <div className="text-left">
                <p className="text-sm text-gray-500">{t('supportLabel')}</p>
                <p className="font-semibold">{t('support24_7')}</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3 bg-gray-50 rounded-lg py-3">
              <div className="w-10 h-10 rounded-full bg-[#ff7043]/10 flex items-center justify-center">
                <i className="fas fa-bolt text-[#ff7043]"></i>
              </div>
              <div className="text-left">
                <p className="text-sm text-gray-500">{t('responseLabel')}</p>
                <p className="font-semibold">{t('fastResponse')}</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3 bg-gray-50 rounded-lg py-3">
              <div className="w-10 h-10 rounded-full bg-[#009688]/10 flex items-center justify-center">
                <i className="fas fa-shield-alt text-[#009688]"></i>
              </div>
              <div className="text-left">
                <p className="text-sm text-gray-500">{t('securityLabel')}</p>
                <p className="font-semibold">{t('protectedForm')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact info & Form */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Contact info panel */}
            <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
              <h2 className="text-2xl font-bold text-[#009688] mb-6">
                <i className="fas fa-address-book mr-2"></i>
                {t('dataTitle')}
              </h2>
              <ul className="space-y-5">
                <li className="flex items-start">
                  <div className="w-11 h-11 rounded-full bg-[#009688] bg-opacity-10 flex items-center justify-center mr-4 flex-shrink-0">
                    <i className="fas fa-envelope text-[#009688]"></i>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">{t('emailLabel')}</p>
                    <a href="mailto:ventas@srglobalexperiences.com" className="font-semibold text-brand-dark hover:text-brand-orange">
                      ventas@srglobalexperiences.com
                    </a>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-11 h-11 rounded-full bg-[#ff7043] bg-opacity-10 flex items-center justify-center mr-4 flex-shrink-0">
                    <i className="fas fa-phone text-[#ff7043]"></i>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">{t('phoneLabel')}</p>
                    <a href="tel:+522226794827" className="font-semibold text-brand-dark hover:text-brand-orange">
                      +52 222 679 4827
                    </a>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-11 h-11 rounded-full bg-[#009688] bg-opacity-10 flex items-center justify-center mr-4 flex-shrink-0">
                    <i className="fas fa-clock text-[#009688]"></i>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">{t('scheduleLabel')}</p>
                    <p className="font-semibold text-brand-dark">{t('businessHours')}</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-11 h-11 rounded-full bg-[#ff7043]/10 flex items-center justify-center mr-4 flex-shrink-0">
                    <i className="fas fa-earth-americas text-[#ff7043]"></i>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">{t('coverageLabel')}</p>
                    <p className="font-semibold text-brand-dark">{t('coverageText')}</p>
                  </div>
                </li>
              </ul>

              <div className="border-t mt-6 pt-6">
                <p className="text-sm text-gray-500 mb-3">{t('followLabel')}</p>
                <div className="flex items-center space-x-5 text-2xl">
                  <a href="https://www.facebook.com/share/1WTAQ6eENn/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" className="hover:text-brand-orange transition-colors">
                    <i className="fab fa-facebook-f"></i>
                  </a>
                  <a href="https://www.instagram.com/sr_global_experiences" target="_blank" rel="noopener noreferrer" className="hover:text-brand-orange transition-colors">
                    <i className="fab fa-instagram"></i>
                  </a>
                  <a href="https://www.tiktok.com/@sr_global_experiences" target="_blank" rel="noopener noreferrer" className="hover:text-brand-orange transition-colors">
                    <i className="fab fa-tiktok"></i>
                  </a>
                </div>
              </div>

              <div className="mt-8">
                <a 
                  href="mailto:ventas@srglobalexperiences.com" 
                  className="bg-brand-orange text-white font-bold py-3 px-5 rounded-lg text-center hover:bg-opacity-90 transition-colors w-full block"
                >
                  <i className="fas fa-paper-plane mr-2"></i>
                  {t('emailBtn')}
                </a>
              </div>
            </div>

            {/* Form */}
            <div id="form" className="bg-white rounded-2xl shadow-xl p-6 lg:col-span-2">
              <h2 className="text-2xl font-bold text-brand-dark mb-6">
                <i className="fas fa-file-alt mr-2 text-[#ff7043]"></i>
                {t('formTitle')}
              </h2>
              
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">{t('nameLabel')}</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-transparent"
                      placeholder={t('namePlaceholder')}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">{t('emailFormLabel')}</label>
                    <input 
                      type="email" 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-transparent"
                      placeholder={t('emailPlaceholder')}
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">{t('phoneFormLabel')}</label>
                    <input 
                      type="tel" 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-transparent"
                      placeholder={t('phonePlaceholder')}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">{t('serviceLabel')}</label>
                    <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-transparent">
                      <option value="">{t('serviceSelect')}</option>
                      <option value="tours">{t('serviceTours')}</option>
                      <option value="events">{t('serviceEvents')}</option>
                      <option value="groups">{t('serviceGroups')}</option>
                      <option value="romance">{t('serviceRomance')}</option>
                      <option value="other">{t('serviceOther')}</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">{t('messageLabel')}</label>
                  <textarea 
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-transparent"
                    placeholder={t('messagePlaceholder')}
                  ></textarea>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-brand-orange text-white font-bold py-4 px-8 rounded-lg hover:bg-opacity-90 transition-all hover:scale-105"
                >
                  <i className="fas fa-paper-plane mr-2"></i>
                  {t('submitBtn')}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
