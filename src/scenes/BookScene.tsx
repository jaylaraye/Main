import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {Embers} from '../components/Embers';
import {Seal} from '../components/Seal';
import {bodyFont, brushFont, displayFont} from '../fonts';
import {BookTheme, INK, PARCHMENT} from '../theme';

export const BookScene: React.FC<{book: BookTheme; index: number}> = ({book, index}) => {
	const frame = useCurrentFrame();
	const {fps, width} = useVideoConfig();

	const labelIn = spring({frame: frame - 10, fps, config: {damping: 200}});
	const titleIn = spring({frame: frame - 22, fps, config: {damping: 16}});
	const stroke = interpolate(frame, [30, 60], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const drift = interpolate(frame, [0, 270], [40, -40]);

	return (
		<AbsoluteFill
			style={{
				background: `radial-gradient(circle at 28% 50%, ${book.bg} 0%, ${INK} 75%)`,
			}}
		>
			{/* Giant faded glyph drifting behind everything */}
			<AbsoluteFill
				style={{
					alignItems: 'flex-end',
					justifyContent: 'center',
					paddingRight: 40,
					fontFamily: brushFont,
					fontSize: 900,
					color: book.accent,
					opacity: 0.06,
					transform: `translateX(${drift}px)`,
				}}
			>
				{book.glyph}
			</AbsoluteFill>

			<Embers
				count={index === 1 ? 35 : 55}
				color={book.glow}
				seed={`book-${index}`}
				speed={index === 2 ? 1.6 : 1}
			/>

			<AbsoluteFill style={{flexDirection: 'row', alignItems: 'center', padding: '0 140px'}}>
				<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
					<Seal glyph={book.glyph} accent={book.accent} glow={book.glow} size={480} />
					<div
						style={{
							fontFamily: displayFont,
							fontSize: 30,
							letterSpacing: 10,
							color: book.glow,
							textTransform: 'uppercase',
							marginTop: 24,
							opacity: interpolate(frame, [50, 70], [0, 0.8], {
								extrapolateLeft: 'clamp',
								extrapolateRight: 'clamp',
							}),
						}}
					>
						{book.glyphMeaning}
					</div>
				</div>

				<div style={{marginLeft: 120, flex: 1}}>
					<div
						style={{
							fontFamily: displayFont,
							fontSize: 34,
							letterSpacing: 14,
							color: book.accent,
							textTransform: 'uppercase',
							opacity: labelIn,
							transform: `translateX(${(1 - labelIn) * -40}px)`,
						}}
					>
						{book.numeral} · {book.year}
					</div>
					<div
						style={{
							fontFamily: displayFont,
							fontWeight: 700,
							fontSize: 96,
							lineHeight: 1.05,
							color: PARCHMENT,
							marginTop: 12,
							opacity: titleIn,
							transform: `translateY(${(1 - titleIn) * 50}px)`,
							textShadow: `0 0 30px ${book.accent}88`,
						}}
					>
						{book.title}
					</div>
					{/* Brush stroke underline */}
					<svg width={width * 0.4} height={40} style={{marginTop: 8}}>
						<path
							d={`M 4 24 Q ${width * 0.1} 8 ${width * 0.2} 20 T ${width * 0.4 - 4} 16`}
							fill="none"
							stroke={book.accent}
							strokeWidth={8}
							strokeLinecap="round"
							pathLength={1}
							strokeDasharray={1}
							strokeDashoffset={1 - stroke}
						/>
					</svg>
					<div style={{marginTop: 30}}>
						{book.lines.map((line, i) => {
							const start = 70 + i * 45;
							const o = interpolate(frame, [start, start + 20], [0, 1], {
								extrapolateLeft: 'clamp',
								extrapolateRight: 'clamp',
							});
							const isLast = i === book.lines.length - 1;
							return (
								<div
									key={line}
									style={{
										fontFamily: bodyFont,
										fontSize: isLast ? 56 : 46,
										color: isLast ? book.glow : '#e9dcc6',
										opacity: o,
										transform: `translateY(${(1 - o) * 24}px)`,
										marginBottom: 18,
										filter: `blur(${(1 - o) * 6}px)`,
									}}
								>
									{line}
								</div>
							);
						})}
					</div>
				</div>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
