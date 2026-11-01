import React from 'react';
import type { SiteSettings } from '../types';
import type { AppRoute } from '../seo';

interface HeaderProps {
  settings: SiteSettings;
  currentRoute: AppRoute;
  onNavigate: (route: AppRoute) => void;
  onOpenLeadModal: (source: 'contact', prefillItem?: string) => void;
}

const NAV_ITEMS: { route: AppRoute; label: string }[] = [
  { route: '/beton', label: 'Бетон' },
  { route: '/rastvory', label: 'Растворы' },
  { route: '/spectehnika', label: 'Спецтехника' },
  { route: '/calculator', label: 'Калькулятор' },
  { route: '/dostavka', label: 'Доставка и ГОСТ' },
];

export const Header: React.FC<HeaderProps> = ({
  settings,
  currentRoute,
  onNavigate,
  onOpenLeadModal,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200">
      <div className="max-w-[1200px] mx-auto flex items-center justify-between gap-8 px-6 py-4">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            onNavigate('/');
          }}
          className="text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 font-display"
        >
          {settings.companyName}
        </a>

        {/* Zone 2: 5 concise single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          {NAV_ITEMS.map((item) => {
            const isActive = currentRoute === item.route;
            return (
              <a
                key={item.route}
                href={item.route}
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate(item.route);
                }}
                className={`transition-colors whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'text-slate-900 font-semibold underline underline-offset-4 decoration-orange-600 decoration-2'
                    : 'hover:text-slate-900 hover:underline underline-offset-4'
                }`}
              >
                {item.label}
              </a>
            );
          })}
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={() => onOpenLeadModal('contact', 'Консультация и расчет заказа')}
            className="px-4 py-2 text-xs font-semibold text-white bg-orange-600 rounded-lg hover:bg-orange-700 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Оставить заявку
          </button>
        </div>
      </div>

      {/* Мобильная полоса навигации по страницам */}
      <div className="md:hidden border-t border-slate-100 px-6 py-2 overflow-x-auto flex items-center gap-4 text-xs font-medium text-slate-600">
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            onNavigate('/');
          }}
          className={`whitespace-nowrap shrink-0 ${
            currentRoute === '/' ? 'text-orange-600 font-bold' : ''
          }`}
        >
          Главная
        </a>
        {NAV_ITEMS.map((item) => (
          <a
            key={item.route}
            href={item.route}
            onClick={(e) => {
              e.preventDefault();
              onNavigate(item.route);
            }}
            className={`whitespace-nowrap shrink-0 ${
              currentRoute === item.route ? 'text-orange-600 font-bold' : ''
            }`}
          >
            {item.label}
          </a>
        ))}
      </div>
    </header>
  );
};
