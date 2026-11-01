import React, { useState, useEffect } from 'react';
import type { ProductItem, SiteSettings } from '../types';
import type { AppRoute } from '../seo';

interface CatalogSectionProps {
  products: ProductItem[];
  settings: SiteSettings;
  fixedCategory?: 'all' | 'concrete' | 'mortar';
  sectionTitle?: string;
  sectionSubtitle?: string;
  onOrderProduct: (itemTitle: string) => void;
  onNavigate?: (route: AppRoute) => void;
}

export const CatalogSection: React.FC<CatalogSectionProps> = ({
  products,
  settings,
  fixedCategory,
  sectionTitle = '01. Товарный бетон М100–М400 и растворы от производителя в Ульяновске',
  sectionSubtitle = 'Прямая отгрузка с РБУ (60 м³/ч) без посредников. Выберите заполнитель (гравийный или гранитный щебень) под проектную нагрузку — гарантируем точный объем и марочную прочность по ГОСТ.',
  onOrderProduct,
  onNavigate,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'concrete' | 'mortar'>(
    fixedCategory || 'all'
  );
  const [fillerType, setFillerType] = useState<'gravel' | 'granite'>('gravel');

  useEffect(() => {
    if (fixedCategory) {
      setActiveTab(fixedCategory);
    }
  }, [fixedCategory]);

  const filteredProducts = products.filter((item) => {
    if (!item.inStock) return false;
    if (activeTab === 'all') return true;
    return item.category === activeTab;
  });

  return (
    <section id="catalog" className="py-12 border-b border-slate-200">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 font-display tracking-tight">
              {sectionTitle}
            </h2>
            <p className="text-sm text-slate-600 mt-2 max-w-2xl">{sectionSubtitle}</p>
          </div>

          {/* Интерактивные переключатели категорий и наполнителя */}
          <div className="flex flex-wrap items-center gap-3">
            {!fixedCategory && (
              <div className="flex items-center gap-1 p-1 bg-slate-200/80 rounded-lg">
                <button
                  type="button"
                  onClick={() => setActiveTab('all')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    activeTab === 'all'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Все смеси ({products.filter((p) => p.inStock).length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('concrete')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    activeTab === 'concrete'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Бетон различных марок
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('mortar')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    activeTab === 'mortar'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Строительные растворы
                </button>
              </div>
            )}

            {activeTab !== 'mortar' && (
              <div className="flex items-center gap-1 p-1 bg-slate-200/80 rounded-lg">
                <button
                  type="button"
                  onClick={() => setFillerType('gravel')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    fillerType === 'gravel'
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  На гравии
                </button>
                <button
                  type="button"
                  onClick={() => setFillerType('granite')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    fillerType === 'granite'
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  На граните
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Сетка карточек */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((item) => {
            const isConcrete = item.category === 'concrete';
            const activePrice =
              isConcrete && fillerType === 'granite' && item.priceGranite
                ? item.priceGranite
                : item.priceGravel;
            const fillerLabel = isConcrete
              ? fillerType === 'granite' && item.priceGranite
                ? 'Гранитный щебень'
                : 'Гравийный щебень'
              : 'Цементно-песчаный';

            return (
              <article
                key={item.id}
                className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between"
              >
                <div>
                  {/* Изображение или серый блок-заглушка через CSS */}
                  <div className="w-full h-36 bg-slate-100 border border-slate-200 rounded-lg mb-4 overflow-hidden flex flex-col items-center justify-center text-center p-3">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <>
                        <img src="" alt={`Изображение ${item.name}`} className="hidden" />
                        <span className="text-xs font-medium text-slate-600">
                          Заглушка фото: {item.name}
                        </span>
                        <span className="text-[11px] text-slate-400 mt-0.5">
                          src=&quot;&quot; (добавляется через админку или из проекта)
                        </span>
                      </>
                    )}
                  </div>

                  {/* Заголовок и тихие текстовые метаданные */}
                  <div className="flex items-baseline justify-between gap-2 mb-1">
                    <h3 className="text-lg font-bold text-slate-900 font-display">{item.name}</h3>
                    {item.strengthClass && (
                      <span className="text-xs text-slate-500 font-num">
                        Класс {item.strengthClass}
                      </span>
                    )}
                  </div>

                  <div className="text-xs text-slate-500 mb-3">
                    <span>{isConcrete ? 'Товарный бетон' : 'Строительный раствор'}</span>
                    <span aria-hidden="true"> · </span>
                    <span>{fillerLabel}</span>
                    {settings.showTechnicalSpecsPFW && item.mobility && (
                      <>
                        <span aria-hidden="true"> · </span>
                        <span className="font-num">{item.mobility}</span>
                      </>
                    )}
                    {settings.showTechnicalSpecsPFW && item.frostResistance && (
                      <>
                        <span aria-hidden="true"> · </span>
                        <span className="font-num">{item.frostResistance}</span>
                      </>
                    )}
                    {settings.showTechnicalSpecsPFW && item.waterResistance && (
                      <>
                        <span aria-hidden="true"> · </span>
                        <span className="font-num">{item.waterResistance}</span>
                      </>
                    )}
                  </div>

                  <p className="text-xs text-slate-700 mb-2">
                    <strong className="font-semibold text-slate-900">Состав: </strong>
                    {item.composition}
                  </p>
                  <p className="text-xs text-slate-600 leading-relaxed mb-5">{item.usage}</p>
                </div>

                <div className="pt-4 border-t border-slate-200 flex items-center justify-between gap-4">
                  <div>
                    <div className="text-[11px] text-slate-500">Цена за 1 {item.unit}</div>
                    <div className="text-xl font-bold text-slate-900 font-num">
                      от {activePrice.toLocaleString('ru-RU')} ₽
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      onOrderProduct(
                        `${item.name} (${fillerLabel}) — от ${activePrice.toLocaleString('ru-RU')} ₽/${item.unit}`
                      )
                    }
                    className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    Заказать смесь
                  </button>
                </div>
              </article>
            );
          })}
        </div>

        {/* Быстрые внутренние ссылки на отдельные SEO-страницы (если мы на Главной) */}
        {!fixedCategory && onNavigate && (
          <div className="mt-6 pt-5 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4 text-xs">
            <span className="text-slate-500">
              Перейти в специализированные разделы каталога:
            </span>
            <div className="flex flex-wrap items-center gap-4 font-semibold">
              <a
                href="/beton"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate('/beton');
                }}
                className="text-orange-600 hover:underline"
              >
                Страница «Товарный бетон М100–М400» →
              </a>
              <a
                href="/rastvory"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate('/rastvory');
                }}
                className="text-orange-600 hover:underline"
              >
                Страница «Строительные растворы» →
              </a>
            </div>
          </div>
        )}

        <p className="text-xs text-slate-500 mt-4">
          * Указанные цены носят информационный характер и не являются публичной офертой (ст. 437 ГК
          РФ). Итоговая стоимость зависит от объема партии, рецептуры и километража доставки.
        </p>
      </div>
    </section>
  );
};
