import {
	AbsoluteFill,
	Easing,
	interpolate,
	OffthreadVideo,
	Sequence,
	spring,
	staticFile,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';
import {continueRender, delayRender} from 'remotion';

const FPS = 30;
export const NETFLIX_DURATION = Math.floor(30.06 * FPS);

const RED = '#E50914';

// Sofia Pro is a commercial font. Drop SofiaPro-Bold.woff2 into public/fonts and it
// is used automatically; until then Outfit Bold (a free geometric look-alike) fills in.
const FONT = "'Sofia Pro', 'Outfit', sans-serif";

if (typeof document !== 'undefined') {
	const handle = delayRender('Loading Netflix House fonts');
	const faces = [
		new FontFace('Sofia Pro', `url(${staticFile('fonts/SofiaPro-Bold.woff2')})`, {weight: '700'}),
		new FontFace('Outfit', `url(${staticFile('fonts/outfit-700.woff2')})`, {weight: '700'}),
	];
	Promise.allSettled(
		faces.map((face) => face.load().then(() => document.fonts.add(face))),
	).then(() => continueRender(handle));
}

type Word = {text: string; accent?: boolean};
type Caption = {from: number; to: number; lines: Word[][]};

// Plain lines animate word by word; accent lines animate as one red-highlighted block.
const w = (s: string, accent = false): Word[] =>
	accent ? [{text: s, accent}] : s.split(' ').map((text) => ({text}));

// Timings (seconds) line up with the cuts in the source reel.
const CAPTIONS: Caption[] = [
	{
		from: 1.8,
		to: 7.2,
		lines: [w('JOIN US FOR A'), w('PRIVATE'), w('NETFLIX HOUSE', true), w('EXPERIENCE')],
	},
	{
		from: 8.8,
		to: 14.8,
		lines: [w('ENJOY'), w('COMPLIMENTARY'), w('FOOD, BEVERAGES &'), w('UNLIMITED GAMES', true)],
	},
	{
		from: 23.2,
		to: 28.4,
		lines: [w('ONLY AT'), w('DSU FALL 2026!', true)],
	},
];

const STAGGER = 3; // frames between words
const EXIT = 10; // frames for the exit animation

const AnimatedWord: React.FC<{word: Word; index: number; duration: number; size: number}> = ({
	word,
	index,
	duration,
	size,
}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const enter = spring({frame: frame - index * STAGGER, fps, config: {damping: 14, stiffness: 140}});
	const exit = interpolate(frame, [duration - EXIT, duration], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
		easing: Easing.in(Easing.cubic),
	});
	const y = (1 - enter) * 110 - exit * 110;

	return (
		<span style={{display: 'inline-block', overflow: 'hidden', whiteSpace: 'nowrap', fontSize: size, padding: '0.04em 0.13em'}}>
			<span
				style={{
					display: 'inline-block',
					transform: `translateY(${y}%) scale(${0.9 + 0.1 * enter})`,
					opacity: Math.min(enter * 1.5, 1 - exit),
					color: 'white',
					background: word.accent ? RED : 'transparent',
					padding: word.accent ? '0.02em 0.14em 0' : 0,
					textShadow: word.accent ? 'none' : '0 4px 24px rgba(0,0,0,0.65), 0 2px 4px rgba(0,0,0,0.5)',
				}}
			>
				{word.text}
			</span>
		</span>
	);
};

const CaptionCard: React.FC<{caption: Caption; duration: number}> = ({caption, duration}) => {
	const frame = useCurrentFrame();
	const scrim = interpolate(frame, [0, 10, duration - EXIT, duration], [0, 1, 1, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	let index = 0;

	return (
		<AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
			<AbsoluteFill
				style={{
					opacity: scrim,
					background: 'radial-gradient(ellipse 90% 45% at 50% 50%, rgba(0,0,0,0.55), rgba(0,0,0,0) 70%)',
				}}
			/>
			<div
				style={{
					fontFamily: FONT,
					fontWeight: 700,
					textTransform: 'uppercase',
					textAlign: 'center',
					lineHeight: 1.08,
					letterSpacing: '0.01em',
					padding: '0 60px',
				}}
			>
				{caption.lines.map((line, li) => {
					const chars = line.map((x) => x.text).join(' ').length;
					const size = Math.min(150, Math.floor(1400 / Math.max(chars, 8)));
					return (
						<div key={li} style={{display: 'flex', justifyContent: 'center', margin: '-0.02em 0'}}>
							{line.map((word, wi) => (
								<AnimatedWord key={wi} word={word} index={index++} duration={duration} size={size} />
							))}
						</div>
					);
				})}
			</div>
		</AbsoluteFill>
	);
};

export const NetflixHouse: React.FC = () => {
	return (
		<AbsoluteFill style={{backgroundColor: 'black'}}>
			<OffthreadVideo src={staticFile('netflix-house-promo.mp4')} />
			{CAPTIONS.map((c, i) => {
				const from = Math.round(c.from * FPS);
				const duration = Math.round((c.to - c.from) * FPS);
				return (
					<Sequence key={i} from={from} durationInFrames={duration} name={`Caption ${i + 1}`}>
						<CaptionCard caption={c} duration={duration} />
					</Sequence>
				);
			})}
		</AbsoluteFill>
	);
};
