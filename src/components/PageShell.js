import Header from './Header';
import Footer from './Footer';
import SiteRuntime from './SiteRuntime';
import Lightbox from './Lightbox';

// Wraps a page: skip link + header + extracted <main> HTML + footer + client runtime.
// `html` is the rewritten inner HTML of the original <main id="main">.
export default function PageShell({ active, html, footerLinks, withLightbox = false }) {
  return (
    <>
      <a className="skip-link" href="#main">
        <span data-i18n-en="">Skip to content</span>
        <span data-i18n-ko="">본문으로 건너뛰기</span>
      </a>
      <Header active={active} />
      <main id="main" dangerouslySetInnerHTML={{ __html: html }} />
      <Footer links={footerLinks} />
      {withLightbox && <Lightbox />}
      <SiteRuntime />
    </>
  );
}
