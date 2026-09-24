import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';

type Props = {
	size: number;
	delay?: number;
	color?: string;
	rotate?: number;
	sway?: number;
};

const PETAL =
	'M 0 0 C -38 -18 -62 -70 -44 -108 C -30 -136 -8 -128 0 -118 C 8 -128 30 -136 44 -108 C 62 -70 38 -18 0 0 Z';

// A poppy that blooms open: petals unfold, then the dark heart appears.
export const Poppy: React.FC<Props> = ({
	size,
	delay = 0,
	color = '#d7261e',
	rotate = 0,
	sway = 4,
}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const bloom = spring({
		frame: frame - delay,
		fps,
		config: {damping: 14, mass: 1.2},
		durationInFrames: 50,
	});
	const heart = spring({frame: frame - delay - 20, fps, config: {damping: 12}});
	const breathe = Math.sin((frame + delay) / 22) * sway;

	const petals = [0, 72, 144, 216, 288];
	return (
		<svg
			width={size}
			height={size}
			viewBox="-150 -150 300 300"
			style={{overflow: 'visible', transform: `rotate(${rotate + breathe}deg)`}}
		>
			<defs>
				<radialGradient id={`petal-${color}`} cx="0.5" cy="1" r="1">
					<stop offset="0%" stopColor="#1a0303" />
					<stop offset="22%" stopColor={color} />
					<stop offset="100%" stopColor="#ff5a3c" />
				</radialGradient>
			</defs>
			{petals.map((angle, i) => {
				const open = interpolate(bloom, [0, 1], [0.05, 1]);
				const spread = interpolate(bloom, [0, 1], [0, angle]);
				return (
					<path
						key={angle}
						d={PETAL}
						fill={`url(#petal-${color})`}
						stroke="#3a0505"
						strokeWidth={1.5}
						opacity={0.92}
						transform={`rotate(${spread + i * 3}) scale(${open * (1 - i * 0.03)})`}
					/>
				);
			})}
			<g transform={`scale(${heart})`}>
				<circle r={26} fill="#120606" />
				{new Array(16).fill(null).map((_, i) => {
					const a = (i / 16) * Math.PI * 2;
					return (
						<circle
							key={i}
							cx={Math.cos(a) * 30}
							cy={Math.sin(a) * 30}
							r={3.5}
							fill="#1c0b05"
						/>
					);
				})}
				<circle r={12} fill="#3d4a2a" />
			</g>
		</svg>
	);
};
