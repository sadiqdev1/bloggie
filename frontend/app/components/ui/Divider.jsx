'use client';

/**
 * SVG trapezoid section divider — smooth transition between two bg colours.
 *
 * @param {string} fromColor - CSS colour of the section above
 * @param {string} toColor   - CSS colour of the section below
 */
export default function Divider({ fromColor, toColor }) {
  return (
    <div
      className="relative h-10 -my-px overflow-hidden pointer-events-none"
      style={{ background: fromColor }}
    >
      <svg
        viewBox="0 0 1440 40"
        preserveAspectRatio="none"
        className="absolute bottom-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Full trapezoid — no gaps at any viewport width */}
        <path d="M0,0 L1440,40 L1440,40 L0,40 Z" fill={toColor} />
      </svg>
    </div>
  );
}
