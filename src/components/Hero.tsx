import React from 'react';
import type { SiteSettings } from '../types';
import type { AppRoute } from '../seo';

interface HeroProps {
  settings: SiteSettings;
  onNavigate: (route: AppRoute) => void;
  onOpenLeadModal: (source: 'contact', prefillItem?: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ settings, onNavigate, onOpenLeadModal }) => {
  return (
    <section className="border-b border-slate-200 bg-white">
      <div className="max-w-[1200px] mx-auto px-6 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
          {/* Левая колонка: оффер и действия */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 mb-3">
                Бетонный завод в Ульяновске (РБУ {settings.plantCapacityM3PerHour} м³/ч) · Свой автопарк спецтехники
              </p>
              <h1
                className="font-display font-bold text-slate-900 tracking-tight mb-5"
                style={{
                  fontSize: 'clamp(2.25rem, 4vw, 3.5rem)',
                  lineHeight: 1.1,
                  textWrap: 'balance',
                }}
              >
                Бетон и растворы в Ульяновске напрямую с завода — честный куб и подача за {settings.cityDeliveryTime}
              </h1>
              <p className="text-base text-slate-600 leading-relaxed max-w-2xl mb-8">
                Производим и доставляем товарный бетон М100–М400 и растворы по Правобережью,
                Заволжью и Ульяновской области без наценок диспетчеров-посредников. Мощность РБУ{' '}
                <strong className="font-semibold text-slate-900 font-num">
                  {settings.plantCapacityM3PerHour} м³/час
                </strong>{' '}
                исключает «холодные швы» при заливке плит. Тензометрический контроль веса гарантирует
                точный объем каждой партии по ГОСТ, а собственный парк спецтехники (АБН, кран,
                манипулятор, JCB) закрывает задачи объекта в одно окно.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href="/calculator"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate('/calculator');
                }}
                className="px-6 py-3 text-sm font-semibold text-white bg-orange-600 rounded-lg hover:bg-orange-700 transition-colors whitespace-nowrap shrink-0"
              >
                Рассчитать стоимость с доставкой
              </a>
              <button
                type="button"
                onClick={() => onOpenLeadModal('contact', 'Заявка с первого экрана')}
                className="px-6 py-3 text-sm font-semibold text-slate-800 bg-slate-100 border border-slate-300 rounded-lg hover:bg-slate-200 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                Заказать звонок диспетчера РБУ
              </button>
            </div>
          </div>

          {/* Правая колонка: Серый блок-заглушка через CSS (по правилам работы с изображениями) */}
          <div className="lg:col-span-5 flex">
            <div className="w-full min-h-[280px] lg:h-full bg-slate-200 border border-slate-300 rounded-xl p-6 flex flex-col justify-between text-slate-600">
              <div className="flex items-center justify-between text-xs text-slate-500 border-b border-slate-300 pb-3">
                <span>Фото РБУ / Автопарка завода (г. Ульяновск)</span>
                <span className="font-num">16:9 · Заглушка изображения</span>
              </div>
              <div className="my-auto py-6 text-center">
                <img
                  src=""
                  alt="Панорамное фото бетонного завода в Ульяновске, миксеров и спецтехники (добавьте путь к файлу в проект)"
                  className="hidden"
                />
                <p className="text-sm font-medium text-slate-700 mb-1">
                  Место под реальное фото бетонного узла или спецтехники
                </p>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Серый блок-заглушка через CSS. Будет заменен на ваше изображение из репозитория.
                </p>
              </div>
              <div className="text-xs text-slate-600 border-t border-slate-300 pt-3 flex items-center justify-between">
                <span>Диспетчерская РБУ (Ульяновск):</span>
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

        {/* Полоса ключевых производственных показателей (в полной ширине под сплитом) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12 pt-8 border-t border-slate-200">
          <div>
            <div className="text-2xl font-bold text-slate-900 font-num">
              {settings.plantCapacityM3PerHour} м³/час · Без недолива
            </div>
            <div className="text-xs text-slate-600 mt-1">
              Автоматическое тензометрическое дозирование с точностью отгрузки до ±1%
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900 font-num">
              {settings.cityDeliveryTime}
            </div>
            <div className="text-xs text-slate-600 mt-1">
              Подача миксера по Правобережью, Заволжью и пригороду Ульяновска
            </div>
          </div>
          <div>
            <div className="text-lg font-bold text-slate-900 font-num">
              ГОСТ 7473-2010 / 2026
            </div>
            <div className="text-xs text-slate-600 mt-1">
              Лабораторный контроль марочной прочности, паспорта качества по требованию
            </div>
          </div>
          <div>
            <div className="text-lg font-bold text-slate-900">
              Свой парк: миксеры + 4 спецмашины
            </div>
            <div className="text-xs text-slate-600 mt-1">
              Синхронная подача с АБН, автокраном, вышкой-манипулятором и JCB без простоев
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
