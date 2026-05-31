// Build Next.js Metadata from an extracted page's meta block.
export function buildMetadata(meta) {
  return {
    title: meta.title,
    description: meta.description,
    alternates: { canonical: meta.canonical },
    openGraph: {
      type: 'website',
      siteName: 'Seongsoo Shin',
      title: meta.ogTitle,
      description: meta.ogDescription,
      url: meta.ogUrl,
      images: [{ url: meta.ogImage, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: meta.ogTitle,
      description: meta.ogDescription,
      images: [meta.ogImage],
    },
  };
}
