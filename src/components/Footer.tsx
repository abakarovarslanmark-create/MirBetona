import React, { useState } from 'react';
import type { SiteSettings } from '../types';
import type { AppRoute } from '../seo';

interface FooterProps {
  settings: SiteSettings;
  onNavigate: (route: AppRoute) => void;
  onOpenLegalModal: (docType: 'privacy' | 'consent' | 'offer') => void;
}

export const Footer: React.FC<FooterProps> = ({
  settings,
  onNavigate,
  onOpenLegalModal,
}) => {
  const [cookieAccepted, setCookieAccepted] = useState<boolean>(() => {
    try {
      return localStorage.getItem('beton_cookie_accepted') === 'true';
    } catch {
      return false;
    }
  });

  const handleAcceptCookie = () => {
    setCookieAccepted(true);
    try {
      localStorage.setItem('beton_cookie_accepted', 'true');
    } catch {
      // ignore storage errors
    }
  };

  return (
    <>
      <footer className="bg-slate-900 text-slate-400 border-t border-slate-800">
        <div className="max-w-[1200px] mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-8 border-b border-slate-800">
            {/* Колонка 1: О заводе и реквизиты */}
            <div className="md:col-span-4 space-y-2">
              <div className="text-lg font-bold text-white font-display">
                {settings.companyName}
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Производство и продажа товарного бетона, строительных растворов (мощность РБУ{' '}
                {settings.plantCapacityM3PerHour} м³/час) и аренда спецтехники (АБН, автокран,
                автовышка + манипулятор, экскаватор JCB).
              </p>
              <div className="text-xs text-slate-500 pt-2 space-y-0.5 font-num">
                <div>
                  {settings.legalEntity} · ИНН {settings.inn} · ОГРН {settings.ogrn}
                </div>
                <div>Адрес РБУ: {settings.address}</div>
              </div>
            </div>

            {/* Колонка 2: Разделы многостраничника (SEO-перелинковка) */}
            <div className="md:col-span-3 space-y-2 text-xs">
              <div className="font-semibold text-white mb-2">Разделы сайта</div>
              <div>
                <a
                  href="/"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('/');
                  }}
                  className="hover:text-white transition-colors"
                >
                  Главная страница
                </a>
              </div>
              <div>
                <a
                  href="/beton"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('/beton');
                  }}
                  className="hover:text-white transition-colors"
                >
                  Товарный бетон М100–М400
                </a>
              </div>
              <div>
                <a
                  href="/rastvory"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('/rastvory');
                  }}
                  className="hover:text-white transition-colors"
                >
                  Строительные и кладочные растворы
                </a>
              </div>
              <div>
                <a
                  href="/spectehnika"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('/spectehnika');
                  }}
                  className="hover:text-white transition-colors"
                >
                  Аренда спецтехники (АБН, Кран, JCB)
                </a>
              </div>
              <div>
                <a
                  href="/calculator"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('/calculator');
                  }}
                  className="hover:text-white transition-colors"
                >
                  Калькулятор и прайс-лист
                </a>
              </div>
              <div>
                <a
                  href="/dostavka"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('/dostavka');
                  }}
                  className="hover:text-white transition-colors"
                >
                  Доставка, лаборатория и ГОСТ
                </a>
              </div>
            </div>

            {/* Колонка 3: Правовые документы */}
            <div className="md:col-span-3 space-y-2 text-xs">
              <div className="font-semibold text-white mb-2">Правовая информация (РФ)</div>
              <div>
                <button
                  type="button"
                  onClick={() => onOpenLegalModal('privacy')}
                  className="hover:text-white underline underline-offset-4 cursor-pointer text-left"
                >
                  Политика обработки персональных данных (152-ФЗ)
                </button>
              </div>
              <div>
                <button
                  type="button"
                  onClick={() => onOpenLegalModal('consent')}
                  className="hover:text-white underline underline-offset-4 cursor-pointer text-left"
                >
                  Согласие на обработку персональных данных
                </button>
              </div>
              <div>
                <button
                  type="button"
                  onClick={() => onOpenLegalModal('offer')}
                  className="hover:text-white underline underline-offset-4 cursor-pointer text-left"
                >
                  Уведомление об отсутствии публичной оферты (ст. 437 ГК РФ)
                </button>
              </div>
              <div className="pt-2">
                <a
                  href="/admin"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('/admin');
                  }}
                  className="text-slate-500 hover:text-slate-300 cursor-pointer"
                >
                  Вход в панель управления (/admin)
                </a>
              </div>
            </div>

            {/* Колонка 4: Контакты и разрешенные в РФ соцсети/мессенджеры */}
            <div className="md:col-span-2 space-y-2 text-xs">
              <div className="font-semibold text-white mb-2">Диспетчерская</div>
              <div>
                <a
                  href={`tel:${settings.phone.replace(/[^\d+]/g, '')}`}
                  className="text-sm font-bold text-white font-num hover:text-orange-400"
                >
                  {settings.phone}
                </a>
              </div>
              <div className="text-slate-400">Подача: {settings.cityDeliveryTime}</div>

              {/* Разрешенные мессенджеры и соцсети (без запрещенных в РФ ресурсов Meta) */}
              <div className="flex flex-wrap items-center gap-2 pt-2">
                <a
                  href={settings.telegramUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-2.5 py-1 bg-slate-800 text-slate-200 rounded hover:bg-slate-700 transition-colors"
                >
                  Telegram
                </a>
                <a
                  href={settings.vkUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-2.5 py-1 bg-slate-800 text-slate-200 rounded hover:bg-slate-700 transition-colors"
                >
                  VK
                </a>
                {settings.whatsappPhone && (
                  <a
                    href={`https://wa.me/${settings.whatsappPhone.replace(/[^\d]/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-2.5 py-1 bg-slate-800 text-slate-200 rounded hover:bg-slate-700 transition-colors"
                  >
                    WhatsApp
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-[11px] text-slate-500">
            <p>
              © {new Date().getFullYear()} {settings.legalEntity}. Все цены на сайте носят
              информационный характер и не являются публичной офертой (ст. 437 ГК РФ).
            </p>
            <p className="font-num">{settings.gostStandard}</p>
          </div>
        </div>
      </footer>

      {/* Ненавязчивое уведомление о Cookie */}
      {settings.showCookieBanner && !cookieAccepted && (
        <div className="fixed bottom-4 right-4 left-4 md:left-auto md:max-w-md z-40 bg-slate-900 text-white border border-slate-700 rounded-xl p-4 shadow-lg flex items-center justify-between gap-4">
          <div className="text-xs text-slate-300 leading-relaxed">
            Сайт использует технические файлы cookie для работы калькулятора и веб-аналитики в
            соответствии с{' '}
            <button
              type="button"
              onClick={() => onOpenLegalModal('privacy')}
              className="underline text-white hover:text-orange-400 cursor-pointer"
            >
              Политикой ПДн (152-ФЗ)
            </button>
            .
          </div>
          <button
            type="button"
            onClick={handleAcceptCookie}
            className="px-3.5 py-2 text-xs font-semibold bg-orange-600 text-white rounded-lg hover:bg-orange-700 whitespace-nowrap shrink-0 cursor-pointer"
          >
            Принять
          </button>
        </div>
      )}
    </>
  );
};
