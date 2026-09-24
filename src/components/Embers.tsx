import {AbsoluteFill, random, useCurrentFrame, useVideoConfig} from 'remotion';

type Props = {
	count?: number;
	color?: string;
	seed?: string;
	speed?: number;
};

// Glowing sparks drifting upward, looping forever. Deterministic per seed.
export const Embers: React.FC<Props> = ({
	count = 60,
	color = '#ff7a3d',
	seed = 'embers',
	speed = 1,
}) => {
	const frame = useCurrentFrame();
	const {width, height} = useVideoConfig();

	return (
		<AbsoluteFill style={{pointerEvents: 'none'}}>
			{new Array(count).fill(null).map((_, i) => {
				const r = (k: string) => random(`${seed}-${i}-${k}`);
				const size = 2 + r('size') * 6;
				const lifetime = 120 + r('life') * 180;
				const t = ((frame * speed + r('offset') * lifetime) % lifetime) / lifetime;
				const x =
					r('x') * width +
					Math.sin((frame / 30) * (0.5 + r('wobble')) + i) * 30 * r('amp');
				const y = height + 40 - t * (height + 120);
				const opacity = Math.sin(t * Math.PI) * (0.4 + r('alpha') * 0.6);
				return (
					<div
						key={i}
						style={{
							position: 'absolute',
							left: x,
							top: y,
							width: size,
							height: size,
							borderRadius: '50%',
							background: color,
							opacity,
							boxShadow: `0 0 ${size * 3}px ${size}px ${color}`,
						}}
					/>
				);
			})}
		</AbsoluteFill>
	);
};
