import React from 'react';
import type { EquipmentItem } from '../types';

interface EquipmentSectionProps {
  equipment: EquipmentItem[];
  onOrderEquipment: (equipmentTitle: string) => void;
}

export const EquipmentSection: React.FC<EquipmentSectionProps> = ({
  equipment,
  onOrderEquipment,
}) => {
  const availableEquipment = equipment.filter((e) => e.available);

  return (
    <section id="equipment" className="py-14 border-b border-slate-200 bg-white">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 font-display tracking-tight">
            02. Собственный автопарк спецтехники в Ульяновске — подача без посредников
          </h2>
          <p className="text-sm text-slate-600 mt-2 max-w-2xl">
            Аренда автобетононасоса (АБН), автокрана 25 т, автовышки-манипулятора и экскаватора JCB
            напрямую с базы завода. Синхронизируем работу спецтехники с графиком прихода миксеров.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {availableEquipment.map((item) => (
            <article
              key={item.id}
              className="bg-slate-50 border border-slate-200 rounded-xl p-6 flex flex-col justify-between"
            >
              <div>
                {/* Изображение или серый блок-заглушка через CSS */}
                <div className="w-full h-44 bg-slate-200 border border-slate-300 rounded-lg mb-5 overflow-hidden flex flex-col items-center justify-center text-center p-4">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <>
                      <img src="" alt={`Фото спецтехники: ${item.name}`} className="hidden" />
                      <span className="text-xs font-medium text-slate-700">
                        Заглушка фото спецтехники: {item.name}
                      </span>
                      <span className="text-[11px] text-slate-500 mt-1">
                        Серый блок-заглушка через CSS (src=&quot;&quot;)
                      </span>
                    </>
                  )}
                </div>

                <div className="flex items-baseline justify-between gap-4 mb-2">
                  <h3 className="text-xl font-bold text-slate-900 font-display">{item.name}</h3>
                  <span className="text-xs text-slate-500 font-num whitespace-nowrap shrink-0">
                    Мин. заказ: от {item.minHours} ч
                  </span>
                </div>

                <p className="text-sm text-slate-600 leading-relaxed mb-6">{item.specs}</p>
              </div>

              <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-6">
                  <div>
                    <div className="text-[11px] text-slate-500">Почасовая ставка</div>
                    <div className="text-lg font-bold text-slate-900 font-num">
                      от {item.pricePerHour.toLocaleString('ru-RU')} ₽/час
                    </div>
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-500">Смена</div>
                    <div className="text-lg font-bold text-slate-900 font-num">
                      от {item.pricePerShift.toLocaleString('ru-RU')} ₽/смена
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    onOrderEquipment(
                      `Аренда: ${item.name} (от ${item.pricePerHour.toLocaleString('ru-RU')} ₽/ч)`
                    )
                  }
                  className="px-4 py-2.5 text-xs font-semibold text-white bg-orange-600 rounded-lg hover:bg-orange-700 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  Арендовать технику
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
