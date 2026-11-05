import React, { useState } from 'react';
import type { EstimateCartItem } from '../types';

interface EstimateCartBarProps {
  items: EstimateCartItem[];
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
  onSubmitEstimate: () => void;
}

export const EstimateCartBar: React.FC<EstimateCartBarProps> = ({
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onSubmitEstimate,
}) => {
  const [expanded, setExpanded] = useState<boolean>(false);

  if (items.length === 0) return null;

  const totalAmount = items.reduce(
    (acc, item) => acc + Math.round(item.unitPrice * item.quantity),
    0
  );

  return (
    <div className="fixed bottom-4 left-4 right-4 z-40 max-w-[960px] mx-auto">
      {/* Раскрывающийся список позиций сметы */}
      {expanded && (
        <div className="mb-2 bg-white border border-slate-300 rounded-xl shadow-2xl p-5 text-slate-900">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200">
            <div>
              <h3 className="text-base font-bold text-slate-900 font-display">
                Сборная заявка (Смета заказа)
              </h3>
              <p className="text-xs text-slate-500">
                Все выбранные позиции будут отправлены диспетчеру в одной общей форме обратной связи
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClearCart}
                className="text-xs text-red-600 hover:underline cursor-pointer"
              >
                Очистить смету
              </button>
              <button
                type="button"
                onClick={() => setExpanded(false)}
                className="px-2.5 py-1 text-xs font-semibold bg-slate-100 text-slate-700 rounded hover:bg-slate-200 cursor-pointer"
              >
                Свернуть
              </button>
            </div>
          </div>

          <div className="max-h-60 overflow-y-auto divide-y divide-slate-200">
            {items.map((item) => {
              const rowSum = Math.round(item.unitPrice * item.quantity);
              return (
                <div
                  key={item.id}
                  className="py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs"
                >
                  <div className="min-w-[200px] flex-1">
                    <div className="font-bold text-slate-900 text-sm">{item.title}</div>
                    <div className="text-slate-500">
                      {item.categoryLabel} · {item.unitPrice.toLocaleString('ru-RU')} ₽/{item.unit}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        onUpdateQuantity(item.id, Math.max(1, Number((item.quantity - 1).toFixed(1))))
                      }
                      className="w-7 h-7 rounded bg-slate-100 hover:bg-slate-200 font-bold text-slate-800 cursor-pointer"
                    >
                      −
                    </button>
                    <input
                      type="number"
                      min="0.5"
                      step="0.5"
                      value={item.quantity}
                      onChange={(e) =>
                        onUpdateQuantity(item.id, Math.max(0.5, Number(e.target.value)))
                      }
                      className="w-16 px-2 py-1 text-center font-bold font-num border border-slate-300 rounded"
                    />
                    <span className="text-slate-500 w-7">{item.unit}</span>
                    <button
                      type="button"
                      onClick={() =>
                        onUpdateQuantity(item.id, Number((item.quantity + 1).toFixed(1)))
                      }
                      className="w-7 h-7 rounded bg-slate-100 hover:bg-slate-200 font-bold text-slate-800 cursor-pointer"
                    >
                      +
                    </button>
                  </div>

                  <div className="w-28 text-right font-bold text-slate-900 font-num text-sm">
                    {rowSum.toLocaleString('ru-RU')} ₽
                  </div>

                  <button
                    type="button"
                    onClick={() => onRemoveItem(item.id)}
                    className="text-slate-400 hover:text-red-600 px-1 cursor-pointer"
                    title="Удалить из сметы"
                  >
                    ✕
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Компактная нижняя панель сметы */}
      <div className="bg-slate-900 text-white border border-slate-700 rounded-xl px-5 py-3.5 shadow-2xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="text-left group cursor-pointer"
          >
            <div className="text-xs text-orange-400 font-semibold flex items-center gap-1.5">
              <span>Сборная заявка (корзина-смета): {items.length} поз.</span>
              <span className="underline text-slate-300 group-hover:text-white">
                {expanded ? 'Скрыть состав ▲' : 'Посмотреть / изменить ▼'}
              </span>
            </div>
            <div className="text-sm sm:text-base font-bold font-num mt-0.5">
              Ориентировочная сумма: ~{totalAmount.toLocaleString('ru-RU')} ₽
            </div>
          </button>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="px-3.5 py-2 text-xs font-semibold text-slate-200 bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            {expanded ? 'Свернуть' : `Состав (${items.length})`}
          </button>
          <button
            type="button"
            onClick={onSubmitEstimate}
            className="px-5 py-2.5 text-xs font-semibold text-white bg-orange-600 rounded-lg hover:bg-orange-700 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Оформить заявку по смете →
          </button>
        </div>
      </div>
    </div>
  );
};
