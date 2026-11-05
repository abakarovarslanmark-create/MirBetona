/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState, useCallback } from 'react';
import type {
  ProductItem,
  EquipmentItem,
  SiteSettings,
  LeadSource,
  EstimateCartItem,
} from './types';
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
import { EstimateCartBar } from './components/EstimateCartBar';

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

const CART_STORAGE_KEY = 'beton_estimate_cart_v1';

export default function App() {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [equipment, setEquipment] = useState<EquipmentItem[]>([]);
  const [settings, setSettings] = useState<SiteSettings>(FALLBACK_SETTINGS);
  const [loading, setLoading] = useState<boolean>(true);

  const [currentRoute, setCurrentRoute] = useState<AppRoute>(() =>
    normalizeRoute(window.location.pathname)
  );

  // Состояние Сборной заявки (Корзины-сметы без онлайн-оплаты)
  const [cartItems, setCartItems] = useState<EstimateCartItem[]>(() => {
    try {
      const raw = localStorage.getItem(CART_STORAGE_KEY);
      return raw ? (JSON.parse(raw) as EstimateCartItem[]) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch {
      // ignore storage errors
    }
  }, [cartItems]);

  // Состояние модального окна заявки
  const [leadModalOpen, setLeadModalOpen] = useState<boolean>(false);
  const [leadSource, setLeadSource] = useState<LeadSource>('contact');
  const [prefillItem, setPrefillItem] = useState<string | undefined>(undefined);
  const [prefillCalculation, setPrefillCalculation] = useState<string | undefined>(undefined);
  const [clearCartOnSuccess, setClearCartOnSuccess] = useState<boolean>(false);

  // Состояние модального окна с юридическими документами (152-ФЗ, Оферта, Cookie)
  const [legalDoc, setLegalDoc] = useState<'privacy' | 'consent' | 'offer' | null>(null);

  const navigateTo = useCallback((route: AppRoute, sectionId?: string) => {
    setCurrentRoute(route);
    if (window.location.pathname !== route) {
      window.history.pushState({}, '', route);
    }
    applyClientSeoMeta(route);

    if (sectionId) {
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 60);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
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

  // Обработчики Сборной заявки (Корзины-сметы)
  const handleAddToCart = useCallback((newItem: EstimateCartItem) => {
    setCartItems((prev) => {
      const existingIdx = prev.findIndex((i) => i.id === newItem.id);
      if (existingIdx >= 0) {
        const updated = [...prev];
        updated[existingIdx] = {
          ...updated[existingIdx],
          quantity: newItem.quantity,
          unitPrice: newItem.unitPrice,
        };
        return updated;
      }
      return [...prev, newItem];
    });
  }, []);

  const handleUpdateCartQuantity = useCallback((id: string, quantity: number) => {
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  }, []);

  const handleRemoveCartItem = useCallback((id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const handleClearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  const handleOpenLeadModal = (
    source: LeadSource,
    selectedItem?: string,
    calculationSummary?: string,
    shouldClearCart = false
  ) => {
    setLeadSource(source);
    setPrefillItem(selectedItem);
    setPrefillCalculation(calculationSummary);
    setClearCartOnSuccess(shouldClearCart);
    setLeadModalOpen(true);
  };

  // Передача всей набранной Сметы в стандартную форму обратной связи
  const handleOpenEstimateCheckout = () => {
    if (cartItems.length === 0) return;
    const totalSum = cartItems.reduce(
      (acc, item) => acc + Math.round(item.unitPrice * item.quantity),
      0
    );
    const lines = cartItems.map(
      (item, idx) =>
        `${idx + 1}) ${item.title}: ${item.quantity} ${item.unit} × ${item.unitPrice.toLocaleString(
          'ru-RU'
        )} ₽ = ${Math.round(item.unitPrice * item.quantity).toLocaleString('ru-RU')} ₽`
    );
    const summaryText = `Сборная смета (${cartItems.length} поз.): ${lines.join(
      '; '
    )}. Итого ориентировочно: ~${totalSum.toLocaleString('ru-RU')} ₽`;

    handleOpenLeadModal(
      'catalog',
      `Сборная заявка (${cartItems.length} поз. на ~${totalSum.toLocaleString('ru-RU')} ₽)`,
      summaryText,
      true
    );
  };

  const activeSeoMeta = SEO_ROUTES[currentRoute] || SEO_ROUTES['/'];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Header
        settings={settings}
        currentRoute={currentRoute}
        cartCount={cartItems.length}
        onNavigate={navigateTo}
        onOpenLeadModal={(src, item) => handleOpenLeadModal(src, item)}
        onOpenEstimateCheckout={handleOpenEstimateCheckout}
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
          {/* МАРШРУТ 1: ГЛАВНАЯ СТРАНИЦА (Единый каталог: Бетон + Растворы + ФБС + Спецтехника, Калькулятор, Прайс, Доставка) */}
          {currentRoute === '/' && (
            <>
              <Hero
                settings={settings}
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
                    equipment={equipment}
                    settings={settings}
                    cartItems={cartItems}
                    onAddToCart={handleAddToCart}
                    onOrderProduct={(itemTitle) => handleOpenLeadModal('catalog', itemTitle)}
                    onNavigate={navigateTo}
                  />

                  <CalculatorSection
                    products={products}
                    equipment={equipment}
                    settings={settings}
                    onAddToCart={handleAddToCart}
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

          {/* МАРШРУТ 2: ОТДЕЛЬНАЯ SEO-СТРАНИЦА АРЕНДЫ СПЕЦТЕХНИКИ В УЛЬЯНОВСКЕ (/spectehnika) */}
          {currentRoute === '/spectehnika' && (
            <>
              <section className="bg-white bg-industrial-grid border-b border-slate-200 py-10">
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
                      Главная (Бетон, Растворы, ФБС)
                    </a>
                    <span aria-hidden="true">/</span>
                    <span className="text-slate-900 font-medium">{activeSeoMeta.label}</span>
                  </nav>
                  <h1 className="heading-hero text-slate-900">{activeSeoMeta.h1}</h1>
                  <p className="text-sm text-slate-600 mt-3 max-w-2xl leading-relaxed">
                    {activeSeoMeta.subtitle}
                  </p>
                </div>
              </section>

              <EquipmentSection
                equipment={equipment}
                cartItems={cartItems}
                onAddToCart={handleAddToCart}
                onOrderEquipment={(eqTitle) => handleOpenLeadModal('equipment', eqTitle)}
              />

              <QualityAndDeliverySection
                settings={settings}
                onOpenLeadModal={(src, item) => handleOpenLeadModal(src, item)}
              />
            </>
          )}

          {/* Сквозная секция обратной связи внизу страницы */}
          <section id="contact" className="py-16 bg-slate-100">
            <div className="max-w-[1200px] mx-auto px-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                <div className="lg:col-span-5 space-y-4">
                  <h2 className="heading-section text-slate-900">
                    Заявка на расчет и подачу с РБУ в Ульяновске
                  </h2>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Оставьте номер телефона — диспетчер перезвонит вам, поможет подобрать марку
                    бетона, раствор, блоки ФБС или спецтехнику, проверит подъездные пути на вашем
                    объекте в Ульяновске и забронирует время подачи (по городу{' '}
                    {settings.cityDeliveryTime}).
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

      {/* Плавающая панель Сборной заявки (Корзины-сметы) */}
      {currentRoute !== '/admin' && (
        <EstimateCartBar
          items={cartItems}
          onUpdateQuantity={handleUpdateCartQuantity}
          onRemoveItem={handleRemoveCartItem}
          onClearCart={handleClearCart}
          onSubmitEstimate={handleOpenEstimateCheckout}
        />
      )}

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
              onSuccess={() => {
                if (clearCartOnSuccess) {
                  setCartItems([]);
                }
                setLeadModalOpen(false);
              }}
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
