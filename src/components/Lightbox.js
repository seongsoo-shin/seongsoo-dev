// Lightbox markup, identical to the original project detail pages.
export default function Lightbox() {
  return (
    <div className="lightbox" id="lightbox" role="dialog" aria-modal="true" aria-hidden="true">
      <button className="lb-close" type="button" aria-label="Close image preview">
        ×
      </button>
      <button className="lb-nav lb-prev" type="button" aria-label="Previous">
        ‹
      </button>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img id="lb-img" alt="" />
      <button className="lb-nav lb-next" type="button" aria-label="Next">
        ›
      </button>
      <div className="lb-meta" id="lb-meta"></div>
    </div>
  );
}
