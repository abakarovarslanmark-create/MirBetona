import React from 'react';
import type { SiteSettings } from '../types';
import { RbuPlant3D } from './Isometric3DVisuals';

interface HeroProps {
  settings: SiteSettings;
  onOpenLeadModal: (source: 'contact', prefillItem?: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ settings, onOpenLeadModal }) => {
  return (
    <section className="border-b border-slate-200 bg-white bg-industrial-grid">
      <div className="max-w-[1200px] mx-auto px-6 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
          {/* Левая колонка: оффер под Ульяновск */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 mb-3">
                Бетонный завод в Ульяновске · Бетон · Растворы · Блоки ФБС · Аренда спецтехники
              </p>
              <h1 className="heading-hero text-slate-900 mb-5">
                Бетон и растворы с доставкой в Ульяновске напрямую с РБУ
              </h1>
              <p className="text-base text-slate-600 leading-relaxed max-w-2xl mb-8">
                Производим товарный бетон М100–М400, кладочные растворы и фундаментные блоки ФБС на
                автоматизированном узле мощностью{' '}
                <strong className="font-semibold text-slate-900 font-num">
                  {settings.plantCapacityM3PerHour} м³/час
                </strong>
                . Подача миксера по Ульяновску за{' '}
                <strong className="font-semibold text-slate-900">
                  {settings.cityDeliveryTime}
                </strong>
                . Собственный парк спецтехники: экскаватор-погрузчик JCB, автовышка + манипулятор,
                автокран 25 т и АБН.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href="#catalog"
                className="px-6 py-3.5 text-sm font-semibold text-white bg-orange-600 rounded-lg hover:bg-orange-700 transition-colors whitespace-nowrap shrink-0"
              >
                Перейти в каталог и собрать смету
              </a>
              <a
                href="#calculator"
                className="px-6 py-3.5 text-sm font-semibold text-slate-800 bg-slate-100 border border-slate-300 rounded-lg hover:bg-slate-200 transition-colors whitespace-nowrap shrink-0"
              >
                Калькулятор с доставкой
              </a>
              <button
                type="button"
                onClick={() => onOpenLeadModal('contact', 'Заявка с первого экрана')}
                className="px-5 py-3.5 text-sm font-semibold text-slate-700 hover:text-slate-900 underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                Быстрый заказ по телефону
              </button>
            </div>
          </div>

          {/* Правая колонка: Серый блок-заглушка с интерактивной 3D-аксонометрией РБУ и пустым src="" */}
          <div className="lg:col-span-5 flex">
            <div className="w-full min-h-[300px] lg:h-full bg-slate-100 border border-slate-300 rounded-xl p-5 flex flex-col justify-between text-slate-600">
              <div className="flex items-center justify-between text-xs text-slate-500 border-b border-slate-200 pb-2.5">
                <span>Инженерная 3D-схема РБУ · г. Ульяновск</span>
                <span className="font-num">ГОСТ 7473-2026</span>
              </div>

              <div className="my-auto py-2">
                <img
                  src=""
                  alt="Фото бетонно-растворного узла и автопарка спецтехники в Ульяновске"
                  className="hidden"
                />
                <RbuPlant3D capacity={settings.plantCapacityM3PerHour} />
              </div>

              <div className="text-xs text-slate-600 border-t border-slate-200 pt-2.5 flex items-center justify-between">
                <span>Прямой телефон диспетчерской РБУ:</span>
                <a
                  href={`tel:${settings.phone.replace(/[^\d+]/g, '')}`}
                  className="font-bold text-slate-900 font-num hover:underline"
                >
                  {settings.phone}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Полоса ключевых производственных показателей */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12 pt-8 border-t border-slate-200">
          <div>
            <div className="text-2xl font-bold text-slate-900 font-num">
              {settings.plantCapacityM3PerHour} м³/час
            </div>
            <div className="text-xs text-slate-600 mt-1">
              Производительность бетонно-растворного узла без простоев
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900 font-num">
              {settings.cityDeliveryTime}
            </div>
            <div className="text-xs text-slate-600 mt-1">
              Подача миксера и спецтехники в любой район Ульяновска
            </div>
          </div>
          <div>
            <div className="text-lg font-bold text-slate-900 font-num">
              ГОСТ 7473-2010 / 2026
            </div>
            <div className="text-xs text-slate-600 mt-1">
              Собственная лаборатория · Сертификаты по требованию
            </div>
          </div>
          <div>
            <div className="text-lg font-bold text-slate-900">
              Сборная заявка (Смета)
            </div>
            <div className="text-xs text-slate-600 mt-1">
              Закажите бетон + блоки ФБС + раствор + технику в одной форме
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
