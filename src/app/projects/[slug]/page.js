import PageShell from '@/components/PageShell';
import { FooterLinks } from '@/components/Footer';
import { buildMetadata } from '@/lib/meta';
import content from '@/data/content.json';

const details = content.projectDetails;

// Pre-render every project page at build time (SSG).
export function generateStaticParams() {
  return Object.keys(details).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const page = details[slug];
  if (!page) return {};
  return buildMetadata(page.meta);
}

export default async function Page({ params }) {
  const { slug } = await params;
  const page = details[slug];
  return (
    <PageShell active="projects" html={page.main} footerLinks={FooterLinks.project} withLightbox />
  );
}
