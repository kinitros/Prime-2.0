import { LucideIcon } from "lucide-react";

export enum PlatformId {
  INSTAGRAM = 'instagram',
  FACEBOOK = 'facebook',
  TIKTOK = 'tiktok',
  YOUTUBE = 'youtube',
  TWITTER = 'twitter',
  KWAI = 'kwai'
}

export interface OrderBump {
  id: string;
  product_id: string;
  title: string;
  price: number;
  discount_percentage: number;
  position: number;
}

export interface Product {
  id: string;
  quantity: number;
  price: number;
  originalPrice: number;
  popular?: boolean;
  credit_card_url?: string;
  is_active?: boolean;
  order_bumps?: OrderBump[];
}

export interface ServiceOffer {
  id: string;
  type: 'followers' | 'likes' | 'views';
  title: string;
  priceStart: number;
  discount: number; // percentage
  products: Product[];
  showOnHome?: boolean;
  is_active?: boolean;
}

export interface PlatformData {
  id: PlatformId;
  name: string;
  color: string; // Tailwindi class or hex
  gradient: string;
  iconName: string; // Simplified for this demo
  description: string;
  offers: ServiceOffer[];
}

export interface OrderForm {
  link: string;
  name: string;
  cpf: string;
  email: string;
  whatsapp: string;
  paymentMethod: 'pix' | 'credit_card';
}