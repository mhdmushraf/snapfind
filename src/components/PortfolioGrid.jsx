import { useState } from 'react';
import { thumbUrl } from '@/lib/storage';
import Reveal from '@/components/Reveal';

/**
 * Portfolio grid with four genuinely different layouts.
 * Each studio picks one; the same photos read very differently.
 */
export default function PortfolioGrid({ photos, layout = 'masonry', rounded = 'rounded-2xl', motion = true, onOpen }) {
  if (!photos?.length) return null;

  const Img = ({ src, className, i }) => (
    <button onClick={() => onOpen?.(src)} className={`block w-full overflow-hidden group ${rounded} ${className || ''}`}>
      <img
        src={thumbUrl(src, 900)}
        alt=""
        loading="lazy"
        className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-[900ms] ease-out"
      />
    </button>
  );

  if (layout === 'filmstrip') {
    return (
      <div className="-mx-5 sm:-mx-8 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex gap-3 px-5 sm:px-8 w-max">
          {photos.map((src, i) => (
            <Reveal key={i} enabled={motion} delay={Math.min(i, 6) * 60}>
              <div className="w-[70vw] sm:w-[26rem] h-[18rem] sm:h-[22rem] shrink-0">
                <Img src={src} className="h-full" i={i} />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    );
  }

  if (layout === 'grid') {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {photos.map((src, i) => (
          <Reveal key={i} enabled={motion} delay={Math.min(i, 8) * 50}>
            <div className="aspect-square"><Img src={src} className="h-full" i={i} /></div>
          </Reveal>
        ))}
      </div>
    );
  }

  if (layout === 'alternating') {
    // Repeating rhythm: one wide, two stacked, one tall — never a flat grid.
    const rows = [];
    for (let i = 0; i < photos.length; i += 3) rows.push(photos.slice(i, i + 3));
    return (
      <div className="space-y-3">
        {rows.map((row, r) => (
          <Reveal key={r} enabled={motion} delay={Math.min(r, 6) * 70}>
            <div className={`grid gap-3 ${r % 2 ? 'sm:grid-cols-[1fr_1.6fr]' : 'sm:grid-cols-[1.6fr_1fr]'}`}>
              <div className="h-64 sm:h-[26rem]"><Img src={row[0]} className="h-full" i={r * 3} /></div>
              {row.length > 1 && (
                <div className="grid gap-3">
                  {row.slice(1).map((src, j) => (
                    <div key={j} className="h-32 sm:h-[12.5rem]"><Img src={src} className="h-full" i={r * 3 + j + 1} /></div>
                  ))}
                </div>
              )}
            </div>
          </Reveal>
        ))}
      </div>
    );
  }

  // masonry
  return (
    <div className="columns-2 sm:columns-3 gap-3">
      {photos.map((src, i) => (
        <div key={i} className="mb-3 break-inside-avoid">
          <Reveal enabled={motion} delay={Math.min(i, 8) * 50}>
            <Img src={src} i={i} />
          </Reveal>
        </div>
      ))}
    </div>
  );
}
