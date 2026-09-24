# The Poppy War — an animated tribute

A ~39 second [Remotion](https://www.remotion.dev) animation (1920×1080, 30 fps) about R.F. Kuang's *The Poppy War* trilogy.

| Scene | What happens |
| --- | --- |
| Title | A poppy blooms over the brush-painted characters 罂粟 ("poppy") as embers rise |
| Book I: *The Poppy War* (2018) | A crimson seal for 凤 (the Phoenix): Tikany, the Keju, Sinegard |
| Book II: *The Dragon Republic* (2019) | A sea-teal seal for 龙 (the Dragon): vengeance and a fragile alliance |
| Book III: *The Burning God* (2020) | A gold seal for 神 (the God): the war for the south |
| Finale | 战 ("war") stamps in and a field of poppies blooms |

The summaries are spoiler-light and written for this piece.

## Usage

```bash
npm install
npm run dev      # open Remotion Studio to preview and tweak
npm run render   # writes out/poppy-war.mp4
```

Fonts (Cinzel, Cormorant Garamond, and the glyphs used from Ma Shan Zheng) are bundled in `public/fonts`, so rendering works offline.

## Layout

- `src/PoppyWar.tsx`: the timeline, with scenes cross-fading into each other
- `src/theme.ts`: per-book colors, glyphs and text
- `src/scenes/`: Title, Book (reused for all three books), Finale
- `src/components/`: Poppy (blooming SVG flower), Seal (self-drawing glyph seal), Embers, Fade
