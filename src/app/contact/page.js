import PageShell from '@/components/PageShell';
import { FooterLinks } from '@/components/Footer';
import { buildMetadata } from '@/lib/meta';
import content from '@/data/content.json';

const page = content.contact;
export const metadata = buildMetadata(page.meta);

export default function Page() {
  return <PageShell active="contact" html={page.main} footerLinks={FooterLinks.contact} />;
}
