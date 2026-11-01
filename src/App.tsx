/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState, useCallback } from 'react';
import type { ProductItem, EquipmentItem, SiteSettings, LeadSource } from './types';
import { type AppRoute, SEO_ROUTES, normalizeRoute, applyClientSeoMeta } from './seo';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { CatalogSection } from './components/CatalogSection';
import { EquipmentSection } from './components/EquipmentSection';
import { CalculatorSection } from './components/CalculatorSection';
import { PriceTableSection } from './components/PriceTableSection';
import { QualityAndDeliverySection } from './components/QualityAndDeliverySection';
import { LeadForm } from './components/LeadForm';
import { LegalModal } from './components/LegalModals';
import { Footer } from './components/Footer';
import { AdminPanel } from './components/AdminPanel';

const FALLBACK_SETTINGS: SiteSettings = {
  companyName: 'БетонПром 73',
  legalEntity: 'ООО «БетонПромСтрой Ульяновск»',
  inn: '7325000000',
  ogrn: '1207300000000',
  address: 'г. Ульяновск, Московское шоссе, промзона, РБУ №1',
  phone: '+7 (8422) 00-00-00',
  email: 'zakaz@betonprom73.ru',
  telegramUrl: 'https://t.me/',
  vkUrl: 'https://vk.com/',
  whatsappPhone: '79000000000',
  plantCapacityM3PerHour: 60,
  cityDeliveryTime: '30–60 минут',
  gostStandard:
    'ГОСТ 7473-2010 (действует до 01.11.2026) и новый ГОСТ 7473-2026 (с 01.11.2026)',
  labDescription:
    'Собственная производственная лаборатория для внутреннего контроля качества замесов и входящего сырья',
  certificatesNote:
    'Сертификаты и документы о качестве предоставляются по требованию заказчика',
  deliveryBasePrice: 3500,
  deliveryPricePerKm: 120,
  showPriceTable: true,
  showTechnicalSpecsPFW: false,
  showEmailFieldInForm: false,
  showCookieBanner: true,
};

export default function App() {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [equipment, setEquipment] = useState<EquipmentItem[]>([]);
  const [settings, setSettings] = useState<SiteSettings>(FALLBACK_SETTINGS);
  const [loading, setLoading] = useState<boolean>(true);

  const [currentRoute, setCurrentRoute] = useState<AppRoute>(() =>
    normalizeRoute(window.location.pathname)
  );

  // Состояние модального окна заявки (заказ смеси, спецтехники или расчета калькулятора)
  const [leadModalOpen, setLeadModalOpen] = useState<boolean>(false);
  const [leadSource, setLeadSource] = useState<LeadSource>('contact');
  const [prefillItem, setPrefillItem] = useState<string | undefined>(undefined);
  const [prefillCalculation, setPrefillCalculation] = useState<string | undefined>(undefined);

  // Состояние модального окна с юридическими документами (152-ФЗ, Оферта, Cookie)
  const [legalDoc, setLegalDoc] = useState<'privacy' | 'consent' | 'offer' | null>(null);

  const navigateTo = useCallback((route: AppRoute) => {
    setCurrentRoute(route);
    if (window.location.pathname !== route) {
      window.history.pushState({}, '', route);
    }
    applyClientSeoMeta(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    applyClientSeoMeta(currentRoute);
    const onPopState = () => {
      const nextRoute = normalizeRoute(window.location.pathname);
      setCurrentRoute(nextRoute);
      applyClientSeoMeta(nextRoute);
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, [currentRoute]);

  const loadCatalogData = useCallback(async () => {
    try {
      const res = await fetch('/api/catalog');
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products || []);
        setEquipment(data.equipment || []);
        if (data.settings) {
          setSettings(data.settings);
        }
      }
    } catch {
      // Fallback handled gracefully
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCatalogData();
  }, [loadCatalogData]);

  const handleOpenLeadModal = (
    source: LeadSource,
    selectedItem?: string,
    calculationSummary?: string
  ) => {
    setLeadSource(source);
    setPrefillItem(selectedItem);
    setPrefillCalculation(calculationSummary);
    setLeadModalOpen(true);
  };

  const activeSeoMeta = SEO_ROUTES[currentRoute] || SEO_ROUTES['/'];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Header
        settings={settings}
        currentRoute={currentRoute}
        onNavigate={navigateTo}
        onOpenLeadModal={(src, item) => handleOpenLeadModal(src, item)}
      />

      {currentRoute === '/admin' ? (
        <main className="flex-1">
          <AdminPanel
            onBackToSite={() => navigateTo('/')}
            onDataUpdated={loadCatalogData}
          />
        </main>
      ) : (
        <main className="flex-1">
          {/* Хлебные крошки и SEO-шапка для внутренних посадочных страниц */}
          {currentRoute !== '/' && (
            <section className="bg-white border-b border-slate-200 py-8">
              <div className="max-w-[1200px] mx-auto px-6">
                <nav className="text-xs text-slate-500 mb-3 flex items-center gap-2">
                  <a
                    href="/"
                    onClick={(e) => {
                      e.preventDefault();
                      navigateTo('/');
                    }}
                    className="hover:text-slate-900 underline underline-offset-4"
                  >
                    Главная
                  </a>
                  <span aria-hidden="true">/</span>
                  <span className="text-slate-900 font-medium">{activeSeoMeta.label}</span>
                </nav>
                <h1 className="text-2xl md:text-4xl font-bold text-slate-900 font-display tracking-tight">
                  {activeSeoMeta.h1}
                </h1>
                <p className="text-sm text-slate-600 mt-2 max-w-2xl">
                  {activeSeoMeta.subtitle}
                </p>
              </div>
            </section>
          )}

          {/* МАРШРУТ 1: ГЛАВНАЯ СТРАНИЦА (Конверсионный лендинг + обзор всех разделов) */}
          {currentRoute === '/' && (
            <>
              <Hero
                settings={settings}
                onNavigate={navigateTo}
                onOpenLeadModal={(src, item) => handleOpenLeadModal(src, item)}
              />

              {loading ? (
                <div className="max-w-[1200px] mx-auto px-6 py-16 text-sm text-slate-500">
                  Загрузка прайс-листа и каталога продукции...
                </div>
              ) : (
                <>
                  <CatalogSection
                    products={products}
                    settings={settings}
                    onOrderProduct={(itemTitle) => handleOpenLeadModal('catalog', itemTitle)}
                    onNavigate={navigateTo}
                  />

                  <EquipmentSection
                    equipment={equipment}
                    onOrderEquipment={(eqTitle) => handleOpenLeadModal('equipment', eqTitle)}
                  />

                  <CalculatorSection
                    products={products}
                    equipment={equipment}
                    settings={settings}
                    onSubmitCalculation={(title, summary) =>
                      handleOpenLeadModal('calculator', title, summary)
                    }
                  />

                  <PriceTableSection
                    products={products}
                    settings={settings}
                    onOrderProduct={(itemTitle) => handleOpenLeadModal('catalog', itemTitle)}
                  />

                  <QualityAndDeliverySection
                    settings={settings}
                    onOpenLeadModal={(src, item) => handleOpenLeadModal(src, item)}
                  />
                </>
              )}
            </>
          )}

          {/* МАРШРУТ 2: СТРАНИЦА «ТОВАРНЫЙ БЕТОН» (/beton) */}
          {currentRoute === '/beton' && (
            <>
              <CatalogSection
                products={products}
                settings={settings}
                fixedCategory="concrete"
                sectionTitle="Марки товарного бетона М100–М400 с доставкой по Ульяновску"
                sectionSubtitle="Отгружаем бетонные смеси на гравийном и гранитном щебне по ГОСТ 7473-2010 и ГОСТ 7473-2026 без недолива. Подача миксера в любой район Ульяновска за 30–60 минут."
                onOrderProduct={(itemTitle) => handleOpenLeadModal('catalog', itemTitle)}
              />
              <PriceTableSection
                products={products.filter((p) => p.category === 'concrete')}
                settings={settings}
                onOrderProduct={(itemTitle) => handleOpenLeadModal('catalog', itemTitle)}
              />
              <CalculatorSection
                products={products}
                equipment={equipment}
                settings={settings}
                onSubmitCalculation={(title, summary) =>
                  handleOpenLeadModal('calculator', title, summary)
                }
              />
            </>
          )}

          {/* МАРШРУТ 3: СТРАНИЦА «СТРОИТЕЛЬНЫЕ РАСТВОРЫ» (/rastvory) */}
          {currentRoute === '/rastvory' && (
            <>
              <CatalogSection
                products={products}
                settings={settings}
                fixedCategory="mortar"
                sectionTitle="Кладочные, монтажные и штукатурные растворы в Ульяновске"
                sectionSubtitle="Готовые пластичные цементно-песчаные смеси М100, М150 и М200 на мытом сеяном песке без глины с доставкой миксерами с РБУ мощностью 60 м³/час."
                onOrderProduct={(itemTitle) => handleOpenLeadModal('catalog', itemTitle)}
              />
              <PriceTableSection
                products={products.filter((p) => p.category === 'mortar')}
                settings={settings}
                onOrderProduct={(itemTitle) => handleOpenLeadModal('catalog', itemTitle)}
              />
              <CalculatorSection
                products={products}
                equipment={equipment}
                settings={settings}
                onSubmitCalculation={(title, summary) =>
                  handleOpenLeadModal('calculator', title, summary)
                }
              />
            </>
          )}

          {/* МАРШРУТ 4: СТРАНИЦА «АРЕНДА СПЕЦТЕХНИКИ» (/spectehnika) */}
          {currentRoute === '/spectehnika' && (
            <>
              <EquipmentSection
                equipment={equipment}
                onOrderEquipment={(eqTitle) => handleOpenLeadModal('equipment', eqTitle)}
              />
              <QualityAndDeliverySection
                settings={settings}
                onOpenLeadModal={(src, item) => handleOpenLeadModal(src, item)}
              />
            </>
          )}

          {/* МАРШРУТ 5: СТРАНИЦА «КАЛЬКУЛЯТОР И ПРАЙС-ЛИСТ» (/calculator) */}
          {currentRoute === '/calculator' && (
            <>
              <CalculatorSection
                products={products}
                equipment={equipment}
                settings={settings}
                onSubmitCalculation={(title, summary) =>
                  handleOpenLeadModal('calculator', title, summary)
                }
              />
              <PriceTableSection
                products={products}
                settings={settings}
                onOrderProduct={(itemTitle) => handleOpenLeadModal('catalog', itemTitle)}
              />
            </>
          )}

          {/* МАРШРУТ 6: СТРАНИЦА «ДОСТАВКА, ЛАБОРАТОРИЯ И ГОСТ» (/dostavka) */}
          {currentRoute === '/dostavka' && (
            <QualityAndDeliverySection
              settings={settings}
              onOpenLeadModal={(src, item) => handleOpenLeadModal(src, item)}
            />
          )}

          {/* Сквозная секция обратной связи внизу каждой страницы */}
          <section id="contact" className="py-16 bg-slate-100">
            <div className="max-w-[1200px] mx-auto px-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                <div className="lg:col-span-5 space-y-4">
                  <h2 className="text-2xl md:text-3xl font-bold text-slate-900 font-display tracking-tight">
                    Закажите расчет сметы и подачу миксера напрямую у диспетчера РБУ
                  </h2>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Оставьте номер телефона — технолог-диспетчер перезвонит вам, поможет подобрать
                    марку под проектную нагрузку, проверит подъездные пути на вашем объекте в
                    Ульяновске или области и забронирует время подачи (по городу {settings.cityDeliveryTime}).
                  </p>

                  <div className="pt-2 space-y-2 text-sm text-slate-700">
                    <div>
                      <span className="text-slate-500">Телефон диспетчерской: </span>
                      <a
                        href={`tel:${settings.phone.replace(/[^\d+]/g, '')}`}
                        className="font-bold text-slate-900 font-num hover:underline"
                      >
                        {settings.phone}
                      </a>
                    </div>
                    <div>
                      <span className="text-slate-500">Адрес отгрузки: </span>
                      <span className="font-medium text-slate-900">{settings.address}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Документы: </span>
                      <span>{settings.certificatesNote}</span>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6">
                  <LeadForm
                    settings={settings}
                    source="contact"
                    onOpenLegalModal={(doc) => setLegalDoc(doc)}
                  />
                </div>
              </div>
            </div>
          </section>
        </main>
      )}

      <Footer
        settings={settings}
        onNavigate={navigateTo}
        onOpenLegalModal={(doc) => setLegalDoc(doc)}
      />

      {/* Модальное окно оформления заявки */}
      {leadModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-xl max-w-lg w-full p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-200">
              <h3 className="text-lg font-bold text-slate-900 font-display">
                Оформление заявки на поставку
              </h3>
              <button
                type="button"
                onClick={() => setLeadModalOpen(false)}
                className="text-xs font-semibold text-slate-500 hover:text-slate-900 px-2.5 py-1 rounded bg-slate-100 cursor-pointer"
              >
                Закрыть
              </button>
            </div>

            <LeadForm
              settings={settings}
              source={leadSource}
              selectedItem={prefillItem}
              calculationSummary={prefillCalculation}
              onSuccess={() => setLeadModalOpen(false)}
              onOpenLegalModal={(doc) => setLegalDoc(doc)}
            />
          </div>
        </div>
      )}

      {/* Модальное окно юридических документов */}
      <LegalModal
        docType={legalDoc}
        settings={settings}
        onClose={() => setLegalDoc(null)}
      />
    </div>
  );
}
