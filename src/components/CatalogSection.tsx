import React, { useState } from 'react';
import type { ProductItem, EquipmentItem, SiteSettings, EstimateCartItem } from '../types';
import type { AppRoute } from '../seo';
import { ConcreteCube3D, Equipment3D } from './Isometric3DVisuals';

interface CatalogSectionProps {
  products: ProductItem[];
  equipment: EquipmentItem[];
  settings: SiteSettings;
  cartItems: EstimateCartItem[];
  onAddToCart: (item: EstimateCartItem) => void;
  onOrderProduct: (itemTitle: string) => void;
  onNavigate?: (route: AppRoute) => void;
}

type UnifiedCatalogTab = 'all' | 'concrete' | 'mortar' | 'fbs' | 'equipment';

export const CatalogSection: React.FC<CatalogSectionProps> = ({
  products,
  equipment,
  settings,
  cartItems,
  onAddToCart,
  onOrderProduct,
  onNavigate,
}) => {
  const [activeTab, setActiveTab] = useState<UnifiedCatalogTab>('all');
  const [fillerType, setFillerType] = useState<'gravel' | 'granite'>('gravel');
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const activeProducts = products.filter((item) => item.inStock);
  const availableEquipment = equipment.filter((eq) => eq.available);

  const visibleProducts = activeProducts.filter((item) => {
    if (activeTab === 'equipment') return false;
    if (activeTab === 'all') return true;
    return item.category === activeTab;
  });

  const showEquipmentInCatalog = activeTab === 'all' || activeTab === 'equipment';

  const getQty = (id: string, defaultQty: number) => quantities[id] ?? defaultQty;
  const setQty = (id: string, val: number) =>
    setQuantities((prev) => ({ ...prev, [id]: Math.max(1, val) }));

  return (
    <section id="catalog" className="py-14 border-b border-slate-200">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
          <div>
            <h2 className="heading-section text-slate-900">
              01. Единый каталог: бетон, растворы, блоки ФБС и спецтехника
            </h2>
            <p className="text-sm text-slate-600 mt-2.5 max-w-2xl leading-relaxed">
              Все позиции завода на одной странице без лишних переходов. Вы можете заказать любую
              позицию в 1 клик или собрать комплексную смету (например: бетон + ФБС + раствор +
              кран/АБН) и отправить одной общей заявкой.
            </p>
          </div>

          {/* Переключатель щебня (гравий / гранит) для бетона */}
          {(activeTab === 'all' || activeTab === 'concrete') && (
            <div className="flex items-center gap-1 p-1 bg-slate-200/80 rounded-lg shrink-0">
              <button
                type="button"
                onClick={() => setFillerType('gravel')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  fillerType === 'gravel'
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Бетон на гравии
              </button>
              <button
                type="button"
                onClick={() => setFillerType('granite')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  fillerType === 'granite'
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Бетон на граните
              </button>
            </div>
          )}
        </div>

        {/* Вкладки единого каталога */}
        <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-slate-200/80 rounded-xl mb-8 w-fit">
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'all'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Все позиции ({activeProducts.length + availableEquipment.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('concrete')}
            className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'concrete'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Товарный бетон М100–М400 (
            {activeProducts.filter((p) => p.category === 'concrete').length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('mortar')}
            className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'mortar'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Растворы ({activeProducts.filter((p) => p.category === 'mortar').length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('fbs')}
            className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'fbs'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Блоки ФБС ({activeProducts.filter((p) => p.category === 'fbs').length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('equipment')}
            className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'equipment'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Аренда спецтехники ({availableEquipment.length})
          </button>
        </div>

        {/* Сетка карточек: Бетон, Растворы, ФБС */}
        {visibleProducts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleProducts.map((item) => {
              const isConcrete = item.category === 'concrete';
              const isFbs = item.category === 'fbs';
              const activePrice =
                isConcrete && fillerType === 'granite' && item.priceGranite
                  ? item.priceGranite
                  : item.priceGravel;

              const fillerLabel = isConcrete
                ? fillerType === 'granite' && item.priceGranite
                  ? 'Гранитный щебень'
                  : 'Гравийный щебень'
                : isFbs
                  ? 'ЖБИ ГОСТ 13579-2018'
                  : 'Цементно-песчаный';

              const categoryLabel = isConcrete
                ? 'Товарный бетон'
                : isFbs
                  ? 'Фундаментные блоки ФБС'
                  : 'Строительный раствор';

              const cartId = isConcrete ? `${item.id}-${fillerType}` : item.id;
              const defaultQty = isFbs ? 10 : 6;
              const currentQty = getQty(cartId, defaultQty);
              const inCart = cartItems.find((c) => c.id === cartId);

              return (
                <article
                  key={item.id}
                  className="bg-white border border-slate-200 hover:border-slate-400 rounded-xl p-5 flex flex-col justify-between card-interactive"
                >
                  <div>
                    <div className="w-full h-36 bg-slate-100 border border-slate-200 rounded-lg mb-4 overflow-hidden flex items-center justify-center">
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <>
                          <img src="" alt={`Изображение ${item.name}`} className="hidden" />
                          <ConcreteCube3D
                            name={item.name}
                            strengthClass={item.strengthClass}
                            isConcrete={isConcrete || isFbs}
                            fillerType={fillerType}
                          />
                        </>
                      )}
                    </div>

                    <div className="flex items-baseline justify-between gap-2 mb-1.5">
                      <h3 className="heading-card text-slate-900">{item.name}</h3>
                      {item.strengthClass && (
                        <span className="text-xs text-slate-500 font-num shrink-0">
                          {item.strengthClass}
                        </span>
                      )}
                    </div>

                    <div className="text-xs text-slate-500 mb-3">
                      <span>{categoryLabel}</span>
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
                      <strong className="font-semibold text-slate-900">Характеристики: </strong>
                      {item.composition}
                    </p>
                    <p className="text-xs text-slate-600 leading-relaxed mb-4">{item.usage}</p>
                  </div>

                  <div className="pt-4 border-t border-slate-200 space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <div className="text-[11px] text-slate-500">Цена за 1 {item.unit}</div>
                        <div className="text-xl font-bold text-slate-900 font-num">
                          {activePrice.toLocaleString('ru-RU')} ₽
                        </div>
                      </div>

                      {/* Выбор количества прямо на карточке */}
                      <div className="flex items-center gap-1 bg-slate-100 border border-slate-200 rounded-lg px-2 py-1">
                        <button
                          type="button"
                          onClick={() => setQty(cartId, currentQty - 1)}
                          className="w-6 h-6 text-xs font-bold text-slate-700 hover:bg-white rounded cursor-pointer"
                        >
                          −
                        </button>
                        <input
                          type="number"
                          min="1"
                          value={currentQty}
                          onChange={(e) => setQty(cartId, Number(e.target.value))}
                          className="w-12 text-center text-xs font-bold font-num bg-transparent focus:outline-none"
                        />
                        <span className="text-[11px] text-slate-500">{item.unit}</span>
                        <button
                          type="button"
                          onClick={() => setQty(cartId, currentQty + 1)}
                          className="w-6 h-6 text-xs font-bold text-slate-700 hover:bg-white rounded cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          onAddToCart({
                            id: cartId,
                            title: isConcrete ? `${item.name} (${fillerLabel})` : item.name,
                            categoryLabel,
                            unit: item.unit,
                            quantity: currentQty,
                            unitPrice: activePrice,
                          })
                        }
                        className={`py-2 px-3 text-xs font-semibold rounded-lg border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                          inCart
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                            : 'bg-slate-100 text-slate-900 border-slate-300 hover:bg-slate-200'
                        }`}
                      >
                        {inCart ? `✓ В смете (${inCart.quantity} ${item.unit})` : '+ В смету'}
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          onOrderProduct(
                            `${item.name} (${fillerLabel}) × ${currentQty} ${item.unit} — ~${(
                              activePrice * currentQty
                            ).toLocaleString('ru-RU')} ₽`
                          )
                        }
                        className="py-2 px-3 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-orange-600 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                      >
                        Заказать сразу
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* Карточки спецтехники прямо внутри единого каталога (при выборе таба «Все позиции» или «Аренда спецтехники») */}
        {showEquipmentInCatalog && availableEquipment.length > 0 && (
          <div className={visibleProducts.length > 0 ? 'mt-10 pt-8 border-t border-slate-200' : ''}>
            <div className="flex flex-wrap items-baseline justify-between gap-4 mb-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900 font-display">
                  Аренда спецтехники в Ульяновске (Экскаватор-погрузчик JCB, Автовышка, Манипулятор,
                  Автокран 25 т, АБН)
                </h3>
                <p className="text-xs text-slate-600 mt-1">
                  Добавьте нужную спецтехнику в общую смету к бетону или закажите аренду отдельно.
                </p>
              </div>
              {onNavigate && (
                <a
                  href="/spectehnika"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('/spectehnika');
                  }}
                  className="text-xs font-semibold text-orange-600 hover:underline whitespace-nowrap"
                >
                  Открыть отдельную страницу спецтехники →
                </a>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {availableEquipment.map((eq) => {
                const cartId = `eq-${eq.id}`;
                const currentHours = Math.max(eq.minHours, getQty(cartId, eq.minHours));
                const inCart = cartItems.find((c) => c.id === cartId);

                return (
                  <article
                    key={eq.id}
                    className="bg-white border border-slate-200 hover:border-slate-400 rounded-xl p-5 flex flex-col justify-between card-interactive"
                  >
                    <div>
                      <div className="w-full h-40 bg-slate-100 border border-slate-200 rounded-lg mb-4 overflow-hidden flex items-center justify-center">
                        {eq.imageUrl ? (
                          <img
                            src={eq.imageUrl}
                            alt={eq.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <>
                            <img src="" alt={`Фото спецтехники: ${eq.name}`} className="hidden" />
                            <Equipment3D type={eq.type} name={eq.name} />
                          </>
                        )}
                      </div>

                      <div className="flex items-baseline justify-between gap-4 mb-2">
                        <h4 className="heading-card text-slate-900">{eq.name}</h4>
                        <span className="text-xs text-slate-500 font-num whitespace-nowrap shrink-0">
                          Мин. заказ: от {eq.minHours} ч
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed mb-4">{eq.specs}</p>
                    </div>

                    <div className="pt-4 border-t border-slate-200 space-y-3">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-5">
                          <div>
                            <div className="text-[11px] text-slate-500">Ставка в час</div>
                            <div className="text-lg font-bold text-slate-900 font-num">
                              {eq.pricePerHour.toLocaleString('ru-RU')} ₽/ч
                            </div>
                          </div>
                          <div>
                            <div className="text-[11px] text-slate-500">Смена (8 ч)</div>
                            <div className="text-sm font-bold text-slate-700 font-num">
                              {eq.pricePerShift.toLocaleString('ru-RU')} ₽
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 bg-slate-100 border border-slate-200 rounded-lg px-2 py-1">
                          <button
                            type="button"
                            onClick={() => setQty(cartId, Math.max(eq.minHours, currentHours - 1))}
                            className="w-6 h-6 text-xs font-bold text-slate-700 hover:bg-white rounded cursor-pointer"
                          >
                            −
                          </button>
                          <input
                            type="number"
                            min={eq.minHours}
                            value={currentHours}
                            onChange={(e) =>
                              setQty(cartId, Math.max(eq.minHours, Number(e.target.value)))
                            }
                            className="w-10 text-center text-xs font-bold font-num bg-transparent focus:outline-none"
                          />
                          <span className="text-[11px] text-slate-500">ч</span>
                          <button
                            type="button"
                            onClick={() => setQty(cartId, currentHours + 1)}
                            className="w-6 h-6 text-xs font-bold text-slate-700 hover:bg-white rounded cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            onAddToCart({
                              id: cartId,
                              title: `Аренда: ${eq.name}`,
                              categoryLabel: 'Спецтехника с экипажем',
                              unit: 'ч',
                              quantity: currentHours,
                              unitPrice: eq.pricePerHour,
                            })
                          }
                          className={`py-2 px-3 text-xs font-semibold rounded-lg border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                            inCart
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                              : 'bg-slate-100 text-slate-900 border-slate-300 hover:bg-slate-200'
                          }`}
                        >
                          {inCart ? `✓ В смете (${inCart.quantity} ч)` : '+ В смету'}
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            onOrderProduct(
                              `Аренда: ${eq.name} × ${currentHours} ч — ~${(
                                eq.pricePerHour * currentHours
                              ).toLocaleString('ru-RU')} ₽`
                            )
                          }
                          className="py-2 px-3 text-xs font-semibold text-white bg-orange-600 rounded-lg hover:bg-orange-700 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                        >
                          Заказать технику
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        )}

        <p className="text-xs text-slate-500 mt-6">
          * Указанные цены носят информационный характер и не являются публичной офертой (ст. 437 ГК
          РФ). Итоговая стоимость зависит от объема партии, рецептуры и километража доставки по
          Ульяновску и области.
        </p>
      </div>
    </section>
  );
};
