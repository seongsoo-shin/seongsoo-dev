import PageShell from '@/components/PageShell';
import { FooterLinks } from '@/components/Footer';
import { buildMetadata } from '@/lib/meta';
import content from '@/data/content.json';

const page = content.career;
export const metadata = buildMetadata(page.meta);

export default function Page() {
  return <PageShell active="career" html={page.main} footerLinks={FooterLinks.career} />;
}
