import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import type { DatabaseSchema, LeadItem, ProductItem, EquipmentItem, SiteSettings } from './src/types.ts';
import { SEO_ROUTES, normalizeRoute } from './src/seo.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, 'data');
const DB_PATH = path.join(DATA_DIR, 'db.json');

const INITIAL_DB: DatabaseSchema = {
  settings: {
    companyName: 'БетонПром 73',
    legalEntity: 'ООО «БетонПромСтрой Ульяновск»',
    inn: '7325000000',
    ogrn: '1207300000000',
    address: 'г. Ульяновск, Московское шоссе, промзона, РБУ №1',
    phone: '+7 (8422) 00-00-00',
    email: 'zakaz@betonprom73.ru',
    telegramUrl: 'https://t.me/',
    vkUrl: 'https://vk.com/',
    whatsappPhone: '79000000000',
    plantCapacityM3PerHour: 60,
    cityDeliveryTime: '30–60 минут',
    gostStandard: 'ГОСТ 7473-2010 (действует до 01.11.2026) и новый ГОСТ 7473-2026 (с 01.11.2026)',
    labDescription: 'Собственная производственная лаборатория для внутреннего контроля качества замесов и входящего сырья',
    certificatesNote: 'Сертификаты и документы о качестве предоставляются по требованию заказчика',
    deliveryBasePrice: 3500,
    deliveryPricePerKm: 120,
    showPriceTable: true,
    showTechnicalSpecsPFW: false,
    showEmailFieldInForm: false,
    showCookieBanner: true,
  },
  products: [
    {
      id: 'beton-m100',
      category: 'concrete',
      name: 'Бетон М100',
      strengthClass: 'В7.5',
      composition: 'Известняковый / гравийный щебень, портландцемент М500, песок мытый',
      mobility: 'П2–П3',
      frostResistance: 'F50',
      waterResistance: 'W2',
      priceGravel: 4150,
      priceGranite: 4650,
      unit: 'м³',
      usage: 'Подготовительные работы (бетонная подушка) перед заливкой фундаментов, установка бордюров и дорожных оснований.',
      imageUrl: '',
      inStock: true,
    },
    {
      id: 'beton-m150',
      category: 'concrete',
      name: 'Бетон М150',
      strengthClass: 'В12.5',
      composition: 'Гравийный или гранитный щебень фр. 5–20 мм, цемент ЦЕМ I 42,5Н, песок',
      mobility: 'П2–П3',
      frostResistance: 'F75',
      waterResistance: 'W2',
      priceGravel: 4350,
      priceGranite: 4900,
      unit: 'м³',
      usage: 'Стяжка полов, заливка садовых дорожек, отмостки вокруг дома, фундаменты под легкие заборы и хозпостройки.',
      imageUrl: '',
      inStock: true,
    },
    {
      id: 'beton-m200',
      category: 'concrete',
      name: 'Бетон М200',
      strengthClass: 'В15',
      composition: 'Гравийный или гранитный щебень, цемент М500, песок 1 класса, пластификатор',
      mobility: 'П2–П4',
      frostResistance: 'F100',
      waterResistance: 'W4',
      priceGravel: 4650,
      priceGranite: 5250,
      unit: 'м³',
      usage: 'Ленточные и плитные фундаменты малоэтажных построек, бетонные лестницы, подпорные стены, площадки под авто.',
      imageUrl: '',
      inStock: true,
    },
    {
      id: 'beton-m250',
      category: 'concrete',
      name: 'Бетон М250',
      strengthClass: 'В20',
      composition: 'Гравийный или гранитный щебень, портландцемент ЦЕМ I 42,5Н, песок, комплекс добавок',
      mobility: 'П2–П4',
      frostResistance: 'F150',
      waterResistance: 'W4',
      priceGravel: 4950,
      priceGranite: 5600,
      unit: 'м³',
      usage: 'Монолитные фундаменты частных домов до 2 этажей, малонагруженные плиты перекрытий, балки и перемычки.',
      imageUrl: '',
      inStock: true,
    },
    {
      id: 'beton-m300',
      category: 'concrete',
      name: 'Бетон М300',
      strengthClass: 'В22.5',
      composition: 'Мытый гравийный или гранитный щебень 5–20 мм, цемент М500 Д0, песок, суперпластификатор',
      mobility: 'П3–П4',
      frostResistance: 'F200',
      waterResistance: 'W6',
      priceGravel: 5250,
      priceGranite: 5950,
      unit: 'м³',
      usage: 'Основная марка для монолитных плит и ленточных фундаментов коттеджей, перекрытий, чаш бассейнов и отмосток.',
      imageUrl: '',
      inStock: true,
    },
    {
      id: 'beton-m350',
      category: 'concrete',
      name: 'Бетон М350',
      strengthClass: 'В25',
      composition: 'Гранитный или прочный гравийный щебень, портландцемент высокой активности, модифицирующие добавки',
      mobility: 'П3–П4',
      frostResistance: 'F200',
      waterResistance: 'W8',
      priceGravel: 5550,
      priceGranite: 6300,
      unit: 'м³',
      usage: 'Несущие колонны, монолитные перекрытия, фундаменты многоэтажных зданий, ригели и конструкции с высокой нагрузкой.',
      imageUrl: '',
      inStock: true,
    },
    {
      id: 'beton-m400',
      category: 'concrete',
      name: 'Бетон М400',
      strengthClass: 'В30',
      composition: 'Гранитный щебень фр. 5–20 мм, цемент М500 Д0, мытый кварцевый песок, гидрофобные и пластифицирующие добавки',
      mobility: 'П4',
      frostResistance: 'F300',
      waterResistance: 'W10',
      priceGravel: 5950,
      priceGranite: 6750,
      unit: 'м³',
      usage: 'Гидротехнические сооружения, банковские хранилища, мостовые конструкции, спецобъекты и промышленные полы.',
      imageUrl: '',
      inStock: true,
    },
    {
      id: 'rastvor-m100',
      category: 'mortar',
      name: 'Раствор строительный М100',
      strengthClass: 'РК 100',
      composition: 'Цементно-песчаный состав на сеяном песке без крупного заполнителя',
      mobility: 'Пк2–Пк3',
      frostResistance: 'F50',
      priceGravel: 3800,
      unit: 'м³',
      usage: 'Кирпичная и блочная кладка стен, оштукатуривание внутренних и наружных поверхностей, заделка швов.',
      imageUrl: '',
      inStock: true,
    },
    {
      id: 'rastvor-m150',
      category: 'mortar',
      name: 'Раствор кладочный / монтажный М150',
      strengthClass: 'РК 150',
      composition: 'Портландцемент М500, сеяный мытый песок фр. до 2.2 мм, пластификатор',
      mobility: 'Пк3',
      frostResistance: 'F75',
      priceGravel: 4100,
      unit: 'м³',
      usage: 'Выравнивающие цементно-песчаные стяжки пола, кладка несущих стен из кирпича и камня, монтаж блоков ФБС.',
      imageUrl: '',
      inStock: true,
    },
    {
      id: 'rastvor-m200',
      category: 'mortar',
      name: 'Раствор цементный М200',
      strengthClass: 'РК 200',
      composition: 'Высокомарочный цементно-песчаный раствор повышенной прочности и влагостойкости',
      mobility: 'Пк3',
      frostResistance: 'F100',
      priceGravel: 4450,
      unit: 'м³',
      usage: 'Промышленные и гаражные стяжки пола, гидроизоляционные слои, кладка в условиях повышенной влажности.',
      imageUrl: '',
      inStock: true,
    },
    {
      id: 'fbs-24-4-6',
      category: 'fbs',
      name: 'Блок ФБС 24.4.6-Т',
      strengthClass: 'В15 (М200)',
      composition: 'Тяжелый бетон М200, монтажные петли из горячекатаной арматуры ГОСТ 13579-2018 (2380×400×580 мм)',
      frostResistance: 'F100',
      waterResistance: 'W4',
      priceGravel: 3650,
      unit: 'шт.',
      usage: 'Возведение стен подвалов, сборных ленточных фундаментов, цокольных этажей и неотапливаемых зданий.',
      imageUrl: '',
      inStock: true,
    },
    {
      id: 'fbs-24-5-6',
      category: 'fbs',
      name: 'Блок ФБС 24.5.6-Т',
      strengthClass: 'В15 (М200)',
      composition: 'Тяжелый бетон М200, стальные монтажные петли ГОСТ 13579-2018 (2380×500×580 мм)',
      frostResistance: 'F100',
      waterResistance: 'W4',
      priceGravel: 4350,
      unit: 'шт.',
      usage: 'Фундаменты под кирпичные и блочные стены шириной 500 мм, техподполья и подпорные стенки.',
      imageUrl: '',
      inStock: true,
    },
    {
      id: 'fbs-24-6-6',
      category: 'fbs',
      name: 'Блок ФБС 24.6.6-Т',
      strengthClass: 'В15 (М200)',
      composition: 'Тяжелый бетон М200 повышенной несущей способности ГОСТ 13579-2018 (2380×600×580 мм)',
      frostResistance: 'F100',
      waterResistance: 'W4',
      priceGravel: 5150,
      unit: 'шт.',
      usage: 'Высоконагруженные сборные фундаменты многоэтажных домов, промышленных цехов и глубоких подвалов.',
      imageUrl: '',
      inStock: true,
    },
    {
      id: 'fbs-12-4-6',
      category: 'fbs',
      name: 'Блок ФБС 12.4.6-Т (половинчатый)',
      strengthClass: 'В15 (М200)',
      composition: 'Тяжелый бетон М200, доборный фундаментный блок ГОСТ 13579-2018 (1180×400×580 мм)',
      frostResistance: 'F100',
      waterResistance: 'W4',
      priceGravel: 2150,
      unit: 'шт.',
      usage: 'Доборный элемент для перевязки швов при монтаже сборных фундаментов вместе с доставкой манипулятором или краном.',
      imageUrl: '',
      inStock: true,
    },
  ],
  equipment: [
    {
      id: 'eq-jcb',
      type: 'excavator_jcb',
      name: 'Экскаватор-погрузчик JCB',
      specs: 'Аренда экскаватора и фронтального погрузчика в Ульяновске: копка траншей под фундамент, котлованов, септиков, планировка участка и погрузка сыпучих материалов',
      minHours: 4,
      pricePerHour: 2600,
      pricePerShift: 19000,
      imageUrl: '',
      available: true,
    },
    {
      id: 'eq-aerial-manipulator',
      type: 'aerial_manipulator',
      name: 'Автовышка + Манипулятор (КМУ)',
      specs: 'Аренда автовышки и манипулятора в Ульяновске: доставка и разгрузка блоков ФБС, колец, стройматериалов + монтажная люлька для высотных работ',
      minHours: 4,
      pricePerHour: 2500,
      pricePerShift: 18000,
      imageUrl: '',
      available: true,
    },
    {
      id: 'eq-crane',
      type: 'crane',
      name: 'Автокран 25 тонн',
      specs: 'Аренда автокрана 25 т (вылет стрелы 21.7–28 м) в Ульяновске: монтаж блоков ФБС, плит перекрытий ПК/ПБ, разгрузка тяжелых ЖБИ и подача бадьи с бетоном',
      minHours: 4,
      pricePerHour: 2800,
      pricePerShift: 20000,
      imageUrl: '',
      available: true,
    },
    {
      id: 'eq-abn',
      type: 'abn',
      name: 'Автобетононасос (АБН)',
      specs: 'Подача бетонной смеси на расстояние и высоту (стрелы от 16 до 42 м) в труднодоступную опалубку, пусковая смесь в комплекте',
      minHours: 4,
      pricePerHour: 3500,
      pricePerShift: 24000,
      imageUrl: '',
      available: true,
    },
  ],
  leads: [],
};

async function readDb(): Promise<DatabaseSchema> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    const raw = await fs.readFile(DB_PATH, 'utf-8');
    return JSON.parse(raw) as DatabaseSchema;
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(DB_PATH, JSON.stringify(INITIAL_DB, null, 2), 'utf-8');
    return INITIAL_DB;
  }
}

async function writeDb(data: DatabaseSchema): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

function checkAdminAuth(req: express.Request): boolean {
  const expectedPassword = process.env.ADMIN_PASSWORD || 'admin';
  const headerToken = req.headers['x-admin-password'];
  return headerToken === expectedPassword;
}

function injectRouteSeoIntoHtml(html: string, pathname: string): string {
  const route = normalizeRoute(pathname);
  const meta = SEO_ROUTES[route] || SEO_ROUTES['/'];
  return html
    .replace(/<title>.*?<\/title>/s, `<title>${meta.title}</title>`)
    .replace(
      /<meta\s+name="description"\s+content=".*?"\s*\/>/s,
      `<meta name="description" content="${meta.description}" />`
    )
    .replace(
      /<meta\s+property="og:title"\s+content=".*?"\s*\/>/s,
      `<meta property="og:title" content="${meta.title}" />`
    )
    .replace(
      /<meta\s+property="og:description"\s+content=".*?"\s*\/>/s,
      `<meta property="og:description" content="${meta.description}" />`
    );
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '2mb' }));

  app.get('/api/catalog', async (_req, res) => {
    try {
      const db = await readDb();
      res.json({
        products: db.products,
        equipment: db.equipment,
        settings: db.settings,
      });
    } catch {
      res.status(500).json({ error: 'Ошибка чтения базы данных' });
    }
  });

  app.post('/api/leads', async (req, res) => {
    try {
      const { clientName, phone, email, source, selectedItem, calculationSummary, comment, consentGiven } = req.body;

      if (!clientName || !phone) {
        return res.status(400).json({ error: 'Пожалуйста, укажите имя и телефон' });
      }
      if (!consentGiven) {
        return res.status(400).json({ error: 'Необходимо согласие на обработку персональных данных (152-ФЗ)' });
      }

      const db = await readDb();
      const smtpConfigured = Boolean(process.env.SMTP_USER && process.env.SMTP_PASS && process.env.NOTIFY_EMAIL);

      const newLead: LeadItem = {
        id: `lead-${Date.now()}`,
        clientName: String(clientName).trim(),
        phone: String(phone).trim(),
        email: email ? String(email).trim() : undefined,
        source: source || 'contact',
        selectedItem: selectedItem ? String(selectedItem).trim() : undefined,
        calculationSummary: calculationSummary ? String(calculationSummary).trim() : undefined,
        comment: comment ? String(comment).trim() : undefined,
        consentGiven: Boolean(consentGiven),
        status: 'new',
        emailSent: smtpConfigured,
        createdAt: new Date().toISOString(),
      };

      db.leads.unshift(newLead);
      await writeDb(db);

      res.status(201).json({
        success: true,
        lead: newLead,
        message: 'Заявка успешно сохранена в базе данных. Менеджер свяжется с вами в ближайшее время.',
      });
    } catch {
      res.status(500).json({ error: 'Не удалось сохранить заявку' });
    }
  });

  app.post('/api/admin/login', (req, res) => {
    const { password } = req.body;
    const expectedPassword = process.env.ADMIN_PASSWORD || 'admin';
    if (password === expectedPassword) {
      res.json({ success: true });
    } else {
      res.status(401).json({ error: 'Неверный пароль администратора' });
    }
  });

  app.get('/api/admin/data', async (req, res) => {
    if (!checkAdminAuth(req)) {
      return res.status(401).json({ error: 'Доступ запрещен' });
    }
    const db = await readDb();
    res.json(db);
  });

  app.put('/api/admin/products', async (req, res) => {
    if (!checkAdminAuth(req)) {
      return res.status(401).json({ error: 'Доступ запрещен' });
    }
    const products = req.body.products as ProductItem[];
    if (!Array.isArray(products)) {
      return res.status(400).json({ error: 'Некорректный формат товаров' });
    }
    const db = await readDb();
    db.products = products;
    await writeDb(db);
    res.json({ success: true, products: db.products });
  });

  app.put('/api/admin/equipment', async (req, res) => {
    if (!checkAdminAuth(req)) {
      return res.status(401).json({ error: 'Доступ запрещен' });
    }
    const equipment = req.body.equipment as EquipmentItem[];
    if (!Array.isArray(equipment)) {
      return res.status(400).json({ error: 'Некорректный формат спецтехники' });
    }
    const db = await readDb();
    db.equipment = equipment;
    await writeDb(db);
    res.json({ success: true, equipment: db.equipment });
  });

  app.put('/api/admin/settings', async (req, res) => {
    if (!checkAdminAuth(req)) {
      return res.status(401).json({ error: 'Доступ запрещен' });
    }
    const settings = req.body.settings as SiteSettings;
    const db = await readDb();
    db.settings = { ...db.settings, ...settings };
    await writeDb(db);
    res.json({ success: true, settings: db.settings });
  });

  app.patch('/api/admin/leads/:id', async (req, res) => {
    if (!checkAdminAuth(req)) {
      return res.status(401).json({ error: 'Доступ запрещен' });
    }
    const { id } = req.params;
    const { status } = req.body;
    const db = await readDb();
    const lead = db.leads.find((l) => l.id === id);
    if (!lead) {
      return res.status(404).json({ error: 'Заявка не найдена' });
    }
    lead.status = status;
    await writeDb(db);
    res.json({ success: true, lead });
  });

  app.delete('/api/admin/leads/:id', async (req, res) => {
    if (!checkAdminAuth(req)) {
      return res.status(401).json({ error: 'Доступ запрещен' });
    }
    const { id } = req.params;
    const db = await readDb();
    db.leads = db.leads.filter((l) => l.id !== id);
    await writeDb(db);
    res.json({ success: true });
  });

  const isProd = process.env.NODE_ENV === 'production';
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'custom',
    });
    app.use(vite.middlewares);

    app.use('*', async (req, res, next) => {
      const url = req.originalUrl;
      try {
        const templatePath = path.resolve(__dirname, 'index.html');
        let template = await fs.readFile(templatePath, 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        const html = injectRouteSeoIntoHtml(template, req.path);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath, { index: false }));
    app.get('*', async (req, res) => {
      const template = await fs.readFile(path.join(distPath, 'index.html'), 'utf-8');
      const html = injectRouteSeoIntoHtml(template, req.path);
      res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
    });
  }

  const PORT = Number(process.env.PORT) || 3000;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
