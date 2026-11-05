import React, { useState, useMemo } from 'react';
import type { ProductItem, EquipmentItem, SiteSettings, EstimateCartItem } from '../types';
import { SlabVolume3D } from './Isometric3DVisuals';

interface CalculatorSectionProps {
  products: ProductItem[];
  equipment: EquipmentItem[];
  settings: SiteSettings;
  onAddToCart: (item: EstimateCartItem) => void;
  onSubmitCalculation: (selectedTitle: string, summaryText: string) => void;
}

export const CalculatorSection: React.FC<CalculatorSectionProps> = ({
  products,
  equipment,
  settings,
  onAddToCart,
  onSubmitCalculation,
}) => {
  const activeProducts = useMemo(() => products.filter((p) => p.inStock), [products]);
  const [selectedProductId, setSelectedProductId] = useState<string>(
    activeProducts[4]?.id || activeProducts[0]?.id || ''
  );
  const [filler, setFiller] = useState<'gravel' | 'granite'>('gravel');
  const [volume, setVolume] = useState<number>(12);
  const [distanceKm, setDistanceKm] = useState<number>(10);
  const [selectedEquipmentId, setSelectedEquipmentId] = useState<string>('none');
  const [equipmentHours, setEquipmentHours] = useState<number>(4);
  const [addedNotice, setAddedNotice] = useState<boolean>(false);

  // Помощник расчета кубатуры по габаритам (Длина x Ширина x Высота)
  const [showDimensionHelper, setShowDimensionHelper] = useState<boolean>(false);
  const [dimLength, setDimLength] = useState<number>(10);
  const [dimWidth, setDimWidth] = useState<number>(8);
  const [dimHeight, setDimHeight] = useState<number>(0.2);

  const selectedProduct =
    activeProducts.find((p) => p.id === selectedProductId) || activeProducts[0];

  const selectedEquipment = equipment.find((e) => e.id === selectedEquipmentId);

  const unitPrice = useMemo(() => {
    if (!selectedProduct) return 0;
    if (
      selectedProduct.category === 'concrete' &&
      filler === 'granite' &&
      selectedProduct.priceGranite
    ) {
      return selectedProduct.priceGranite;
    }
    return selectedProduct.priceGravel;
  }, [selectedProduct, filler]);

  const isFbs = selectedProduct?.category === 'fbs';
  const materialTotal = Math.round(unitPrice * volume);
  const tripsCount = isFbs ? Math.max(1, Math.ceil(volume / 15)) : Math.max(1, Math.ceil(volume / 9));
  const singleTripDelivery = settings.deliveryBasePrice + distanceKm * settings.deliveryPricePerKm;
  const deliveryTotal = Math.round(singleTripDelivery * tripsCount);

  const equipmentTotal = useMemo(() => {
    if (!selectedEquipment) return 0;
    const hours = Math.max(selectedEquipment.minHours, equipmentHours);
    return hours * selectedEquipment.pricePerHour;
  }, [selectedEquipment, equipmentHours]);

  const grandTotal = materialTotal + deliveryTotal + equipmentTotal;

  const applyDimensionsVolume = () => {
    const calculated = Number((dimLength * dimWidth * dimHeight).toFixed(1));
    if (calculated > 0) {
      setVolume(calculated);
      setShowDimensionHelper(false);
    }
  };

  const handleTransferToLead = () => {
    if (!selectedProduct) return;
    const fillerText =
      selectedProduct.category === 'concrete'
        ? filler === 'granite'
          ? 'на граните'
          : 'на гравии'
        : isFbs
          ? 'ЖБИ ГОСТ 13579-2018'
          : 'цементно-песчаный';

    const eqText = selectedEquipment
      ? `, Спецтехника: ${selectedEquipment.name} (${Math.max(selectedEquipment.minHours, equipmentHours)} ч = ${equipmentTotal.toLocaleString('ru-RU')} ₽)`
      : '';

    const summary = `Позиция: ${selectedProduct.name} (${fillerText}) × ${volume} ${selectedProduct.unit} (${materialTotal.toLocaleString('ru-RU')} ₽) + Доставка ${distanceKm} км (${tripsCount} рейс., ${deliveryTotal.toLocaleString('ru-RU')} ₽)${eqText}. Итого ориентировочно: ${grandTotal.toLocaleString('ru-RU')} ₽`;

    onSubmitCalculation(`${selectedProduct.name} — ${volume} ${selectedProduct.unit}`, summary);
  };

  const handleAddCalculationToCart = () => {
    if (!selectedProduct) return;
    const fillerLabel =
      selectedProduct.category === 'concrete'
        ? filler === 'granite'
          ? 'Гранитный щебень'
          : 'Гравийный щебень'
        : isFbs
          ? 'ГОСТ 13579-2018'
          : 'Цементно-песчаный';

    onAddToCart({
      id: selectedProduct.category === 'concrete' ? `${selectedProduct.id}-${filler}` : selectedProduct.id,
      title:
        selectedProduct.category === 'concrete'
          ? `${selectedProduct.name} (${fillerLabel})`
          : selectedProduct.name,
      categoryLabel: 'Из калькулятора',
      unit: selectedProduct.unit,
      quantity: volume,
      unitPrice,
    });

    onAddToCart({
      id: `delivery-${distanceKm}km`,
      title: `Доставка (${distanceKm} км от РБУ)`,
      categoryLabel: 'Логистика завода',
      unit: 'рейс',
      quantity: tripsCount,
      unitPrice: singleTripDelivery,
    });

    if (selectedEquipment) {
      onAddToCart({
        id: `eq-${selectedEquipment.id}`,
        title: `Аренда: ${selectedEquipment.name}`,
        categoryLabel: 'Спецтехника с экипажем',
        unit: 'ч',
        quantity: Math.max(selectedEquipment.minHours, equipmentHours),
        unitPrice: selectedEquipment.pricePerHour,
      });
    }

    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2500);
  };

  return (
    <section id="calculator" className="py-14 border-b border-slate-200">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="mb-10">
          <h2 className="heading-section text-slate-900">
            02. Калькулятор бетона, растворов, ФБС и доставки
          </h2>
          <p className="text-sm text-slate-600 mt-2.5 max-w-2xl leading-relaxed">
            Рассчитайте смету с учетом кубатуры, плеча доставки по Ульяновску или области и смены
            спецтехники. Готовый расчет можно сразу отправить диспетчеру или добавить в общую
            сборную заявку.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Панель параметров расчета */}
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6 space-y-6">
            {/* 1. Выбор марки бетона, раствора или ФБС */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                1. Выберите бетон, раствор или блоки ФБС
              </label>
              <select
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-slate-900"
              >
                <optgroup label="Товарный бетон М100–М400">
                  {activeProducts
                    .filter((p) => p.category === 'concrete')
                    .map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.strengthClass}) — от {p.priceGravel.toLocaleString('ru-RU')} ₽/м³
                      </option>
                    ))}
                </optgroup>
                <optgroup label="Строительные растворы">
                  {activeProducts
                    .filter((p) => p.category === 'mortar')
                    .map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} — от {p.priceGravel.toLocaleString('ru-RU')} ₽/м³
                      </option>
                    ))}
                </optgroup>
                <optgroup label="Фундаментные блоки ФБС">
                  {activeProducts
                    .filter((p) => p.category === 'fbs')
                    .map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} — {p.priceGravel.toLocaleString('ru-RU')} ₽/шт.
                      </option>
                    ))}
                </optgroup>
              </select>
            </div>

            {/* 2. Выбор наполнителя (для бетона) */}
            {selectedProduct?.category === 'concrete' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  2. Вид крупного заполнителя (щебень)
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFiller('gravel')}
                    className={`py-2.5 px-4 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
                      filler === 'gravel'
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    Гравийный щебень ({selectedProduct.priceGravel.toLocaleString('ru-RU')} ₽/м³)
                  </button>
                  <button
                    type="button"
                    onClick={() => setFiller('granite')}
                    className={`py-2.5 px-4 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
                      filler === 'granite'
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    Гранитный щебень (
                    {(selectedProduct.priceGranite || selectedProduct.priceGravel).toLocaleString(
                      'ru-RU'
                    )}{' '}
                    ₽/м³)
                  </button>
                </div>
              </div>
            )}

            {/* 3. Объем смеси в кубах или количество блоков */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-slate-700">
                  3. Требуемое количество ({selectedProduct?.unit || 'м³'})
                </label>
                {!isFbs && (
                  <button
                    type="button"
                    onClick={() => setShowDimensionHelper(!showDimensionHelper)}
                    className="text-xs font-medium text-orange-600 hover:underline cursor-pointer"
                  >
                    {showDimensionHelper
                      ? 'Скрыть расчет по размерам плиты'
                      : 'Рассчитать объем по Длина × Ширина × Высота'}
                  </button>
                )}
              </div>

              {showDimensionHelper && !isFbs && (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg mb-3">
                  <div className="grid grid-cols-3 gap-3 mb-3">
                    <div>
                      <span className="block text-[11px] text-slate-500 mb-1">Длина (м)</span>
                      <input
                        type="number"
                        min="0.5"
                        step="0.5"
                        value={dimLength}
                        onChange={(e) => setDimLength(Math.max(0.1, Number(e.target.value)))}
                        className="w-full px-2.5 py-1.5 text-sm bg-white border border-slate-300 rounded font-num"
                      />
                    </div>
                    <div>
                      <span className="block text-[11px] text-slate-500 mb-1">Ширина (м)</span>
                      <input
                        type="number"
                        min="0.5"
                        step="0.5"
                        value={dimWidth}
                        onChange={(e) => setDimWidth(Math.max(0.1, Number(e.target.value)))}
                        className="w-full px-2.5 py-1.5 text-sm bg-white border border-slate-300 rounded font-num"
                      />
                    </div>
                    <div>
                      <span className="block text-[11px] text-slate-500 mb-1">Толщина (м)</span>
                      <input
                        type="number"
                        min="0.05"
                        step="0.05"
                        value={dimHeight}
                        onChange={(e) => setDimHeight(Math.max(0.05, Number(e.target.value)))}
                        className="w-full px-2.5 py-1.5 text-sm bg-white border border-slate-300 rounded font-num"
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-600">
                      Расчетный объем:{' '}
                      <strong className="font-num text-slate-900">
                        {(dimLength * dimWidth * dimHeight).toFixed(1)} м³
                      </strong>
                    </span>
                    <button
                      type="button"
                      onClick={applyDimensionsVolume}
                      className="px-3 py-1 text-xs font-semibold bg-slate-900 text-white rounded hover:bg-slate-800 cursor-pointer"
                    >
                      Подставить объем
                    </button>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="1"
                  max="120"
                  step="1"
                  value={volume}
                  onChange={(e) => setVolume(Number(e.target.value))}
                  className="w-full accent-orange-600 cursor-pointer"
                />
                <input
                  type="number"
                  min="1"
                  max="1000"
                  step={isFbs ? '1' : '0.5'}
                  value={volume}
                  onChange={(e) => setVolume(Math.max(1, Number(e.target.value)))}
                  className="w-24 px-3 py-2 text-sm font-bold text-right bg-slate-50 border border-slate-300 rounded-lg font-num"
                />
              </div>
            </div>

            {/* 4. Километраж доставки от РБУ */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-slate-700">
                  4. Расстояние доставки по Ульяновску / области (км)
                </label>
                <span className="text-xs font-bold text-slate-900 font-num">{distanceKm} км</span>
              </div>
              <input
                type="range"
                min="1"
                max="80"
                step="1"
                value={distanceKm}
                onChange={(e) => setDistanceKm(Number(e.target.value))}
                className="w-full accent-orange-600 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-400 mt-1 font-num">
                <span>По Ульяновску (до 15 км — подача 30–60 мин)</span>
                <span>Пригород и область (15–80 км)</span>
              </div>
            </div>

            {/* 5. Добавление аренды спецтехники к заказу */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                5. Нужна ли строительная спецтехника?
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <select
                  value={selectedEquipmentId}
                  onChange={(e) => setSelectedEquipmentId(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                >
                  <option value="none">Без спецтехники (только доставка)</option>
                  {equipment
                    .filter((e) => e.available)
                    .map((eq) => (
                      <option key={eq.id} value={eq.id}>
                        {eq.name} — {eq.pricePerHour.toLocaleString('ru-RU')} ₽/ч
                      </option>
                    ))}
                </select>

                {selectedEquipment && (
                  <div className="flex items-center justify-between bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2">
                    <span className="text-xs text-slate-600">Часов работы:</span>
                    <input
                      type="number"
                      min={selectedEquipment.minHours}
                      max="24"
                      value={equipmentHours}
                      onChange={(e) =>
                        setEquipmentHours(
                          Math.max(selectedEquipment.minHours, Number(e.target.value))
                        )
                      }
                      className="w-16 text-right text-sm font-bold text-slate-900 font-num bg-transparent focus:outline-none"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Правая колонка: Итоговая смета */}
          <div className="lg:col-span-5 bg-slate-900 text-white rounded-xl p-6 flex flex-col justify-between">
            <div>
              <div className="text-xs text-slate-400 mb-1">Предварительный расчет заказа</div>
              <h3 className="text-xl font-bold font-display mb-5">
                {selectedProduct?.name} · {volume} {selectedProduct?.unit}
              </h3>

              <div className="space-y-3 text-sm border-t border-slate-800 pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">
                    Цена за 1 {selectedProduct?.unit}:
                  </span>
                  <span className="font-semibold font-num">
                    {unitPrice.toLocaleString('ru-RU')} ₽
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">
                    Стоимость материала ({volume} {selectedProduct?.unit}):
                  </span>
                  <span className="font-semibold font-num">
                    {materialTotal.toLocaleString('ru-RU')} ₽
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">
                    Доставка ({distanceKm} км, рейсов: {tripsCount}):
                  </span>
                  <span className="font-semibold font-num">
                    {deliveryTotal.toLocaleString('ru-RU')} ₽
                  </span>
                </div>
                {selectedEquipment && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">
                      {selectedEquipment.name} (
                      {Math.max(selectedEquipment.minHours, equipmentHours)} ч):
                    </span>
                    <span className="font-semibold font-num">
                      {equipmentTotal.toLocaleString('ru-RU')} ₽
                    </span>
                  </div>
                )}
              </div>

              <div className="my-5 pt-5 border-t border-slate-800 flex items-baseline justify-between">
                <span className="text-sm text-slate-300">Ориентировочно итого:</span>
                <span className="text-3xl font-bold text-white font-num">
                  {grandTotal.toLocaleString('ru-RU')} ₽
                </span>
              </div>

              <SlabVolume3D
                volume={volume}
                tripsCount={tripsCount}
                filler={filler}
              />
            </div>

            <div className="mt-5 space-y-2.5">
              <button
                type="button"
                onClick={handleTransferToLead}
                className="w-full py-3.5 px-5 text-sm font-semibold text-white bg-orange-600 rounded-lg hover:bg-orange-700 transition-colors cursor-pointer"
              >
                Отправить этот расчет сразу
              </button>

              <button
                type="button"
                onClick={handleAddCalculationToCart}
                className="w-full py-2.5 px-5 text-xs font-semibold text-slate-200 bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700 transition-colors cursor-pointer"
              >
                {addedNotice
                  ? '✓ Расчет добавлен в вашу сборную смету'
                  : '+ Добавить этот расчет в сборную смету'}
              </button>

              <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                Расчет на калькуляторе является предварительным и не является публичной офертой (ст.
                437 ГК РФ).
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
