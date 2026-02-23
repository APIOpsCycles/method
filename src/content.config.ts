import { defineCollection, z } from 'astro:content';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';

export const collections = {
        docs: defineCollection({
                loader: docsLoader(),
                schema: docsSchema({
                        extend: z.object({
                                icon: z.string().optional(),
                                metrolines: z.array(z.string()).optional(),
                                stations: z.array(z.string()).optional(),
                                category: z.string().optional(),
                                canvasId: z.string().optional(),
                                // Add a default value to the built-in `banner` field.
                                banner: z.object({ content: z.string() }).default({
                                  content: 'APIOps Helsinki 2026 conference is here! <a href="https://helsinki.apiops.info/">https://helsinki.apiops.info/</a>.',
                                }),
                        }),
                }),
        }),
};
