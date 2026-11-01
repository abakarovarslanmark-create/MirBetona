import React, { useState, useEffect } from 'react';
import type {
  ProductItem,
  EquipmentItem,
  LeadItem,
  SiteSettings,
  LeadStatus,
  EquipmentType,
} from '../types';

interface AdminPanelProps {
  onBackToSite: () => void;
  onDataUpdated: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onBackToSite, onDataUpdated }) => {
  const [password, setPassword] = useState<string>(() => {
    return sessionStorage.getItem('beton_admin_pwd') || '';
  });
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<'leads' | 'products' | 'equipment' | 'settings'>(
    'leads'
  );
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [equipment, setEquipment] = useState<EquipmentItem[]>([]);
  const [leads, setLeads] = useState<LeadItem[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const fetchAdminData = async (pwd: string) => {
    try {
      const res = await fetch('/api/admin/data', {
        headers: { 'x-admin-password': pwd },
      });
      if (!res.ok) {
        throw new Error('Неверный пароль администратора');
      }
      const data = await res.json();
      setProducts(data.products || []);
      setEquipment(data.equipment || []);
      setLeads(data.leads || []);
      setSettings(data.settings || null);
      setIsAuthenticated(true);
      sessionStorage.setItem('beton_admin_pwd', pwd);
      setAuthError(null);
    } catch (err: any) {
      setIsAuthenticated(false);
      setAuthError(err.message || 'Ошибка входа');
    }
  };

  useEffect(() => {
    if (password) {
      fetchAdminData(password);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetchAdminData(password);
  };

  const showToast = (msg: string) => {
    setStatusMessage(msg);
    setTimeout(() => setStatusMessage(null), 3000);
  };

  const handleSaveProducts = async () => {
    const res = await fetch('/api/admin/products', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-password': password,
      },
      body: JSON.stringify({ products }),
    });
    if (res.ok) {
      showToast('Каталог бетона и растворов успешно сохранен');
      onDataUpdated();
    }
  };

  const handleSaveEquipment = async () => {
    const res = await fetch('/api/admin/equipment', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-password': password,
      },
      body: JSON.stringify({ equipment }),
    });
    if (res.ok) {
      showToast('Парк спецтехники и тарифы сохранены');
      onDataUpdated();
    }
  };

  const handleSaveSettings = async () => {
    if (!settings) return;
    const res = await fetch('/api/admin/settings', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-password': password,
      },
      body: JSON.stringify({ settings }),
    });
    if (res.ok) {
      showToast('Настройки завода и видимость блоков обновлены');
      onDataUpdated();
    }
  };

  const handleUpdateLeadStatus = async (leadId: string, status: LeadStatus) => {
    const res = await fetch(`/api/admin/leads/${leadId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-password': password,
      },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      setLeads((prev) => prev.map((l) => (l.id === leadId ? { ...l, status } : l)));
      showToast('Статус заявки обновлен');
    }
  };

  const handleDeleteLead = async (leadId: string) => {
    const res = await fetch(`/api/admin/leads/${leadId}`, {
      method: 'DELETE',
      headers: { 'x-admin-password': password },
    });
    if (res.ok) {
      setLeads((prev) => prev.filter((l) => l.id !== leadId));
      showToast('Заявка удалена');
    }
  };

  const handleAddProduct = () => {
    const newProd: ProductItem = {
      id: `item-${Date.now()}`,
      category: 'concrete',
      name: 'Новая марка бетона / раствора',
      strengthClass: 'В15',
      composition: 'Щебень, портландцемент М500, песок мытый',
      mobility: 'П3',
      frostResistance: 'F150',
      waterResistance: 'W4',
      priceGravel: 4500,
      priceGranite: 5100,
      unit: 'м³',
      usage: 'Описание применения новой марки',
      imageUrl: '',
      inStock: true,
    };
    setProducts([newProd, ...products]);
  };

  const handleAddEquipment = () => {
    const newEq: EquipmentItem = {
      id: `eq-${Date.now()}`,
      type: 'abn',
      name: 'Новая единица спецтехники',
      specs: 'Описание технических характеристик техники',
      minHours: 4,
      pricePerHour: 2500,
      pricePerShift: 18000,
      imageUrl: '',
      available: true,
    };
    setEquipment([...equipment, newEq]);
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto my-20 bg-white border border-slate-200 rounded-xl p-6">
        <h2 className="text-xl font-bold text-slate-900 font-display mb-2">
          Вход во встроенную админ-панель
        </h2>
        <p className="text-xs text-slate-600 mb-5">
          Пароль по умолчанию для демонстрации: <code className="font-num font-bold">admin</code>{' '}
          (задается в переменной окружения <code className="font-num">ADMIN_PASSWORD</code> на
          хостинге).
        </p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Пароль администратора
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Введите пароль (admin)"
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg"
            />
          </div>

          {authError && <p className="text-xs text-red-600">{authError}</p>}

          <div className="flex items-center gap-3">
            <button
              type="submit"
              className="px-5 py-2.5 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 cursor-pointer"
            >
              Войти в панель
            </button>
            <button
              type="button"
              onClick={onBackToSite}
              className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
            >
              Вернуться на сайт
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-display">
            Панель управления сайтом бетонного завода
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Управление заявками, ценами на бетон и растворы, арендой спецтехники и спорными блоками
          </p>
        </div>

        <div className="flex items-center gap-3">
          {statusMessage && (
            <span className="text-xs font-semibold text-emerald-800 bg-emerald-100 px-3 py-1.5 rounded-lg">
              {statusMessage}
            </span>
          )}
          <button
            type="button"
            onClick={onBackToSite}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 cursor-pointer"
          >
            Перейти к просмотру сайта →
          </button>
        </div>
      </div>

      {/* Навигация по вкладкам админки */}
      <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-200/80 rounded-lg mb-8 w-fit">
        <button
          type="button"
          onClick={() => setActiveTab('leads')}
          className={`px-4 py-2 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
            activeTab === 'leads'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Заявки с сайта ({leads.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('products')}
          className={`px-4 py-2 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
            activeTab === 'products'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Бетон и растворы ({products.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('equipment')}
          className={`px-4 py-2 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
            activeTab === 'equipment'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Спецтехника ({equipment.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('settings')}
          className={`px-4 py-2 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
            activeTab === 'settings'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Настройки и опциональные блоки
        </button>
      </div>

      {/* ВКЛАДКА 1: ВХОДЯЩИЕ ЗАЯВКИ */}
      {activeTab === 'leads' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-900 font-display">
              Входящие заявки в базе данных
            </h2>
            <button
              type="button"
              onClick={() => fetchAdminData(password)}
              className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 cursor-pointer"
            >
              Обновить список
            </button>
          </div>

          {leads.length === 0 ? (
            <div className="py-12 text-center text-sm text-slate-500">
              Пока нет поступивших заявок. Отправьте тестовую заявку через калькулятор или форму на
              сайте.
            </div>
          ) : (
            <div className="space-y-4">
              {leads.map((lead) => (
                <div
                  key={lead.id}
                  className="border border-slate-200 rounded-lg p-4 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2 text-sm font-bold text-slate-900">
                      <span>{lead.clientName}</span>
                      <span>·</span>
                      <a href={`tel:${lead.phone}`} className="font-num text-orange-600 underline">
                        {lead.phone}
                      </a>
                      {lead.email && (
                        <>
                          <span>·</span>
                          <span className="text-xs font-normal text-slate-600">{lead.email}</span>
                        </>
                      )}
                      <span className="text-xs font-normal text-slate-400 font-num">
                        ({new Date(lead.createdAt).toLocaleString('ru-RU')})
                      </span>
                    </div>

                    {lead.selectedItem && (
                      <div className="text-xs text-slate-800">
                        <strong>Позиция:</strong> {lead.selectedItem}
                      </div>
                    )}
                    {lead.calculationSummary && (
                      <div className="text-xs text-slate-700 bg-slate-50 p-2 rounded border border-slate-200">
                        <strong>Расчет калькулятора:</strong> {lead.calculationSummary}
                      </div>
                    )}
                    {lead.comment && (
                      <div className="text-xs text-slate-600">
                        <strong>Комментарий:</strong> {lead.comment}
                      </div>
                    )}
                    <div className="text-[11px] text-slate-400">
                      Согласие 152-ФЗ: получено · Источник: {lead.source}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <select
                      value={lead.status}
                      onChange={(e) =>
                        handleUpdateLeadStatus(lead.id, e.target.value as LeadStatus)
                      }
                      className="px-3 py-1.5 text-xs font-semibold border border-slate-300 rounded-lg bg-slate-50"
                    >
                      <option value="new">Новая заявка</option>
                      <option value="in_progress">В работе</option>
                      <option value="completed">Выполнена</option>
                    </select>
                    <button
                      type="button"
                      onClick={() => handleDeleteLead(lead.id)}
                      className="px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
                    >
                      Удалить
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ВКЛАДКА 2: РЕДАКТИРОВАНИЕ БЕТОНА И РАСТВОРОВ */}
      {activeTab === 'products' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white border border-slate-200 rounded-xl p-4">
            <div className="text-xs text-slate-600">
              Измените цены или описание марок и нажмите «Сохранить изменения».
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleAddProduct}
                className="px-4 py-2 text-xs font-semibold text-slate-800 bg-slate-100 rounded-lg hover:bg-slate-200 cursor-pointer"
              >
                + Добавить марку
              </button>
              <button
                type="button"
                onClick={handleSaveProducts}
                className="px-5 py-2 text-xs font-semibold text-white bg-orange-600 rounded-lg hover:bg-orange-700 cursor-pointer"
              >
                Сохранить изменения
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {products.map((prod, idx) => (
              <div
                key={prod.id}
                className="bg-white border border-slate-200 rounded-xl p-5 grid grid-cols-1 md:grid-cols-12 gap-4"
              >
                <div className="md:col-span-3">
                  <label className="block text-[11px] text-slate-500 mb-1">Название марки</label>
                  <input
                    type="text"
                    value={prod.name}
                    onChange={(e) => {
                      const next = [...products];
                      next[idx] = { ...prod, name: e.target.value };
                      setProducts(next);
                    }}
                    className="w-full px-3 py-1.5 text-sm font-bold border border-slate-300 rounded"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-[11px] text-slate-500 mb-1">Категория</label>
                  <select
                    value={prod.category}
                    onChange={(e) => {
                      const next = [...products];
                      next[idx] = {
                        ...prod,
                        category: e.target.value as 'concrete' | 'mortar',
                      };
                      setProducts(next);
                    }}
                    className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded bg-white"
                  >
                    <option value="concrete">Бетон</option>
                    <option value="mortar">Раствор</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-[11px] text-slate-500 mb-1">
                    Цена (гравий/песок), ₽
                  </label>
                  <input
                    type="number"
                    value={prod.priceGravel}
                    onChange={(e) => {
                      const next = [...products];
                      next[idx] = { ...prod, priceGravel: Number(e.target.value) };
                      setProducts(next);
                    }}
                    className="w-full px-3 py-1.5 text-sm font-num border border-slate-300 rounded"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-[11px] text-slate-500 mb-1">
                    Цена (гранит), ₽
                  </label>
                  <input
                    type="number"
                    value={prod.priceGranite || ''}
                    placeholder="Только бетон"
                    onChange={(e) => {
                      const next = [...products];
                      next[idx] = {
                        ...prod,
                        priceGranite: e.target.value ? Number(e.target.value) : undefined,
                      };
                      setProducts(next);
                    }}
                    className="w-full px-3 py-1.5 text-sm font-num border border-slate-300 rounded"
                  />
                </div>

                <div className="md:col-span-3 flex items-end justify-between gap-2">
                  <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer mb-2">
                    <input
                      type="checkbox"
                      checked={prod.inStock}
                      onChange={(e) => {
                        const next = [...products];
                        next[idx] = { ...prod, inStock: e.target.checked };
                        setProducts(next);
                      }}
                    />
                    Показывать на сайте
                  </label>
                  <button
                    type="button"
                    onClick={() => setProducts(products.filter((_, i) => i !== idx))}
                    className="text-xs text-red-600 hover:underline mb-2 cursor-pointer"
                  >
                    Удалить
                  </button>
                </div>

                <div className="md:col-span-6">
                  <label className="block text-[11px] text-slate-500 mb-1">Состав смеси</label>
                  <input
                    type="text"
                    value={prod.composition}
                    onChange={(e) => {
                      const next = [...products];
                      next[idx] = { ...prod, composition: e.target.value };
                      setProducts(next);
                    }}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded"
                  />
                </div>

                <div className="md:col-span-6">
                  <label className="block text-[11px] text-slate-500 mb-1">
                    Применение / описание
                  </label>
                  <input
                    type="text"
                    value={prod.usage}
                    onChange={(e) => {
                      const next = [...products];
                      next[idx] = { ...prod, usage: e.target.value };
                      setProducts(next);
                    }}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ВКЛАДКА 3: СПЕЦТЕХНИКА */}
      {activeTab === 'equipment' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white border border-slate-200 rounded-xl p-4">
            <div className="text-xs text-slate-600">
              Управление карточками спецтехники (АБН, Автокран, Автовышка + манипулятор, Экскаватор
              JCB).
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleAddEquipment}
                className="px-4 py-2 text-xs font-semibold text-slate-800 bg-slate-100 rounded-lg hover:bg-slate-200 cursor-pointer"
              >
                + Добавить технику
              </button>
              <button
                type="button"
                onClick={handleSaveEquipment}
                className="px-5 py-2 text-xs font-semibold text-white bg-orange-600 rounded-lg hover:bg-orange-700 cursor-pointer"
              >
                Сохранить спецтехнику
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {equipment.map((eq, idx) => (
              <div
                key={eq.id}
                className="bg-white border border-slate-200 rounded-xl p-5 grid grid-cols-1 md:grid-cols-12 gap-4"
              >
                <div className="md:col-span-4">
                  <label className="block text-[11px] text-slate-500 mb-1">
                    Наименование техники
                  </label>
                  <input
                    type="text"
                    value={eq.name}
                    onChange={(e) => {
                      const next = [...equipment];
                      next[idx] = { ...eq, name: e.target.value };
                      setEquipment(next);
                    }}
                    className="w-full px-3 py-1.5 text-sm font-bold border border-slate-300 rounded"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-[11px] text-slate-500 mb-1">Тип</label>
                  <select
                    value={eq.type}
                    onChange={(e) => {
                      const next = [...equipment];
                      next[idx] = { ...eq, type: e.target.value as EquipmentType };
                      setEquipment(next);
                    }}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded bg-white"
                  >
                    <option value="abn">АБН</option>
                    <option value="crane">Автокран</option>
                    <option value="aerial_manipulator">Автовышка + Манипулятор</option>
                    <option value="excavator_jcb">Экскаватор JCB</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-[11px] text-slate-500 mb-1">Цена за час, ₽</label>
                  <input
                    type="number"
                    value={eq.pricePerHour}
                    onChange={(e) => {
                      const next = [...equipment];
                      next[idx] = { ...eq, pricePerHour: Number(e.target.value) };
                      setEquipment(next);
                    }}
                    className="w-full px-3 py-1.5 text-sm font-num border border-slate-300 rounded"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-[11px] text-slate-500 mb-1">Цена за смену, ₽</label>
                  <input
                    type="number"
                    value={eq.pricePerShift}
                    onChange={(e) => {
                      const next = [...equipment];
                      next[idx] = { ...eq, pricePerShift: Number(e.target.value) };
                      setEquipment(next);
                    }}
                    className="w-full px-3 py-1.5 text-sm font-num border border-slate-300 rounded"
                  />
                </div>

                <div className="md:col-span-2 flex items-end justify-between">
                  <label className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer mb-2">
                    <input
                      type="checkbox"
                      checked={eq.available}
                      onChange={(e) => {
                        const next = [...equipment];
                        next[idx] = { ...eq, available: e.target.checked };
                        setEquipment(next);
                      }}
                    />
                    Доступна
                  </label>
                </div>

                <div className="md:col-span-12">
                  <label className="block text-[11px] text-slate-500 mb-1">
                    Характеристики и описание работ
                  </label>
                  <input
                    type="text"
                    value={eq.specs}
                    onChange={(e) => {
                      const next = [...equipment];
                      next[idx] = { ...eq, specs: e.target.value };
                      setEquipment(next);
                    }}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ВКЛАДКА 4: НАСТРОЙКИ ЗАВОДА И ОПЦИОНАЛЬНЫЕ БЛОКИ ("ПОД ВОПРОСОМ") */}
      {activeTab === 'settings' && settings && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900 font-display mb-1">
              Управление спорными блоками («под вопросом»)
            </h2>
            <p className="text-xs text-slate-500 mb-4">
              Вы можете в любой момент включать и отключать элементы, которые пока под вопросом у
              заказчика:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.showPriceTable}
                  onChange={(e) =>
                    setSettings({ ...settings, showPriceTable: e.target.checked })
                  }
                  className="mt-1 accent-orange-600"
                />
                <div>
                  <div className="text-xs font-bold text-slate-900">
                    Показывать сводную таблицу прайс-листа
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Единая таблица всех марок бетона и растворов под калькулятором
                  </div>
                </div>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.showTechnicalSpecsPFW}
                  onChange={(e) =>
                    setSettings({ ...settings, showTechnicalSpecsPFW: e.target.checked })
                  }
                  className="mt-1 accent-orange-600"
                />
                <div>
                  <div className="text-xs font-bold text-slate-900">
                    Показывать характеристики подвижности и морозостойкости (П / F / W)
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Отображение П2–П4, F100–F300, W2–W10 внутри карточек бетона
                  </div>
                </div>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.showEmailFieldInForm}
                  onChange={(e) =>
                    setSettings({ ...settings, showEmailFieldInForm: e.target.checked })
                  }
                  className="mt-1 accent-orange-600"
                />
                <div>
                  <div className="text-xs font-bold text-slate-900">
                    Показывать поле Email в форме заявки клиента
                  </div>
                  <div className="text-[11px] text-slate-500">
                    По умолчанию выключено (спрашиваем только Имя и Телефон для высокой конверсии)
                  </div>
                </div>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.showCookieBanner}
                  onChange={(e) =>
                    setSettings({ ...settings, showCookieBanner: e.target.checked })
                  }
                  className="mt-1 accent-orange-600"
                />
                <div>
                  <div className="text-xs font-bold text-slate-900">
                    Показывать уведомление о файлах Cookie
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Обязательно при установке Яндекс.Метрики (по требованиям 152-ФЗ)
                  </div>
                </div>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-200">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Мощность РБУ (м³/час)
              </label>
              <input
                type="number"
                value={settings.plantCapacityM3PerHour}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    plantCapacityM3PerHour: Number(e.target.value),
                  })
                }
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg font-num"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Время подачи по городу
              </label>
              <input
                type="text"
                value={settings.cityDeliveryTime}
                onChange={(e) =>
                  setSettings({ ...settings, cityDeliveryTime: e.target.value })
                }
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Телефон диспетчерской
              </label>
              <input
                type="text"
                value={settings.phone}
                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg font-num"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={handleSaveSettings}
              className="px-6 py-2.5 text-xs font-semibold text-white bg-orange-600 rounded-lg hover:bg-orange-700 cursor-pointer"
            >
              Сохранить настройки сайта
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
