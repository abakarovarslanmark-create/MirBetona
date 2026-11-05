import React from 'react';
import type { SiteSettings } from '../types';

interface QualityAndDeliverySectionProps {
  settings: SiteSettings;
  onOpenLeadModal: (source: 'contact', prefillItem?: string) => void;
}

export const QualityAndDeliverySection: React.FC<QualityAndDeliverySectionProps> = ({
  settings,
  onOpenLeadModal,
}) => {
  return (
    <section id="quality" className="py-14 border-b border-slate-200">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="mb-10">
          <h2 className="heading-section text-slate-900">
            04. Стандарты РБУ, честный куб и логистика
          </h2>
          <p className="text-sm text-slate-600 mt-2.5 max-w-2xl leading-relaxed">
            В отличие от сайтов-диспетчеров и посредников, мы отвечаем за каждый кубометр своим
            оборудованием, лабораторией и собственным автопарком спецтехники в Ульяновске.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Карточка 1: Честный объем и ГОСТ 7473-2010 -> ГОСТ 7473-2026 */}
          <div className="bg-white border border-slate-200 hover:border-slate-400 rounded-xl p-6 card-interactive">
            <div className="text-xs font-num text-orange-600 font-semibold mb-2">
              01 / ТОЧНЫЙ ВЕС ОТГРУЗКИ
            </div>
            <h3 className="heading-card text-slate-900 mb-2.5">
              «Честный куб» без недолива и ГОСТ 7473-2026
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed mb-3">
              Автоматизированная система взвешивания на тензодатчиках отгружает смесь с точностью до
              ±1%. Вы получаете ровно тот объем, который заказали, по{' '}
              <strong className="text-slate-900">ГОСТ 7473-2010</strong> и новому межгосударственному
              стандарту{' '}
              <strong className="text-slate-900">
                ГОСТ 7473-2026 «Смеси бетонные. Технические условия»
              </strong>{' '}
              (с 1 ноября 2026 года).
            </p>
            <p className="text-xs text-slate-500">
              Исключаем подмену марки и разбавление смеси водой в пути — каждый миксер проходит
              весовой контроль на выезде с завода.
            </p>
          </div>

          {/* Карточка 2: Внутренняя лаборатория и документы по требованию */}
          <div className="bg-white border border-slate-200 hover:border-slate-400 rounded-xl p-6 card-interactive">
            <div className="text-xs font-num text-orange-600 font-semibold mb-2">
              02 / ЛАБОРАТОРНЫЙ КОНТРОЛЬ
            </div>
            <h3 className="heading-card text-slate-900 mb-2.5">
              Проверка сырья и документы по требованию
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed mb-3">
              {settings.labDescription}. Используем только сертифицированный портландцемент М500 Д0,
              мытый сеяный песок без глинистых включений и калиброванный гравийный или гранитный
              щебень фр. 5–20 мм.
            </p>
            <p className="text-xs font-medium text-slate-800 bg-slate-100 border border-slate-200 rounded-lg p-3">
              {settings.certificatesNote}. Работаем как с частными застройщиками (оплата по факту
              прибытия миксера), так и с юрлицами по безналичному расчету (ЭДО).
            </p>
          </div>

          {/* Карточка 3: Производительность 60 м3/час и география по Ульяновску */}
          <div className="bg-white border border-slate-200 hover:border-slate-400 rounded-xl p-6 card-interactive">
            <div className="text-xs font-num text-orange-600 font-semibold mb-2">
              03 / БЕСПЕРЕБОЙНАЯ ПОДАЧА
            </div>
            <h3 className="heading-card text-slate-900 mb-2.5">
              Доставка за {settings.cityDeliveryTime} · Заливка {settings.plantCapacityM3PerHour} м³/ч
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Производительность узла{' '}
              <strong className="font-num text-slate-900">
                {settings.plantCapacityM3PerHour} м³/час
              </strong>{' '}
              позволяет заливать монолитные плиты и фундаменты непрерывно («миксер за миксером») без
              образования холодных швов. Оперативно доставляем бетон во все районы Ульяновска
              (Ленинский, Засвияжский, Железнодорожный, Заволжский) и по области (Чердаклы,
              Ишеевка, Баратаевка, Мирзинка, Новоульяновск, Луговое).
            </p>
          </div>

          {/* Карточка 4: Комплексная подача со спецтехникой */}
          <div className="bg-white border border-slate-200 hover:border-slate-400 rounded-xl p-6 flex flex-col justify-between card-interactive">
            <div>
              <div className="text-xs font-num text-orange-600 font-semibold mb-2">
                04 / СИНХРОНИЗАЦИЯ АВТОПАРКА
              </div>
              <h3 className="heading-card text-slate-900 mb-2.5">
                Своя спецтехника — подача без простоев
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                Когда вы заказываете бетон в одном месте, а бетононасос у частника — вы рискуете
                оплачивать простой техники из-за несогласованности. У нас собственный АБН (16–42 м),
                автокран 25 т, автовышка-манипулятор и экскаватор JCB: один диспетчер синхронизирует
                выход спецтехники и миксеров минута в минуту.
              </p>
            </div>
            <div>
              <button
                type="button"
                onClick={() =>
                  onOpenLeadModal('contact', 'Комплексный заказ: бетон + спецтехника (Ульяновск)')
                }
                className="text-xs font-semibold text-orange-600 hover:text-orange-700 hover:underline cursor-pointer"
              >
                Согласовать подачу бетона и спецтехники →
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
