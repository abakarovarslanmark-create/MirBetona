export type AppRoute = '/' | '/spectehnika' | '/admin';

export interface RouteSeoMeta {
  path: AppRoute;
  label: string;
  title: string;
  description: string;
  h1: string;
  subtitle: string;
}

export const SEO_ROUTES: Record<AppRoute, RouteSeoMeta> = {
  '/': {
    path: '/',
    label: 'Главная',
    title: 'Бетон в Ульяновске с доставкой с бетонного завода за 30–60 мин | БетонПром 73',
    description:
      'Бетонный завод в Ульяновске (60 м³/ч): товарный бетон М100–М400 с доставкой, строительные растворы, блоки ФБС и аренда спецтехники (экскаватор-погрузчик JCB, автовышка, манипулятор, автокран 25 т, АБН).',
    h1: 'Бетон, растворы, блоки ФБС и аренда спецтехники в Ульяновске',
    subtitle:
      'Прямая отгрузка с бетонного завода мощностью 60 м³/час. Подача миксера по Ульяновску за 30–60 минут, честный объем по ГОСТ 7473-2010 / 7473-2026.',
  },
  '/spectehnika': {
    path: '/spectehnika',
    label: 'Аренда спецтехники',
    title:
      'Аренда спецтехники в Ульяновске: Экскаватор-погрузчик JCB, Автовышка, Манипулятор, Автокран 25 т, АБН',
    description:
      'Услуги аренды спецтехники в Ульяновске с экипажем: экскаватор-погрузчик JCB, автовышка, манипулятор, автокран 25 тонн и автобетононасос (АБН). Подача от 30–60 минут, почасовая и посменная оплата.',
    h1: 'Аренда спецтехники в Ульяновске: Экскаватор-погрузчик, Автовышка, Манипулятор, Автокран и АБН',
    subtitle:
      'Собственный парк спецтехники при бетонном заводе в Ульяновске. Копка траншей и котлованов экскаватором-погрузчиком JCB, высотные работы автовышкой, перевозка манипулятором, монтаж краном 25 т и подача бетона АБН.',
  },
  '/admin': {
    path: '/admin',
    label: 'Админ-панель',
    title: 'Панель управления сайтом | БетонПром Ульяновск',
    description: 'Управление ценами на бетон, растворы, блоки ФБС, спецтехнику и обработка входящих заявок.',
    h1: 'Панель управления сайтом',
    subtitle: 'Редактирование каталога, цен и заявок',
  },
};

export function normalizeRoute(pathname: string): AppRoute {
  const clean = pathname.replace(/\/+$/, '') || '/';
  if (clean in SEO_ROUTES) {
    return clean as AppRoute;
  }
  return '/';
}

export function applyClientSeoMeta(route: AppRoute): void {
  const meta = SEO_ROUTES[route] || SEO_ROUTES['/'];
  document.title = meta.title;

  const setMetaContent = (selector: string, content: string) => {
    const el = document.querySelector(selector);
    if (el) {
      el.setAttribute('content', content);
    }
  };

  setMetaContent('meta[name="description"]', meta.description);
  setMetaContent('meta[property="og:title"]', meta.title);
  setMetaContent('meta[property="og:description"]', meta.description);
  setMetaContent('meta[name="twitter:title"]', meta.title);
  setMetaContent('meta[name="twitter:description"]', meta.description);
}
