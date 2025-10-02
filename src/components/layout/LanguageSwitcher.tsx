'use client';

import {useLocale} from 'next-intl';
import {useRouter, usePathname} from '@/i18n/routing';
import {useTransition} from 'react';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const switchLanguage = (newLocale: string) => {
    startTransition(() => {
      router.replace(pathname, {locale: newLocale});
    });
  };

  return (
    <div className="flex items-center space-x-2 text-sm font-bold text-gray-600">
      <button
        onClick={() => switchLanguage('es')}
        className={`cursor-pointer hover:text-brand-orange transition-colors ${
          locale === 'es' ? 'text-brand-orange' : ''
        }`}
        disabled={isPending}
      >
        ES
      </button>
      <span className="text-gray-300">|</span>
      <button
        onClick={() => switchLanguage('en')}
        className={`cursor-pointer hover:text-brand-orange transition-colors ${
          locale === 'en' ? 'text-brand-orange' : ''
        }`}
        disabled={isPending}
      >
        EN
      </button>
    </div>
  );
}
