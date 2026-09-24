import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {brushFont} from '../fonts';

type Props = {
	glyph: string;
	accent: string;
	glow: string;
	size: number;
	delay?: number;
};

// A brush-painted glyph inside a ring that draws itself, like a seal stamp.
export const Seal: React.FC<Props> = ({glyph, accent, glow, size, delay = 0}) => {
	const frame = useCurrentFrame() - delay;
	const {fps} = useVideoConfig();

	const ring = interpolate(frame, [0, 40], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const stamp = spring({frame: frame - 18, fps, config: {damping: 9, mass: 0.8}});
	const reveal = interpolate(frame, [18, 48], [0, 100], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const pulse = 0.6 + Math.sin(frame / 10) * 0.25;
	const circumference = 2 * Math.PI * 140;

	return (
		<div style={{position: 'relative', width: size, height: size}}>
			<svg width={size} height={size} viewBox="-160 -160 320 320" style={{position: 'absolute', overflow: 'visible'}}>
				<circle
					r={140}
					fill="none"
					stroke={accent}
					strokeWidth={6}
					strokeLinecap="round"
					strokeDasharray={circumference}
					strokeDashoffset={circumference * (1 - ring)}
					transform="rotate(-90)"
					style={{filter: `drop-shadow(0 0 12px ${glow})`}}
				/>
				<circle
					r={124}
					fill="none"
					stroke={accent}
					strokeOpacity={0.35}
					strokeWidth={2}
					strokeDasharray="4 10"
					transform={`rotate(${frame * 0.4})`}
				/>
			</svg>
			<div
				style={{
					position: 'absolute',
					// Oversized box so the glow isn't cut off at the element's edges
					inset: -size * 0.3,
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					fontFamily: brushFont,
					fontSize: size * 0.56,
					color: accent,
					transform: `scale(${interpolate(stamp, [0, 1], [1.6, 1])})`,
					opacity: stamp > 0 ? 1 : 0,
					clipPath: reveal < 100 ? `inset(0 0 ${100 - reveal}% 0)` : 'none',
					textShadow: `0 0 ${30 * pulse}px ${glow}, 0 0 ${80 * pulse}px ${glow}`,
					lineHeight: 1,
				}}
			>
				{glyph}
			</div>
		</div>
	);
};
