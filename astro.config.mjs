// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import Icons from 'unplugin-icons/vite';

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
                'en-US': 'APIOps Cycles Method',
                'fi-FI': 'APIOps Cycles -menetelmä',
                'fr-FR': 'Méthode APIOps Cycles',
                'de-DE': 'Methode APIOps Cycles',
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
                        lang: 'en-US',
                        },
                        'fi-fi': {
                        label: 'Suomi',
                        lang: 'fi-FI',
                        },
                        'fr-fr': {
                        label: 'Français',
                        lang: 'fr-FR',
                        },
                        'de-de': {
                        label: 'Deutsch',
                        lang: 'de-DE',
                        },
                },
                      sidebar: [
                              {
                                      label: 'Start Here',
                                      translations: { 'fi-FI': 'Aloita tästä', 'fr-FR': 'Commencez ici', 'de-DE': 'Hier anfangen' },
                                      items: [
                                                { 
                                                label: 'Getting Started', 
                                                translations: { 'fi-FI': 'Kuinka pääset alkuun', 'fr-FR': 'Comment commencer', 'de-DE': 'Erste Schritte' }, 
                                                slug: 'the-method'
                                                },
                                                {
                                                        label: 'Advanced Topics',
                                                        translations: { 'fi-FI': 'Edistyneet aiheet', 'fr-FR': 'Sujets avancés', 'de-DE': 'Fortgeschrittene Themen' },
                                                        link: '/advanced-topics/',
                                                },
                                                {
                                                        label: 'Partners & Community',
                                                        translations: { 'fi-FI': 'Yhteisö ja tuki', 'fr-FR': 'Communauté et support', 'de-DE': 'Community und Support' },
                                                        link: '/community/',
                                                },
                                                {
                                                        label: 'Changelog',
                                                        translations: { 'fi-FI': 'Muutokset', 'fr-FR': 'Journal des modifications', 'de-DE': 'Änderungsprotokoll' },
                                                        link: '/changelog/',
                                                }
                                        ],
                                },
                                {
                                      label: 'Method',
                                      translations: { 'fi-FI': 'Menetelmä', 'fr-FR': 'Méthode', 'de-DE': 'Methode' },
                                          items: [

                                                        {
                                                                label: 'Metro Lines',
                                                                translations: { 'fi-FI': 'Metrolinjat', 'fr-FR': 'Lignes de métro', 'de-DE': 'Metro-Linien' },
                                                                collapsed: true,
                                                                autogenerate: { directory: 'lines' },
                                                        },                                                {
                                                                label: 'Core Stations',
                                                                translations: { 'fi-FI': 'Ydinasemat', 'fr-FR': 'Stations principales', 'de-DE': 'Kernstationen' },
                                                                autogenerate: { directory: 'core-stations' },
                                                        },
                                                        {
                                                                label: 'Suburb Stations',
                                                                translations: { 'fi-FI': 'Lähiöasemat', 'fr-FR': 'Stations suburbaines', 'de-DE': 'Vorortstationen' },
                                                                collapsed: true,
                                                                autogenerate: { directory: 'suburb-stations' },
                                                        },
                                                        {
                                                                label: 'Resources',
                                                                translations: { 'fi-FI': 'Resurssit', 'fr-FR': 'Ressources', 'de-DE': 'Ressourcen' },
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
    plugins: [tailwindcss(),Icons({ compiler: 'astro' })],
  },
});