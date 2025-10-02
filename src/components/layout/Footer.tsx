import {Link} from '@/i18n/routing';
import {useTranslations} from 'next-intl';
import {FaFacebook, FaInstagram, FaTwitter, FaLinkedin} from 'react-icons/fa';

export default function Footer() {
  const t = useTranslations('footer');
  const tNav = useTranslations('nav');

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-brand-dark text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div>
            <img
              src="https://i.imgur.com/H57d5sD.png"
              alt="SR Global Logo"
              className="h-16 mb-4"
            />
            <p className="text-gray-300 text-sm">
              {t('description')}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">{t('quickLinks')}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-brand-orange transition-colors">
                  {tNav('home')}
                </Link>
              </li>
              <li>
                <Link href="/promotions" className="text-gray-300 hover:text-brand-orange transition-colors">
                  {tNav('promotions')}
                </Link>
              </li>
              <li>
                <Link href="/experiences" className="text-gray-300 hover:text-brand-orange transition-colors">
                  {tNav('experiences')}
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-brand-orange transition-colors">
                  {tNav('about')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-bold mb-4">{t('contact')}</h3>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li>Riviera Maya, México</li>
              <li>contact@srglobalexperiences.com</li>
              <li>+52 998 123 4567</li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-lg font-bold mb-4">{t('followUs')}</h3>
            <div className="flex space-x-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-brand-orange transition-colors"
              >
                <FaFacebook className="text-2xl" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-brand-orange transition-colors"
              >
                <FaInstagram className="text-2xl" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-brand-orange transition-colors"
              >
                <FaTwitter className="text-2xl" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-brand-orange transition-colors"
              >
                <FaLinkedin className="text-2xl" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400 text-sm">
          <p>© {currentYear} SR Global Experiences. {t('rights')}</p>
        </div>
      </div>
    </footer>
  );
}
