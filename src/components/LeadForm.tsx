import React, { useState } from 'react';
import type { LeadSource, SiteSettings } from '../types';

interface LeadFormProps {
  settings: SiteSettings;
  source: LeadSource;
  selectedItem?: string;
  calculationSummary?: string;
  onSuccess?: () => void;
  onOpenLegalModal: (docType: 'privacy' | 'consent' | 'offer') => void;
}

export const LeadForm: React.FC<LeadFormProps> = ({
  settings,
  source,
  selectedItem,
  calculationSummary,
  onSuccess,
  onOpenLegalModal,
}) => {
  const [clientName, setClientName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [comment, setComment] = useState('');
  const [needDocuments, setNeedDocuments] = useState(false);
  const [consentGiven, setConsentGiven] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!clientName.trim() || !phone.trim()) {
      setErrorMessage('Пожалуйста, заполните ваше имя и контактный телефон.');
      return;
    }

    if (!consentGiven) {
      setErrorMessage(
        'Согласно 152-ФЗ необходимо подтвердить согласие на обработку персональных данных.'
      );
      return;
    }

    setSubmitting(true);
    try {
      const fullComment = [
        comment.trim(),
        needDocuments ? '[Требуются сертификат и документы о качестве]' : '',
      ]
        .filter(Boolean)
        .join(' ');

      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientName,
          phone,
          email: settings.showEmailFieldInForm ? email : undefined,
          source,
          selectedItem,
          calculationSummary,
          comment: fullComment,
          consentGiven,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Ошибка отправки заявки');
      }

      setSuccessMessage(data.message || 'Заявка принята! Диспетчер свяжется с вами.');
      setClientName('');
      setPhone('');
      setEmail('');
      setComment('');
      setNeedDocuments(false);
      if (onSuccess) {
        setTimeout(() => onSuccess(), 1800);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Произошла ошибка при отправке заявки');
    } finally {
      setSubmitting(false);
    }
  };

  if (successMessage) {
    return (
      <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-xl text-center">
        <div className="text-base font-bold text-emerald-900 mb-2">Заявка успешно отправлена</div>
        <p className="text-xs text-emerald-800 mb-4">{successMessage}</p>
        <button
          type="button"
          onClick={() => setSuccessMessage(null)}
          className="px-4 py-2 text-xs font-semibold text-emerald-900 bg-white border border-emerald-300 rounded-lg hover:bg-emerald-100 cursor-pointer"
        >
          Отправить еще одну заявку
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {selectedItem && (
        <div className="p-3 bg-slate-100 border border-slate-200 rounded-lg text-xs text-slate-800">
          <span className="text-slate-500">Выбранная позиция: </span>
          <strong className="font-semibold">{selectedItem}</strong>
        </div>
      )}

      {calculationSummary && (
        <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg text-xs text-slate-800 leading-relaxed">
          <span className="font-semibold text-orange-900 block mb-0.5">
            Параметры из калькулятора:
          </span>
          {calculationSummary}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Ваше имя <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            required
            placeholder="Например, Александр"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-slate-900"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Контактный телефон <span className="text-red-600">*</span>
          </label>
          <input
            type="tel"
            required
            placeholder="+7 (999) 000-00-00"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 font-num focus:outline-none focus:border-slate-900"
          />
        </div>
      </div>

      {settings.showEmailFieldInForm && (
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Email (для отправки КП или счета)
          </label>
          <input
            type="email"
            placeholder="name@company.ru"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-slate-900"
          />
        </div>
      )}

      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
          Адрес доставки, желаемое время подачи или комментарий
        </label>
        <textarea
          rows={2}
          placeholder="Укажите населенный пункт / улицу, объем или вопросы по подъезду техники"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-slate-900"
        />
      </div>

      {/* Опция запроса сертификата и документов о качестве (по требованию) */}
      <label className="flex items-start gap-2.5 cursor-pointer select-none">
        <input
          type="checkbox"
          checked={needDocuments}
          onChange={(e) => setNeedDocuments(e.target.checked)}
          className="mt-0.5 rounded border-slate-300 accent-slate-900"
        />
        <span className="text-xs text-slate-700">
          Предоставить сертификаты и документы о качестве на партию (выдаются по требованию)
        </span>
      </label>

      {/* Обязательный чекбокс по 152-ФЗ */}
      <label className="flex items-start gap-2.5 cursor-pointer select-none pt-1">
        <input
          type="checkbox"
          required
          checked={consentGiven}
          onChange={(e) => setConsentGiven(e.target.checked)}
          className="mt-0.5 rounded border-slate-300 accent-orange-600"
        />
        <span className="text-xs text-slate-600 leading-relaxed">
          Я даю{' '}
          <button
            type="button"
            onClick={() => onOpenLegalModal('consent')}
            className="text-slate-900 underline hover:text-orange-600 cursor-pointer"
          >
            согласие на обработку персональных данных
          </button>{' '}
          и соглашаюсь с{' '}
          <button
            type="button"
            onClick={() => onOpenLegalModal('privacy')}
            className="text-slate-900 underline hover:text-orange-600 cursor-pointer"
          >
            Политикой конфиденциальности (152-ФЗ)
          </button>
          .
        </span>
      </label>

      {errorMessage && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700">
          {errorMessage}
        </div>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full py-3 px-5 text-sm font-semibold text-white bg-orange-600 rounded-lg hover:bg-orange-700 disabled:opacity-60 transition-colors cursor-pointer"
      >
        {submitting ? 'Отправка заявки...' : 'Отправить заявку диспетчеру'}
      </button>

      <p className="text-[11px] text-slate-400">
        Отправляя заявку, вы принимаете условия{' '}
        <button
          type="button"
          onClick={() => onOpenLegalModal('offer')}
          className="underline hover:text-slate-600 cursor-pointer"
        >
          отсутствия публичной оферты (ст. 437 ГК РФ)
        </button>
        .
      </p>
    </form>
  );
};
