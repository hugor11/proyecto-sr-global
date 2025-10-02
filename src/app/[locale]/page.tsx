import {useTranslations} from 'next-intl';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import {Link} from '@/i18n/routing';

export default function HomePage() {
  const t = useTranslations('hero');

  return (
    <>
      <Navbar />
      
      <main>
        {/* Hero Section */}
        <section
          className="relative h-[600px] flex items-center justify-center bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://mayanmonkey.com/blog/es/wp-content/uploads/sites/2/2023/02/shutterstock_2133566785-compressed.jpg)',
          }}
        >
          <div className="absolute inset-0 bg-black/50"></div>
          <div className="relative z-10 text-center text-white px-4">
            <h1 className="text-5xl md:text-6xl font-black mb-4">
              {t('title')}
            </h1>
            <p className="text-xl md:text-2xl mb-8">
              {t('subtitle')}
            </p>
            <Link
              href="/destinations"
              className="inline-block bg-brand-orange text-white font-bold py-4 px-8 rounded-lg hover:bg-opacity-90 transition-all hover:scale-105"
            >
              {t('cta')}
            </Link>
          </div>
        </section>

        {/* Welcome Section */}
        <section className="py-16 px-4">
          <div className="container mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6 text-brand-dark">
              Bienvenidos a SR Global Experiences
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Somos una agencia de viajes especializada en crear experiencias únicas
              e inolvidables en Riviera Maya y destinos alrededor del mundo.
            </p>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-gray-50 px-4">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-brand-orange rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl">🌴</span>
                </div>
                <h3 className="text-xl font-bold mb-2">Experiencias Únicas</h3>
                <p className="text-gray-600">
                  Tours personalizados y experiencias exclusivas
                </p>
              </div>
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-brand-orange rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl">💎</span>
                </div>
                <h3 className="text-xl font-bold mb-2">Servicio Premium</h3>
                <p className="text-gray-600">
                  Atención personalizada 24/7 durante tu viaje
                </p>
              </div>
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-brand-orange rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl">✈️</span>
                </div>
                <h3 className="text-xl font-bold mb-2">Destinos Globales</h3>
                <p className="text-gray-600">
                  Riviera Maya, México y el mundo entero
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
