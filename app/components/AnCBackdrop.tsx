/**
 * Decorative page background — "Option 2a" from the AnC background design
 * file (dot-grid + soft blue glow + bolder corner watermark, larger tint
 * radius than 1a). Purely presentational: fixed behind all content, never
 * intercepts pointer events, and never needs to satisfy contrast on its own
 * since every panel drawn on top of it (Header, ChatBox, AnCDinoGame) is opaque.
 */
export default function AnCBackdrop() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      style={{ background: "oklch(98% 0.004 90)" }}
    >
      {/* dot grid — faded out toward the center so it never competes with the chat panel */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(oklch(80% 0.02 224 / 0.9) 1.4px, transparent 1.4px)",
          backgroundSize: "28px 28px",
          maskImage:
            "radial-gradient(ellipse 39% 78% at 62% 55%, transparent 55%, black 85%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 39% 78% at 62% 55%, transparent 55%, black 85%)",
        }}
      />

      {/* soft blue glow blobs */}
      <div
        className="absolute rounded-full"
        style={{
          left: "-20%",
          bottom: "-33%",
          width: "61%",
          aspectRatio: "1",
          background:
            "radial-gradient(circle, oklch(78% 0.09 224 / 0.32), transparent 75%)",
        }}
      />
      <div
        className="absolute rounded-full"
        style={{
          right: "-18%",
          top: "-29%",
          width: "51%",
          aspectRatio: "1",
          background:
            "radial-gradient(circle, oklch(78% 0.09 224 / 0.28), transparent 75%)",
        }}
      />

      {/* bolder corner watermark (full colour, not grayscaled — the "2a" tweak on 1a) */}
      <img
        src="/anc-logo-mark.png"
        alt=""
        className="absolute opacity-[0.22]"
        style={{ left: "-6%", bottom: "-8%", width: "30%", maxWidth: 480 }}
      />
      <img
        src="/anc-logo-mark.png"
        alt=""
        className="absolute opacity-20"
        style={{ right: "-4%", top: "-6%", width: "24%", maxWidth: 480 }}
      />
    </div>
  );
}
