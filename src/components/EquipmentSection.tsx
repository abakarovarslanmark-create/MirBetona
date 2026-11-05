import React, { useState } from 'react';
import type { EquipmentItem, EstimateCartItem } from '../types';
import { Equipment3D } from './Isometric3DVisuals';

interface EquipmentSectionProps {
  equipment: EquipmentItem[];
  cartItems: EstimateCartItem[];
  onAddToCart: (item: EstimateCartItem) => void;
  onOrderEquipment: (equipmentTitle: string) => void;
}

export const EquipmentSection: React.FC<EquipmentSectionProps> = ({
  equipment,
  cartItems,
  onAddToCart,
  onOrderEquipment,
}) => {
  const [hoursMap, setHoursMap] = useState<Record<string, number>>({});
  const availableEquipment = equipment.filter((e) => e.available);

  const getHours = (id: string, minH: number) => hoursMap[id] ?? minH;
  const setHours = (id: string, minH: number, val: number) =>
    setHoursMap((prev) => ({ ...prev, [id]: Math.max(minH, val) }));

  return (
    <section id="equipment" className="py-14 border-b border-slate-200 bg-white">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="mb-10">
          <h2 className="heading-section text-slate-900">
            Автопарк спецтехники в Ульяновске: Экскаватор-погрузчик JCB, Автовышка, Манипулятор,
            Автокран 25 т и АБН
          </h2>
          <p className="text-sm text-slate-600 mt-2.5 max-w-2xl leading-relaxed">
            Предоставляем спецтехнику как отдельно для земляных, погрузочных и высотных работ по
            Ульяновску, так и в комплексе с подачей бетона и монтажом блоков ФБС.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {availableEquipment.map((item) => {
            const cartId = `eq-${item.id}`;
            const currentHours = getHours(item.id, item.minHours);
            const inCart = cartItems.find((c) => c.id === cartId);

            return (
              <article
                key={item.id}
                className="bg-slate-50 border border-slate-200 hover:border-slate-400 rounded-xl p-6 flex flex-col justify-between card-interactive"
              >
                <div>
                  <div className="w-full h-44 bg-slate-200/80 border border-slate-300 rounded-lg mb-5 overflow-hidden flex items-center justify-center">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <>
                        <img src="" alt={`Фото спецтехники: ${item.name}`} className="hidden" />
                        <Equipment3D type={item.type} name={item.name} />
                      </>
                    )}
                  </div>

                  <div className="flex items-baseline justify-between gap-4 mb-2">
                    <h3 className="heading-card text-slate-900">{item.name}</h3>
                    <span className="text-xs text-slate-500 font-num whitespace-nowrap shrink-0">
                      Мин. смена: от {item.minHours} ч
                    </span>
                  </div>

                  <p className="text-sm text-slate-600 leading-relaxed mb-6">{item.specs}</p>
                </div>

                <div className="pt-4 border-t border-slate-200 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-6">
                      <div>
                        <div className="text-[11px] text-slate-500">Почасовая ставка</div>
                        <div className="text-lg font-bold text-slate-900 font-num">
                          от {item.pricePerHour.toLocaleString('ru-RU')} ₽/ч
                        </div>
                      </div>
                      <div>
                        <div className="text-[11px] text-slate-500">Полная смена</div>
                        <div className="text-lg font-bold text-slate-900 font-num">
                          от {item.pricePerShift.toLocaleString('ru-RU')} ₽/смена
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 bg-white border border-slate-300 rounded-lg px-2 py-1">
                      <button
                        type="button"
                        onClick={() => setHours(item.id, item.minHours, currentHours - 1)}
                        className="w-6 h-6 text-xs font-bold text-slate-700 hover:bg-slate-100 rounded cursor-pointer"
                      >
                        −
                      </button>
                      <input
                        type="number"
                        min={item.minHours}
                        value={currentHours}
                        onChange={(e) =>
                          setHours(item.id, item.minHours, Number(e.target.value))
                        }
                        className="w-10 text-center text-xs font-bold font-num bg-transparent focus:outline-none"
                      />
                      <span className="text-[11px] text-slate-500">ч</span>
                      <button
                        type="button"
                        onClick={() => setHours(item.id, item.minHours, currentHours + 1)}
                        className="w-6 h-6 text-xs font-bold text-slate-700 hover:bg-slate-100 rounded cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={() =>
                        onAddToCart({
                          id: cartId,
                          title: `Аренда: ${item.name}`,
                          categoryLabel: 'Спецтехника с экипажем',
                          unit: 'ч',
                          quantity: currentHours,
                          unitPrice: item.pricePerHour,
                        })
                      }
                      className={`py-2.5 px-4 text-xs font-semibold rounded-lg border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                        inCart
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                          : 'bg-white text-slate-900 border-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      {inCart ? `✓ В смете (${inCart.quantity} ч)` : '+ В общую смету'}
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        onOrderEquipment(
                          `Аренда: ${item.name} × ${currentHours} ч (от ${(
                            item.pricePerHour * currentHours
                          ).toLocaleString('ru-RU')} ₽)`
                        )
                      }
                      className="py-2.5 px-4 text-xs font-semibold text-white bg-orange-600 rounded-lg hover:bg-orange-700 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      Заказать спецтехнику
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};
