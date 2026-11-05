import React from 'react';
import type { ProductItem, SiteSettings } from '../types';

interface PriceTableSectionProps {
  products: ProductItem[];
  settings: SiteSettings;
  onOrderProduct: (itemTitle: string) => void;
}

export const PriceTableSection: React.FC<PriceTableSectionProps> = ({
  products,
  settings,
  onOrderProduct,
}) => {
  if (!settings.showPriceTable) {
    return null;
  }

  const activeProducts = products.filter((p) => p.inStock);

  return (
    <section id="pricelist" className="py-14 border-b border-slate-200 bg-white">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <h2 className="heading-section text-slate-900">
              Прайс-лист РБУ в Ульяновске (цены за 1 м³)
            </h2>
            <p className="text-xs text-slate-500 mt-1.5">
              Прямые заводские цены без наценок перекупщиков. Отображение таблицы регулируется в 1 клик через админ-панель.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto border border-slate-200 rounded-xl">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-200 text-xs font-semibold text-slate-700">
                <th className="py-3.5 px-4">Наименование марки</th>
                <th className="py-3.5 px-4">Класс</th>
                {settings.showTechnicalSpecsPFW && (
                  <th className="py-3.5 px-4">Характеристики</th>
                )}
                <th className="py-3.5 px-4 text-right">На гравии / песке</th>
                <th className="py-3.5 px-4 text-right">На граните</th>
                <th className="py-3.5 px-4 text-right">Заказ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {activeProducts.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 font-semibold text-slate-900">{item.name}</td>
                  <td className="py-3 px-4 text-slate-600 font-num">
                    {item.strengthClass || '—'}
                  </td>
                  {settings.showTechnicalSpecsPFW && (
                    <td className="py-3 px-4 text-xs text-slate-500 font-num">
                      {[item.mobility, item.frostResistance, item.waterResistance]
                        .filter(Boolean)
                        .join(' · ') || 'По ГОСТ'}
                    </td>
                  )}
                  <td className="py-3 px-4 text-right font-bold text-slate-900 font-num">
                    {item.priceGravel.toLocaleString('ru-RU')} ₽/{item.unit}
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-slate-900 font-num">
                    {item.priceGranite
                      ? `${item.priceGranite.toLocaleString('ru-RU')} ₽/${item.unit}`
                      : '—'}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      type="button"
                      onClick={() =>
                        onOrderProduct(
                          `${item.name} — от ${item.priceGravel.toLocaleString('ru-RU')} ₽/${item.unit}`
                        )
                      }
                      className="text-xs font-semibold text-orange-600 hover:text-orange-700 hover:underline cursor-pointer"
                    >
                      Оставить заявку
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
