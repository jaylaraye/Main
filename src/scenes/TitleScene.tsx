import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {Embers} from '../components/Embers';
import {Poppy} from '../components/Poppy';
import {bodyFont, brushFont, displayFont} from '../fonts';
import {INK, PARCHMENT} from '../theme';

export const TitleScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const titleIn = spring({frame: frame - 45, fps, config: {damping: 200}});
	const letterSpacing = interpolate(titleIn, [0, 1], [60, 18]);
	const subtitleIn = interpolate(frame, [80, 110], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const glyphOpacity = interpolate(frame, [0, 40], [0, 0.12], {
		extrapolateRight: 'clamp',
	});
	const zoom = interpolate(frame, [0, 180], [1, 1.08]);

	return (
		<AbsoluteFill
			style={{
				background: `radial-gradient(circle at 50% 45%, #3b0808 0%, ${INK} 65%)`,
			}}
		>
			<AbsoluteFill
				style={{
					alignItems: 'center',
					justifyContent: 'center',
					fontFamily: brushFont,
					fontSize: 620,
					color: '#c21d14',
					opacity: glyphOpacity,
					transform: `scale(${zoom})`,
					letterSpacing: -40,
				}}
			>
				罂粟
			</AbsoluteFill>
			<Embers count={70} seed="title" />
			<AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
				<div style={{marginTop: -260}}>
					<Poppy size={300} delay={5} />
				</div>
			</AbsoluteFill>
			<AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
				<div
					style={{
						marginTop: 260,
						fontFamily: displayFont,
						fontWeight: 700,
						fontSize: 120,
						color: PARCHMENT,
						letterSpacing,
						opacity: titleIn,
						textShadow: '0 0 40px rgba(255,90,40,0.6)',
						textTransform: 'uppercase',
					}}
				>
					The Poppy War
				</div>
				<div
					style={{
						fontFamily: bodyFont,
						fontSize: 44,
						color: '#e8b89a',
						opacity: subtitleIn,
						transform: `translateY(${(1 - subtitleIn) * 20}px)`,
						marginTop: 10,
					}}
				>
					a trilogy by R.F. Kuang
				</div>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
