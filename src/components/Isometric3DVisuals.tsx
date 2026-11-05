import React, { useState } from 'react';
import type { EquipmentType } from '../types';

/**
 * Интерактивная 3D-изометрическая схема бетонного завода (РБУ 60 м³/ч) для первого экрана (Hero).
 * Выполнена на базе аппаратно-ускоренной векторной аксонометрии: 0 КБ внешних библиотек,
 * мгновенная отрисовка (LCP < 0.1s), плавный 3D-параллакс при наведении курсора.
 */
export const RbuPlant3D: React.FC<{ capacity: number }> = ({ capacity }) => {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width - 0.5;
    const relY = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({
      x: Number((relY * -8).toFixed(2)),
      y: Number((relX * 10).toFixed(2)),
    });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full h-full flex items-center justify-center select-none overflow-hidden"
      style={{ perspective: '900px' }}
    >
      <div
        className="w-full h-full flex items-center justify-center transition-transform duration-200 ease-out"
        style={{
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          transformStyle: 'preserve-3d',
        }}
      >
        <svg
          viewBox="0 0 460 310"
          className="w-full h-auto max-h-[255px] drop-shadow-sm"
          role="img"
          aria-label="3D-аксонометрия бетонно-растворного узла и отгрузки в миксер"
        >
          <defs>
            <linearGradient id="isoTop" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#e2e8f0" />
            </linearGradient>
            <linearGradient id="isoLeft" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#cbd5e1" />
              <stop offset="100%" stopColor="#94a3b8" />
            </linearGradient>
            <linearGradient id="isoRight" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#64748b" />
              <stop offset="100%" stopColor="#334155" />
            </linearGradient>
            <linearGradient id="isoDarkRight" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1e293b" />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>
            <linearGradient id="isoOrange" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f97316" />
              <stop offset="100%" stopColor="#ea580c" />
            </linearGradient>
          </defs>

          {/* Изометрическая координатная плита основания */}
          <g opacity="0.85">
            <polygon
              points="230,288 430,192 230,104 30,192"
              fill="#e2e8f0"
              stroke="#94a3b8"
              strokeWidth="1.2"
            />
            <polygon
              points="230,296 430,200 430,192 230,288"
              fill="#64748b"
            />
            <polygon
              points="230,296 30,200 30,192 230,288"
              fill="#94a3b8"
            />
            {/* Осевые линии разметки площадки РБУ */}
            <line x1="130" y1="148" x2="330" y2="240" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="4 4" />
            <line x1="330" y1="148" x2="130" y2="240" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="4 4" />
          </g>

          {/* Бункеры инертных материалов (Щебень / Песок) слева сзади */}
          <g>
            {/* Левая грань бункера */}
            <polygon points="62,188 118,214 118,158 62,132" fill="url(#isoLeft)" stroke="#475569" strokeWidth="1" />
            {/* Правая грань бункера */}
            <polygon points="118,214 166,190 166,134 118,158" fill="url(#isoRight)" stroke="#334155" strokeWidth="1" />
            {/* Верхняя воронка */}
            <polygon points="114,108 166,134 118,158 62,132" fill="url(#isoTop)" stroke="#475569" strokeWidth="1.2" />
            {/* Внутренний отсек щебня */}
            <polygon points="114,114 156,134 118,152 74,132" fill="#475569" />
          </g>

          {/* Наклонный конвейер подачи взвешенных инертных в смеситель (анимированный поток) */}
          <g>
            <polygon points="134,162 236,94 246,100 144,168" fill="#334155" />
            <line
              x1="140"
              y1="163"
              x2="240"
              y2="97"
              stroke="#ea580c"
              strokeWidth="3"
              strokeDasharray="6 6"
              className="animate-iso-flow"
            />
          </g>

          {/* Силос цемента №1 (высокая 3D-колонна) */}
          <g className="animate-iso-float">
            {/* Левая половина цилиндра силоса */}
            <polygon points="168,162 198,176 198,54 168,40" fill="url(#isoLeft)" stroke="#475569" strokeWidth="1" />
            {/* Правая половина цилиндра силоса */}
            <polygon points="198,176 228,162 228,40 198,54" fill="url(#isoRight)" stroke="#334155" strokeWidth="1" />
            {/* Крышка силоса */}
            <polygon points="198,26 228,40 198,54 168,40" fill="url(#isoTop)" stroke="#475569" strokeWidth="1.2" />
            {/* Оранжевый технический пояс М500 Д0 */}
            <polygon points="168,72 198,86 228,72 228,82 198,96 168,82" fill="url(#isoOrange)" />
          </g>

          {/* Главный смесительный блок РБУ (Беторосмесительный узел + Тензодозатор) */}
          <g>
            {/* Опорные стальные колонны РБУ */}
            <line x1="224" y1="154" x2="224" y2="212" stroke="#1e293b" strokeWidth="4" />
            <line x1="268" y1="176" x2="268" y2="234" stroke="#0f172a" strokeWidth="4.5" />
            <line x1="312" y1="154" x2="312" y2="212" stroke="#1e293b" strokeWidth="4" />

            {/* Корпус смесительного узла: левая грань */}
            <polygon points="218,158 268,182 268,112 218,88" fill="url(#isoLeft)" stroke="#334155" strokeWidth="1.2" />
            {/* Корпус смесительного узла: правая темная грань */}
            <polygon points="268,182 320,156 320,86 268,112" fill="url(#isoDarkRight)" stroke="#0f172a" strokeWidth="1.2" />
            {/* Крыша РБУ */}
            <polygon points="268,64 320,86 268,112 218,88" fill="url(#isoTop)" stroke="#475569" strokeWidth="1.2" />

            {/* Оранжевый модуль тензометрического контроля «Честный куб ±1%» */}
            <polygon points="276,122 312,104 312,132 276,150" fill="url(#isoOrange)" />

            {/* Выгрузная воронка бетоносмесителя */}
            <polygon points="254,176 282,176 274,198 262,198" fill="#ea580c" />
          </g>

          {/* 3D-Автобетоносмеситель (Миксер) на точке загрузки */}
          <g>
            {/* Шасси миксера */}
            <polygon points="250,224 342,266 364,254 272,212" fill="#1e293b" />
            {/* Барабан (груша) миксера в 3D-изометрии */}
            <polygon
              points="254,202 308,226 324,206 272,182"
              fill="url(#isoTop)"
              stroke="#334155"
              strokeWidth="1.2"
            />
            <polygon
              points="254,202 308,226 302,242 252,218"
              fill="url(#isoLeft)"
              stroke="#334155"
              strokeWidth="1.2"
            />
            {/* Оранжевая спиральная полоса на барабане миксера */}
            <polygon points="276,192 292,200 282,232 268,225" fill="url(#isoOrange)" />

            {/* Кабина тягача */}
            <polygon points="318,236 346,250 346,222 324,212" fill="url(#isoLeft)" stroke="#334155" strokeWidth="1.2" />
            <polygon points="346,250 368,238 368,212 346,222" fill="url(#isoDarkRight)" stroke="#0f172a" strokeWidth="1.2" />
            <polygon points="344,202 368,212 346,222 324,212" fill="url(#isoTop)" stroke="#334155" strokeWidth="1.2" />

            {/* Колеса 3D */}
            <circle cx="272" cy="236" r="8" fill="#0f172a" stroke="#cbd5e1" strokeWidth="2" />
            <circle cx="296" cy="247" r="8" fill="#0f172a" stroke="#cbd5e1" strokeWidth="2" />
            <circle cx="338" cy="252" r="8" fill="#0f172a" stroke="#cbd5e1" strokeWidth="2" />
          </g>

          {/* Выносные инженерные метки (в стиле чертежей sigirgroup / iar-ru) */}
          <g className="font-num" fontSize="10" fontWeight="600" fill="#0f172a">
            <line x1="294" y1="76" x2="342" y2="46" stroke="#0f172a" strokeWidth="1" />
            <rect x="342" y="32" width="102" height="22" rx="3" fill="#0f172a" />
            <text x="350" y="47" fill="#ffffff">
              РБУ {capacity} М³/ЧАС
            </text>

            <line x1="114" y1="108" x2="78" y2="76" stroke="#475569" strokeWidth="1" />
            <rect x="18" y="58" width="112" height="20" rx="3" fill="#ffffff" stroke="#cbd5e1" />
            <text x="26" y="72" fill="#0f172a">
              ТЕНЗОКОНТРОЛЬ ±1%
            </text>
          </g>
        </svg>
      </div>
    </div>
  );
};

/**
 * 3D-аксонометрический куб бетонной или растворной смеси для карточек каталога.
 * Наглядно показывает класс прочности (В7.5–В30), структуру заполнителя (гравий / гранит / песок)
 * и вектор марочной нагрузки.
 */
export const ConcreteCube3D: React.FC<{
  name: string;
  strengthClass?: string;
  isConcrete: boolean;
  fillerType: 'gravel' | 'granite';
}> = ({ name, strengthClass, isConcrete, fillerType }) => {
  const shortMark = name.match(/М\d+/)?.[0] || 'ГОСТ';
  const isGranite = isConcrete && fillerType === 'granite';

  return (
    <div className="relative w-full h-full flex items-center justify-between px-4 py-2 select-none group">
      {/* Левая техническая колонка параметров 3D-образца */}
      <div className="text-left z-10 space-y-1">
        <div className="text-[10px] font-num uppercase tracking-wider text-slate-500">
          {isConcrete ? 'Образец 150×150×150 мм' : 'Проба раствора ГОСТ'}
        </div>
        <div className="text-lg font-bold text-slate-900 font-display leading-none">
          {shortMark}
        </div>
        <div className="text-[11px] font-num text-slate-600">
          {strengthClass ? `Класс ${strengthClass}` : 'Контроль РБУ'}
        </div>
        <div className="text-[10px] font-medium text-orange-600 pt-0.5">
          {isConcrete
            ? isGranite
              ? 'Фракция: Гранит 5–20'
              : 'Фракция: Гравий 5–20'
            : 'Мытый песок фр. 2.2'}
        </div>
      </div>

      {/* Правая часть: 3D-изометрический куб с разрезом структуры */}
      <svg
        viewBox="0 0 160 130"
        className="w-32 h-28 shrink-0 transition-transform duration-300 group-hover:scale-105"
        role="img"
        aria-label={`3D-модель кубической прочности ${name}`}
      >
        {/* Тень под кубом */}
        <polygon points="85,122 142,96 85,72 28,96" fill="#cbd5e1" opacity="0.55" />

        {/* Стрелка вектора испытания прессом сверху */}
        <line x1="85" y1="6" x2="85" y2="24" stroke="#ea580c" strokeWidth="2" />
        <polygon points="81,21 89,21 85,28" fill="#ea580c" />

        {/* Верхняя грань куба */}
        <polygon
          points="85,28 135,52 85,76 35,52"
          fill="#f8fafc"
          stroke="#334155"
          strokeWidth="1.5"
        />

        {/* Левая грань куба */}
        <polygon
          points="35,52 85,76 85,116 35,92"
          fill="#cbd5e1"
          stroke="#334155"
          strokeWidth="1.5"
        />

        {/* Правая грань куба (с 3D-разрезом заполнителя) */}
        <polygon
          points="85,76 135,52 135,92 85,116"
          fill={isGranite ? '#1e293b' : isConcrete ? '#334155' : '#475569'}
          stroke="#0f172a"
          strokeWidth="1.5"
        />

        {/* Текстура крупного заполнителя (щебня) или песка на правой грани */}
        {isConcrete ? (
          <g fill={isGranite ? '#fb923c' : '#94a3b8'} opacity="0.85">
            <polygon points="94,80 104,75 102,85 92,88" />
            <polygon points="112,70 124,65 121,76 110,79" />
            <polygon points="96,96 108,90 106,101 95,104" />
            <polygon points="115,86 127,80 125,91 114,94" />
          </g>
        ) : (
          <g fill="#cbd5e1" opacity="0.7">
            <circle cx="98" cy="82" r="2" />
            <circle cx="110" cy="76" r="1.8" />
            <circle cx="122" cy="70" r="2" />
            <circle cx="102" cy="95" r="1.8" />
            <circle cx="116" cy="88" r="2.2" />
            <circle cx="125" cy="82" r="1.6" />
          </g>
        )}

        {/* Диагональная размерная засечка на верхней грани */}
        <line x1="60" y1="40" x2="110" y2="64" stroke="#94a3b8" strokeWidth="1" strokeDasharray="2 2" />
      </svg>
    </div>
  );
};

/**
 * 3D-изометрические технические иллюстрации 4 видов спецтехники завода
 * (АБН, Автокран 25 т, Автовышка + Манипулятор, Экскаватор-погрузчик JCB).
 */
export const Equipment3D: React.FC<{ type: EquipmentType; name: string }> = ({ type }) => {
  return (
    <div className="relative w-full h-full flex items-center justify-between px-5 py-3 select-none group">
      <div className="z-10 space-y-1 text-left max-w-[45%]">
        <span className="text-[10px] font-num uppercase tracking-wider text-orange-600 font-semibold block">
          3D-схема спецтехники
        </span>
        <span className="text-xs font-semibold text-slate-800 block leading-snug">
          {type === 'abn' && 'Подача смеси стрелой 16–42 м в труднодоступную опалубку'}
          {type === 'crane' && 'Грузоподъемность 25 тонн · Вылет стрелы до 28 метров'}
          {type === 'aerial_manipulator' && 'Бортовой КМУ + высотная монтажная люлька 2-в-1'}
          {type === 'excavator_jcb' && 'Фронтальный челюстной ковш + обратная лопата'}
        </span>
        <span className="text-[11px] text-slate-500 font-num block">
          Собственный автопарк РБУ
        </span>
      </div>

      <svg
        viewBox="0 0 220 140"
        className="w-48 h-32 shrink-0 transition-transform duration-300 group-hover:translate-x-1"
        role="img"
        aria-label="3D-чертеж строительной спецтехники"
      >
        {/* Изометрическая площадка под спецтехникой */}
        <polygon
          points="110,132 206,92 110,54 14,92"
          fill="#cbd5e1"
          opacity="0.5"
          stroke="#94a3b8"
          strokeWidth="1"
        />

        {/* Базовое 3D-шасси грузовика / трактора */}
        <polygon points="52,92 138,118 164,104 78,78" fill="#1e293b" />
        <polygon points="126,112 152,120 152,92 126,84" fill="#cbd5e1" stroke="#334155" strokeWidth="1.2" />
        <polygon points="152,120 174,108 174,82 152,92" fill="#334155" stroke="#0f172a" strokeWidth="1.2" />
        <polygon points="150,74 174,82 152,92 126,84" fill="#f8fafc" stroke="#334155" strokeWidth="1.2" />

        {/* Колеса */}
        <circle cx="74" cy="100" r="8" fill="#0f172a" stroke="#e2e8f0" Z="1" strokeWidth="2" />
        <circle cx="100" cy="108" r="8" fill="#0f172a" stroke="#e2e8f0" strokeWidth="2" />
        <circle cx="144" cy="116" r="8" fill="#0f172a" stroke="#e2e8f0" strokeWidth="2" />

        {/* Стрела в зависимости от типа спецтехники */}
        {type === 'abn' && (
          <g>
            {/* Z-образная распределительная стрела автобетононасоса + бетоновод */}
            <polyline
              points="78,86 48,34 118,18 184,54"
              fill="none"
              stroke="#ea580c"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <line
              x1="184"
              y1="54"
              x2="184"
              y2="84"
              stroke="#0f172a"
              strokeWidth="3"
              strokeDasharray="3 3"
              className="animate-iso-flow"
            />
          </g>
        )}

        {type === 'crane' && (
          <g>
            {/* Телескопическая стрела автокрана 25т + крюковая подвеска */}
            <polygon points="72,88 182,18 188,24 78,94" fill="#ea580c" stroke="#0f172a" strokeWidth="1" />
            <line x1="184" y1="22" x2="184" y2="68" stroke="#0f172a" strokeWidth="1.8" />
            <polygon points="172,68 196,68 196,82 172,82" fill="#475569" stroke="#0f172a" strokeWidth="1.2" />
          </g>
        )}

        {type === 'aerial_manipulator' && (
          <g>
            {/* Стрела КМУ с монтажной корзиной (люлькой) */}
            <polyline
              points="86,86 112,34 176,34"
              fill="none"
              stroke="#ea580c"
              strokeWidth="4.5"
              strokeLinecap="round"
            />
            <rect x="172" y="24" width="24" height="16" rx="2" fill="#f8fafc" stroke="#0f172a" strokeWidth="1.5" />
          </g>
        )}

        {type === 'excavator_jcb' && (
          <g>
            {/* Задняя экскаваторная стрела с ковшом */}
            <polyline
              points="64,88 34,46 20,76"
              fill="none"
              stroke="#ea580c"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <polygon points="14,74 28,74 24,88 10,84" fill="#0f172a" />
          </g>
        )}
      </svg>
    </div>
  );
};

/**
 * Динамическая 3D-аксонометрия заливаемой монолитной плиты для калькулятора.
 * Масштабируется в реальном времени при изменении кубатуры или габаритов.
 */
export const SlabVolume3D: React.FC<{
  volume: number;
  tripsCount: number;
  filler: 'gravel' | 'granite';
}> = ({ volume, tripsCount, filler }) => {
  // Вычисляем визуальную высоту 3D-плиты от объема (от 10 до 38 px)
  const thicknessPx = Math.min(38, Math.max(10, Math.round(8 + Math.sqrt(volume) * 2.4)));

  return (
    <div className="mt-4 p-4 rounded-xl bg-slate-800/90 border border-slate-700/80 flex items-center justify-between gap-4">
      <div className="space-y-1">
        <div className="text-[11px] font-num uppercase tracking-wider text-orange-400">
          3D-визуализация объема партии
        </div>
        <div className="text-sm font-bold text-white font-display">
          {volume} м³ · Рейсов миксера: {tripsCount}
        </div>
        <div className="text-xs text-slate-400">
          Заполнитель: {filler === 'granite' ? 'Гранитный щебень' : 'Гравийный / ЦПС'}
        </div>
      </div>

      <svg
        viewBox="0 0 150 96"
        className="w-32 h-20 shrink-0"
        role="img"
        aria-label="3D-модель рассчитываемого объема бетона"
      >
        {/* Верхняя плоскость монолитной плиты */}
        <polygon
          points={`75,${46 - thicknessPx} 135,${68 - thicknessPx} 75,${90 - thicknessPx} 15,${68 - thicknessPx}`}
          fill="#e2e8f0"
          stroke="#0f172a"
          strokeWidth="1.2"
        />
        {/* Левая боковая грань плиты */}
        <polygon
          points={`15,${68 - thicknessPx} 75,${90 - thicknessPx} 75,90 15,68`}
          fill="#94a3b8"
          stroke="#0f172a"
          strokeWidth="1.2"
        />
        {/* Правая боковая грань плиты */}
        <polygon
          points={`75,${90 - thicknessPx} 135,${68 - thicknessPx} 135,68 75,90`}
          fill="#ea580c"
          stroke="#0f172a"
          strokeWidth="1.2"
        />
      </svg>
    </div>
  );
};
