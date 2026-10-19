import { MetadataRoute } from 'next';
import { TOOLS, SPECIALIZED_SOLUTIONS } from '@/lib/toolsConfig';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://aiscrubbers.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/about-us/`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/contact-us/`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/privacy-policy/`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.4,
    },
    {
      url: `${BASE_URL}/terms-of-service/`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.4,
    },
  ];

  const toolRoutes: MetadataRoute.Sitemap = TOOLS.map((tool) => ({
    url: `${BASE_URL}${tool.href}/`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.9,
  }));

  const specializedRoutes: MetadataRoute.Sitemap = SPECIALIZED_SOLUTIONS.map((sol) => ({
    url: `${BASE_URL}/${sol.slug}/`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.95,
  }));

  return [...staticRoutes, ...toolRoutes, ...specializedRoutes];
}
