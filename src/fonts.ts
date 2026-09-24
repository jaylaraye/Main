import {getInfo as getBrushInfo} from '@remotion/google-fonts/MaShanZheng';
import {continueRender, delayRender, staticFile} from 'remotion';

// Fonts are bundled in public/fonts so renders work offline and deterministically.
export const displayFont = 'Cinzel';
export const bodyFont = 'Cormorant Garamond';
export const brushFont = 'Ma Shan Zheng';

// Ma Shan Zheng is split into ~100 chunks; we only ship the ones holding
// the glyphs we draw (罂 粟 凤 龙 神 战).
const brushChunks = ['44', '100', '112', '116'] as const;

const faces = (): FontFace[] => {
	const ranges = getBrushInfo().unicodeRanges as Record<string, string>;
	return [
		new FontFace(displayFont, `url(${staticFile('fonts/cinzel.woff2')})`, {
			weight: '400 900',
		}),
		new FontFace(bodyFont, `url(${staticFile('fonts/cormorant-italic-500.woff2')})`, {
			style: 'normal',
			weight: '500',
		}),
		...brushChunks.map(
			(chunk) =>
				new FontFace(brushFont, `url(${staticFile(`fonts/mashanzheng-${chunk}.woff2`)})`, {
					unicodeRange: ranges[`[${chunk}]`],
				}),
		),
	];
};

if (typeof document !== 'undefined') {
	const handle = delayRender('Loading fonts');
	Promise.all(
		faces().map((face) => {
			document.fonts.add(face);
			return face.load();
		}),
	)
		.then(() => continueRender(handle))
		.catch((err) => {
			console.error(err);
			continueRender(handle);
		});
}
