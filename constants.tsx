import { PlatformData, PlatformId } from './types';
import { Instagram, Facebook, Youtube, Twitter, Video, Music2 } from 'lucide-react';
import React from 'react';

// While we can't export components directly in constants for some strict setups, 
// we will define the data and map icons in the component layer or just use strings here.
// For this strict setup, I will keep data pure.

export const PLATFORMS: PlatformData[] = [
  {
    id: PlatformId.INSTAGRAM,
    name: 'Instagram',
    color: 'bg-pink-600',
    gradient: 'from-yellow-400 via-red-500 to-purple-600',
    iconName: 'Instagram',
    description: 'Aumente sua autoridade visual e alcance.',
    offers: [
      {
        id: 'ig-fol',
        type: 'followers',
        title: 'Seguidores Instagram',
        priceStart: 22.90,
        discount: 54,
        products: [
          { id: 'ig-fol-500', quantity: 500, price: 22.90, originalPrice: 34.90, popular: false },
          { id: 'ig-fol-1000', quantity: 1000, price: 39.90, originalPrice: 64.90, popular: true },
          { id: 'ig-fol-2000', quantity: 2000, price: 79.90, originalPrice: 119.90, popular: false },
          { id: 'ig-fol-3000', quantity: 3000, price: 109.90, originalPrice: 164.90, popular: false },
          { id: 'ig-fol-5000', quantity: 5000, price: 174.90, originalPrice: 249.90, popular: false },
          { id: 'ig-fol-10000', quantity: 10000, price: 339.90, originalPrice: 449.90, popular: false },
        ]
      },
      {
        id: 'ig-lik',
        type: 'likes',
        title: 'Curtidas Instagram',
        priceStart: 10.90,
        discount: 20,
        products: [
          { id: 'ig-lik-500', quantity: 500, price: 10.90, originalPrice: 15.90, popular: false },
          { id: 'ig-lik-1000', quantity: 1000, price: 19.90, originalPrice: 29.90, popular: true },
          { id: 'ig-lik-5000', quantity: 5000, price: 89.90, originalPrice: 129.90, popular: false },
        ]
      },
      {
        id: 'ig-view',
        type: 'views',
        title: 'Visualizações Instagram',
        priceStart: 10.90,
        discount: 37,
        products: [
          { id: 'ig-view-500', quantity: 500, price: 10.90, originalPrice: 15.90, popular: false },
          { id: 'ig-view-1000', quantity: 1000, price: 19.90, originalPrice: 29.90, popular: true },
          { id: 'ig-view-5000', quantity: 5000, price: 89.90, originalPrice: 129.90, popular: false },
        ]
      },
    ]
  },
  {
    id: PlatformId.FACEBOOK,
    name: 'Facebook',
    color: 'bg-blue-700',
    gradient: 'from-blue-600 to-blue-800',
    iconName: 'Facebook',
    description: 'Fortaleça sua presença na maior rede do mundo.',
    offers: [
      {
        id: 'fb-fol',
        type: 'followers',
        title: 'Seguidores Facebook',
        priceStart: 19.90,
        discount: 54,
        products: [
          { id: 'fb-fol-500', quantity: 500, price: 19.90, originalPrice: 29.90, popular: false },
          { id: 'fb-fol-1000', quantity: 1000, price: 34.90, originalPrice: 59.90, popular: true },
        ]
      },
      {
        id: 'fb-lik',
        type: 'likes',
        title: 'Curtidas Facebook',
        priceStart: 14.90,
        discount: 20,
        products: [
          { id: 'fb-lik-500', quantity: 500, price: 14.90, originalPrice: 19.90, popular: false },
        ]
      },
      {
        id: 'fb-view',
        type: 'views',
        title: 'Visualizações Facebook',
        priceStart: 19.90,
        discount: 37,
        products: [
          { id: 'fb-view-500', quantity: 500, price: 19.90, originalPrice: 29.90, popular: false },
        ]
      },
    ]
  },
  {
    id: PlatformId.TIKTOK,
    name: 'TikTok',
    color: 'bg-black',
    gradient: 'from-gray-900 via-black to-gray-800 border border-gray-700',
    iconName: 'Music2',
    description: 'Viralize seu conteúdo rapidamente.',
    offers: [
      {
        id: 'tk-fol',
        type: 'followers',
        title: 'Seguidores TikTok',
        priceStart: 19.90,
        discount: 54,
        products: [
          { id: 'tk-fol-500', quantity: 500, price: 19.90, originalPrice: 29.90, popular: false },
        ]
      },
      {
        id: 'tk-lik',
        type: 'likes',
        title: 'Curtidas TikTok',
        priceStart: 10.90,
        discount: 20,
        products: [
          { id: 'tk-lik-500', quantity: 500, price: 10.90, originalPrice: 15.90, popular: false },
        ]
      },
      {
        id: 'tk-view',
        type: 'views',
        title: 'Visualizações TikTok',
        priceStart: 10.90,
        discount: 37,
        products: [
          { id: 'tk-view-500', quantity: 500, price: 10.90, originalPrice: 15.90, popular: false },
        ]
      },
    ]
  },
  {
    id: PlatformId.YOUTUBE,
    name: 'Youtube',
    color: 'bg-red-600',
    gradient: 'from-red-500 to-red-700',
    iconName: 'Youtube',
    description: 'Monetize seu canal com inscritos reais.',
    offers: [
      {
        id: 'yt-sub',
        type: 'followers',
        title: 'Inscritos Youtube',
        priceStart: 24.90,
        discount: 54,
        products: [
          { id: 'yt-sub-500', quantity: 500, price: 24.90, originalPrice: 39.90, popular: false },
        ]
      },
      {
        id: 'yt-lik',
        type: 'likes',
        title: 'Curtidas Youtube',
        priceStart: 14.90,
        discount: 20,
        products: [
          { id: 'yt-lik-500', quantity: 500, price: 14.90, originalPrice: 19.90, popular: false },
        ]
      },
      {
        id: 'yt-view',
        type: 'views',
        title: 'Visualizações Youtube',
        priceStart: 14.90,
        discount: 37,
        products: [
          { id: 'yt-view-500', quantity: 500, price: 14.90, originalPrice: 19.90, popular: false },
        ]
      },
    ]
  },
  {
    id: PlatformId.TWITTER,
    name: 'Twitter (X)',
    color: 'bg-sky-500',
    gradient: 'from-sky-400 to-sky-600',
    iconName: 'Twitter',
    description: 'Amplifique sua voz e debates.',
    offers: [
      {
        id: 'tw-fol',
        type: 'followers',
        title: 'Seguidores X',
        priceStart: 39.90,
        discount: 54,
        products: [
          { id: 'tw-fol-500', quantity: 500, price: 39.90, originalPrice: 59.90, popular: false },
        ]
      },
      {
        id: 'tw-lik',
        type: 'likes',
        title: 'Curtidas X',
        priceStart: 29.90,
        discount: 20,
        products: [
          { id: 'tw-lik-500', quantity: 500, price: 29.90, originalPrice: 39.90, popular: false },
        ]
      },
      {
        id: 'tw-view',
        type: 'views',
        title: 'Visualizações X',
        priceStart: 9.90,
        discount: 37,
        products: [
          { id: 'tw-view-500', quantity: 500, price: 9.90, originalPrice: 14.90, popular: false },
        ]
      },
    ]
  },
  {
    id: PlatformId.KWAI,
    name: 'Kwai',
    color: 'bg-orange-500',
    gradient: 'from-orange-400 to-orange-600',
    iconName: 'Video',
    description: 'Cresça na plataforma de vídeos curtos.',
    offers: [
      {
        id: 'kw-fol',
        type: 'followers',
        title: 'Seguidores Kwai',
        priceStart: 19.90,
        discount: 54,
        products: [
          { id: 'kw-fol-500', quantity: 500, price: 19.90, originalPrice: 29.90, popular: false },
        ]
      },
      {
        id: 'kw-lik',
        type: 'likes',
        title: 'Curtidas Kwai',
        priceStart: 14.90,
        discount: 20,
        products: [
          { id: 'kw-lik-500', quantity: 500, price: 14.90, originalPrice: 19.90, popular: false },
        ]
      },
      {
        id: 'kw-view',
        type: 'views',
        title: 'Visualizações Kwai',
        priceStart: 14.90,
        discount: 37,
        products: [
          { id: 'kw-view-500', quantity: 500, price: 14.90, originalPrice: 19.90, popular: false },
        ]
      },
    ]
  }
];

export const TESTIMONIALS = [
  {
    name: "Ricardo Silva",
    role: "Influenciador Digital",
    content: "O suporte humano fez toda a diferença. Não são apenas números, é uma estratégia real."
  },
  {
    name: "Agência Vanguarda",
    role: "Marketing Empresarial",
    content: "A qualidade da entrega superou as expectativas. Finalmente uma plataforma que passa confiança."
  },
  {
    name: "Julia M.",
    role: "Criadora de Conteúdo",
    content: "Consegui destravar meu crescimento no TikTok em tempo recorde. Recomendo demais!"
  }
];
