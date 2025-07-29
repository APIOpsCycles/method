// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import Icons from 'unplugin-icons/vite';
import { cloudflare } from "@cloudflare/vite-plugin";

import tailwindcss from '@tailwindcss/vite';

const googleAnalyticsId = 'G-W8SLMJSV4E'

// https://astro.build/config
export default defineConfig({
  site: 'https://www.apiopscycles.com',
  integrations: [
      starlight({
        head: [
                // Adding google analytics
                {
                tag: 'script',
                attrs: {
                src: `https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`,
                },
                },
                {
                tag: 'script',
                content: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());

                gtag('config', '${googleAnalyticsId}');
                `,
                },
        ],
          title: {
                'en': 'APIOps Cycles'
        },
          logo: {
                light: './src/assets/apiops-cycles-logo2025-blue.svg',
                dark: './src/assets/apiops-cycles-logo2025-white.svg',
        },
          customCss: [
            // Path to your Tailwind base styles:
            './src/styles/global.css',
         ],
          components: {
            PageTitle: './src/components/PageTitle.astro',
          },
          social: [
                { icon: 'linkedin', label: 'LinkedIn', href: 'https://www.linkedin.com/company/apiopscycles/' },
                { icon: 'github', label: 'GitHub', href: 'https://github.com/apiopscycles/method' }
        ],
          defaultLocale: 'root',
          locales: {
                        root: {
                        label: 'English',
                        lang: 'en',
                        },
                        'fi': {
                        label: 'Suomi',
                        lang: 'fi',
                        },
                        'fr': {
                        label: 'Français',
                        lang: 'fr',
                        },
                        'de': {
                        label: 'Deutsch',
                        lang: 'de',
                        },                        
                        'pt': {
                        label: 'Português',
                        lang: 'pt',
                        },
                },
                      sidebar: [
                              {
                                      label: 'Start Here',
                                      translations: { 'fi': 'Aloita tästä', 'fr': 'Commencez ici', 'de': 'Hier anfangen', 'pt': 'Comece aqui' },
                                      items: [
                                                { 
                                                label: 'Getting Started', 
                                                translations: { 'fi': 'Kuinka pääset alkuun', 'fr': 'Comment commencer', 'de': 'Erste Schritte', 'pt': 'Começando' }, 
                                                slug: 'the-method'
                                                },
                                                {
                                                        label: 'Advanced Topics',
                                                        translations: { 'fi': 'Edistyneet aiheet', 'fr': 'Sujets avancés', 'de': 'Fortgeschrittene Themen', 'pt': 'Tópicos Avançados' },
                                                        link: '/advanced-topics/',
                                                },
                                                {
                                                        label: 'Partners & Community',
                                                        translations: { 'fi': 'Kumppanit ja yhteisö', 'fr': 'Partenaires et communauté', 'de': 'Partner & Gemeinschaft', 'pt': 'Parceiros e Comunidade' },
                                                        link: '/partners/',
                                                },
                                                {
                                                        label: 'Changelog',
                                                        translations: { 'fi': 'Muutokset', 'fr': 'Journal des modifications', 'de': 'Änderungsprotokoll', 'pt': 'Registro de alterações' },
                                                        link: '/changelog/',
                                                }
                                        ],
                                },
                                {
                                      label: 'Method',
                                      translations: { 'fi': 'Menetelmä', 'fr': 'Méthode', 'de': 'Methode', 'pt': 'Método' },
                                          items: [

                                                        {
                                                                label: 'Metro Lines',
                                                                translations: { 'fi': 'Metrolinjat', 'fr': 'Lignes de métro', 'de': 'Metro-Linien', 'pt': 'Linhas de metrô' },
                                                                collapsed: true,
                                                                autogenerate: { directory: 'lines' },
                                                        },                                                {
                                                                label: 'Core Stations',
                                                                translations: { 'fi': 'Ydinasemat', 'fr': 'Stations principales', 'de': 'Kernstationen', 'pt': 'Estações principais' },
                                                                autogenerate: { directory: 'core-stations' },
                                                        },
                                                        {
                                                                label: 'Suburb Stations',
                                                                translations: { 'fi': 'Lähiöasemat', 'fr': 'Stations suburbaines', 'de': 'Vorortstationen', 'pt': 'Estações suburbanas' },
                                                                collapsed: true,
                                                                autogenerate: { directory: 'suburb-stations' },
                                                        },
                                                        {
                                                                label: 'Resources',
                                                                translations: { 'fi': 'Resurssit', 'fr': 'Ressources', 'de': 'Ressourcen', 'pt': 'Recursos' },
                                                                collapsed: true,
                                                                autogenerate: { directory: 'resources' },
                                                        },


                                          ],
                              }
                      ],
      }),
	],

  vite: {
    // @ts-ignore
    plugins: [tailwindcss(),Icons({ compiler: 'astro' }),cloudflare()],
  },
});