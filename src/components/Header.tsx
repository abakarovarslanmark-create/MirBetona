import React from 'react';
import type { SiteSettings } from '../types';
import type { AppRoute } from '../seo';

interface HeaderProps {
  settings: SiteSettings;
  currentRoute: AppRoute;
  cartCount: number;
  onNavigate: (route: AppRoute, sectionId?: string) => void;
  onOpenLeadModal: (source: 'contact', prefillItem?: string) => void;
  onOpenEstimateCheckout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  settings,
  currentRoute,
  cartCount,
  onNavigate,
  onOpenLeadModal,
  onOpenEstimateCheckout,
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
          <a
            href="#catalog"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('/', 'catalog');
            }}
            className="hover:text-slate-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            Каталог и ФБС
          </a>
          <a
            href="/spectehnika"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('/spectehnika');
            }}
            className={`transition-colors whitespace-nowrap shrink-0 ${
              currentRoute === '/spectehnika'
                ? 'text-slate-900 font-semibold underline underline-offset-4 decoration-orange-600 decoration-2'
                : 'hover:text-slate-900 hover:underline underline-offset-4'
            }`}
          >
            Спецтехника
          </a>
          <a
            href="#calculator"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('/', 'calculator');
            }}
            className="hover:text-slate-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            Калькулятор
          </a>
          <a
            href="#pricelist"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('/', 'pricelist');
            }}
            className="hover:text-slate-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            Прайс-лист
          </a>
          <a
            href="#quality"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('/', 'quality');
            }}
            className="hover:text-slate-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            Доставка и ГОСТ
          </a>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={() => {
              if (cartCount > 0) {
                onOpenEstimateCheckout();
              } else {
                onOpenLeadModal('contact', 'Консультация и расчет заказа');
              }
            }}
            className="px-4 py-2 text-xs font-semibold text-white bg-orange-600 rounded-lg hover:bg-orange-700 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            {cartCount > 0 ? `Смета (${cartCount}) · Оформить` : 'Оставить заявку'}
          </button>
        </div>
      </div>

      {/* Мобильная полоса навигации */}
      <div className="md:hidden border-t border-slate-100 px-6 py-2 overflow-x-auto flex items-center gap-4 text-xs font-medium text-slate-600">
        <a
          href="#catalog"
          onClick={(e) => {
            e.preventDefault();
            onNavigate('/', 'catalog');
          }}
          className="whitespace-nowrap shrink-0"
        >
          Каталог и ФБС
        </a>
        <a
          href="/spectehnika"
          onClick={(e) => {
            e.preventDefault();
            onNavigate('/spectehnika');
          }}
          className={`whitespace-nowrap shrink-0 ${
            currentRoute === '/spectehnika' ? 'text-orange-600 font-bold' : ''
          }`}
        >
          Спецтехника
        </a>
        <a
          href="#calculator"
          onClick={(e) => {
            e.preventDefault();
            onNavigate('/', 'calculator');
          }}
          className="whitespace-nowrap shrink-0"
        >
          Калькулятор
        </a>
        <a
          href="#quality"
          onClick={(e) => {
            e.preventDefault();
            onNavigate('/', 'quality');
          }}
          className="whitespace-nowrap shrink-0"
        >
          Доставка и ГОСТ
        </a>
      </div>
    </header>
  );
};
