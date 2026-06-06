import PageShell from '@/components/PageShell';
import ProjectModal from '@/components/ProjectModal';
import { FooterLinks } from '@/components/Footer';
import { buildMetadata } from '@/lib/meta';
import content from '@/data/content.json';

const page = content.index;
export const metadata = buildMetadata(page.meta);

// Section order: Hero → Strengths → Stack → Projects → Timeline → Contact
const combinedHtml = [
  page.main,           // Hero + Strengths + Stack
  content.projects.main, // Projects
  page.timeline,       // Timeline (Career)
  content.contact.main,  // Contact
].join('\n');

export default function Page() {
  return (
    <>
      <PageShell active="index" html={combinedHtml} footerLinks={FooterLinks.index} withLightbox />
      <ProjectModal details={content.projectDetails} />
    </>
  );
}
