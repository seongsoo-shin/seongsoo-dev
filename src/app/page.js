import PageShell from '@/components/PageShell';
import ProjectModal from '@/components/ProjectModal';
import { FooterLinks } from '@/components/Footer';
import { buildMetadata } from '@/lib/meta';
import content from '@/data/content.json';

const page = content.index;
export const metadata = buildMetadata(page.meta);

// Merge the projects section into the index page so it flows as one scroll.
const combinedHtml = page.main + '\n' + content.projects.main;

export default function Page() {
  return (
    <>
      <PageShell active="index" html={combinedHtml} footerLinks={FooterLinks.index} withLightbox />
      <ProjectModal details={content.projectDetails} />
    </>
  );
}
