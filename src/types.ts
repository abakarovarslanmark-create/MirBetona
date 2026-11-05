export type ProductCategory = 'concrete' | 'mortar' | 'fbs';

export interface ProductItem {
  id: string;
  category: ProductCategory;
  name: string;
  strengthClass?: string;
  composition: string;
  mobility?: string;
  frostResistance?: string;
  waterResistance?: string;
  priceGravel: number;
  priceGranite?: number;
  unit: string;
  usage: string;
  imageUrl: string;
  inStock: boolean;
}

export type EquipmentType = 'abn' | 'crane' | 'aerial_manipulator' | 'excavator_jcb';

export interface EquipmentItem {
  id: string;
  type: EquipmentType;
  name: string;
  specs: string;
  minHours: number;
  pricePerHour: number;
  pricePerShift: number;
  imageUrl: string;
  available: boolean;
}

export interface EstimateCartItem {
  id: string;
  title: string;
  categoryLabel: string;
  unit: string;
  quantity: number;
  unitPrice: number;
}

export type LeadSource = 'calculator' | 'catalog' | 'equipment' | 'contact';
export type LeadStatus = 'new' | 'in_progress' | 'completed';

export interface LeadItem {
  id: string;
  clientName: string;
  phone: string;
  email?: string;
  source: LeadSource;
  selectedItem?: string;
  calculationSummary?: string;
  comment?: string;
  consentGiven: boolean;
  status: LeadStatus;
  emailSent: boolean;
  createdAt: string;
}

export interface SiteSettings {
  companyName: string;
  legalEntity: string;
  inn: string;
  ogrn: string;
  address: string;
  phone: string;
  email: string;
  telegramUrl: string;
  vkUrl: string;
  whatsappPhone: string;
  plantCapacityM3PerHour: number;
  cityDeliveryTime: string;
  gostStandard: string;
  labDescription: string;
  certificatesNote: string;
  deliveryBasePrice: number;
  deliveryPricePerKm: number;
  // Переключатели опциональных блоков (которые пока под вопросом у заказчика)
  showPriceTable: boolean;
  showTechnicalSpecsPFW: boolean;
  showEmailFieldInForm: boolean;
  showCookieBanner: boolean;
}

export interface DatabaseSchema {
  products: ProductItem[];
  equipment: EquipmentItem[];
  leads: LeadItem[];
  settings: SiteSettings;
}
