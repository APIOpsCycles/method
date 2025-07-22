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
                        }),
                }),
        }),
};
