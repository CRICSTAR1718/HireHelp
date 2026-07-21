/**
 * Decorative, animated background "doodle" — soft blurred blobs in the
 * accent palette that drift slowly. Purely visual: fixed position,
 * pointer-events: none, sits behind all content (z-index: 0). Drop it
 * once near the root of a layout; it fills the viewport.
 *
 * Respects prefers-reduced-motion (handled in styles/theme.css).
 */
export const AnimatedBackground = () => {
  return (
    <div className="hh-doodle-bg" aria-hidden="true">
      <svg
        width="100%"
        height="100%"
        style={{ position: "absolute", inset: 0 }}
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <radialGradient id="hhBlobBlue" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.16" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="hhBlobPurple" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.13" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="hhBlobTeal" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#14b8a6" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#14b8a6" stopOpacity="0" />
          </radialGradient>
        </defs>

        <circle className="hh-doodle-shape-a" cx="12%" cy="15%" r="260" fill="url(#hhBlobBlue)" />
        <circle className="hh-doodle-shape-b" cx="88%" cy="20%" r="220" fill="url(#hhBlobPurple)" />
        <circle className="hh-doodle-shape-c" cx="80%" cy="85%" r="280" fill="url(#hhBlobTeal)" />
        <circle className="hh-doodle-shape-b" cx="8%" cy="90%" r="200" fill="url(#hhBlobBlue)" />

        {/* faint dot-grid texture for a subtle "product" feel */}
        <pattern id="hhDotGrid" width="28" height="28" patternUnits="userSpaceOnUse">
          <circle cx="1.5" cy="1.5" r="1.5" fill="#94a3b8" fillOpacity="0.14" />
        </pattern>
        <rect width="100%" height="100%" fill="url(#hhDotGrid)" />
      </svg>
    </div>
  );
};

export default AnimatedBackground;
