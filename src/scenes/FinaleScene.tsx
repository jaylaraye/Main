import {AbsoluteFill, interpolate, random, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {Embers} from '../components/Embers';
import {Poppy} from '../components/Poppy';
import {bodyFont, brushFont, displayFont} from '../fonts';
import {BOOKS, INK, PARCHMENT} from '../theme';

export const FinaleScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps, width, height} = useVideoConfig();

	const warGlyph = spring({frame: frame - 5, fps, config: {damping: 10, mass: 1.4}});
	const burn = interpolate(frame, [60, 210], [0, 1], {extrapolateRight: 'clamp'});
	const textIn = interpolate(frame, [70, 100], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const creditIn = interpolate(frame, [115, 145], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	return (
		<AbsoluteFill
			style={{
				background: `linear-gradient(to top, rgba(160,30,10,${0.45 * burn}) 0%, ${INK} 60%)`,
				backgroundColor: INK,
			}}
		>
			<Embers count={110} seed="finale" speed={1.4} />

			{/* A field of poppies blooming along the bottom edge */}
			{new Array(16).fill(null).map((_, i) => {
				const x = (i / 15) * width - 90 + random(`fx-${i}`) * 60;
				const s = 140 + random(`fs-${i}`) * 120;
				return (
					<div
						key={i}
						style={{
							position: 'absolute',
							left: x - s / 2,
							top: height - s * 0.55 - random(`fy-${i}`) * 60,
						}}
					>
						<Poppy
							size={s}
							delay={20 + Math.floor(random(`fd-${i}`) * 50)}
							rotate={random(`fr-${i}`) * 60}
							color={i % 3 === 0 ? '#b3160f' : '#d7261e'}
						/>
					</div>
				);
			})}

			<AbsoluteFill style={{alignItems: 'center', paddingTop: 110}}>
				<div
					style={{
						fontFamily: brushFont,
						fontSize: 240,
						lineHeight: 1,
						color: '#e0402f',
						transform: `scale(${interpolate(warGlyph, [0, 1], [2.2, 1])})`,
						opacity: warGlyph,
						textShadow: '0 0 60px #ff5a2a',
					}}
				>
					战
				</div>
				<div style={{display: 'flex', gap: 40, marginTop: 40, opacity: textIn}}>
					{BOOKS.map((b) => (
						<div
							key={b.title}
							style={{
								fontFamily: displayFont,
								fontSize: 30,
								letterSpacing: 4,
								color: b.accent,
								textTransform: 'uppercase',
							}}
						>
							{b.title}
						</div>
					))}
				</div>
				<div
					style={{
						fontFamily: displayFont,
						fontWeight: 700,
						fontSize: 84,
						color: PARCHMENT,
						letterSpacing: 12,
						textTransform: 'uppercase',
						marginTop: 36,
						opacity: creditIn,
						transform: `translateY(${(1 - creditIn) * 30}px)`,
					}}
				>
					R.F. Kuang
				</div>
				<div
					style={{
						fontFamily: bodyFont,
						fontSize: 42,
						color: '#e8b89a',
						marginTop: 6,
						opacity: creditIn,
					}}
				>
					Power always has a price.
				</div>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
