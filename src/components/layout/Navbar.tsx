'use client';

import {useState} from 'react';
import {Link, usePathname} from '@/i18n/routing';
import {useTranslations} from 'next-intl';
import {FaBars, FaTimes} from 'react-icons/fa';
import LanguageSwitcher from './LanguageSwitcher';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations('nav');
  const pathname = usePathname();

  const navLinks = [
    {href: '/', label: t('home')},
    {href: '/promotions', label: t('promotions')},
    {href: '/experiences', label: t('experiences')},
    {href: '/romance', label: t('romance')},
    {href: '/destinations', label: t('destinations')},
    {href: '/groups', label: t('groups')},
    {href: '/about', label: t('about')},
  ];

  const toggleMenu = () => setIsOpen(!isOpen);
  
  const closeMenu = () => setIsOpen(false);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <img
              src="https://i.imgur.com/H57d5sD.png"
              alt="SR Global Logo"
              className="h-12"
            />
            <span className="font-bold text-brand-dark hidden sm:block">
              SR Global Experiences
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`hover:text-brand-orange transition-colors font-semibold ${
                  pathname === link.href ? 'text-brand-orange' : 'text-gray-700'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side buttons */}
          <div className="flex items-center gap-4">
            <Link
              href="/contact"
              className="bg-brand-orange text-white font-bold py-2 px-5 rounded-lg hover:bg-opacity-90 transition-all hover:scale-105"
            >
              {t('contact')}
            </Link>

            <LanguageSwitcher />

            {/* Mobile menu toggle */}
            <button
              onClick={toggleMenu}
              className="md:hidden text-gray-700 focus:outline-none"
              aria-label={isOpen ? 'Cerrar menú' : 'Abrir menú'}
              aria-expanded={isOpen}
            >
              {isOpen ? <FaTimes className="text-2xl" /> : <FaBars className="text-2xl" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4 bg-white rounded-lg shadow-lg">
            <div className="flex flex-col space-y-3 px-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeMenu}
                  className={`py-2 px-4 hover:bg-gray-100 rounded-md hover:text-brand-orange transition-colors ${
                    pathname === link.href ? 'text-brand-orange bg-gray-50' : ''
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
