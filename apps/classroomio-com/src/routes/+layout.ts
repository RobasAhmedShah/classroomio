import type { MetaTagsProps } from 'svelte-meta-tags';

export const prerender = true;

export function load({ url }) {
  return {
    baseMetaTags: getBaseMetaTags(url),
    url: url.pathname
  };
}

function getBaseMetaTags(url: URL) {
  const metatags = Object.freeze({
    title: 'Learnova | The Open Source Learning Management System for Companies',
    description:
      'A flexible, user-friendly platform for creating, managing, and delivering courses for companies and training organisations',
    canonical: new URL(url.pathname, url.origin).href,
    openGraph: {
      type: 'website',
      url: new URL(url.pathname, url.origin).href,
      locale: 'en_IE',
      title: 'Learnova | The Open Source Learning Management System for Companies',
      description:
        'A flexible, user-friendly platform for creating, managing, and delivering courses for companies and training organisations',
      siteName: 'Learnova',
      images: [
        {
          url: 'https://brand.cdn.clsrio.com/og/Learnova-og.png',
          alt: 'Learnova OG Image',
          width: 1920,
          height: 1080,
          secureUrl: 'https://brand.cdn.clsrio.com/og/Learnova-og.png',
          type: 'image/jpeg'
        }
      ]
    },
    twitter: {
      handle: '@Learnova',
      site: '@Learnova',
      cardType: 'summary_large_image' as const,
      title: 'Learnova | The Open Source Learning Management System for Companies',
      description:
        'A flexible, user-friendly platform for creating, managing, and delivering courses for companies and training organisations',
      image: 'https://brand.cdn.clsrio.com/og/Learnova-og.png',
      imageAlt: 'Learnova OG Image'
    }
  }) satisfies MetaTagsProps;

  return metatags;
}
