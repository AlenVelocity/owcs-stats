import { ImageResponse } from 'next/og'
import { getMatch } from './actions'

const WIDTH = 1200
const HEIGHT = 630

function load(filename: string) {
	return fetch(`https://owcs.alen.fyi/${filename}`).then((res) => res.arrayBuffer())
}

const charVariants = {
	// https://github.com/rsms/inter/blob/master/src/features/cv02-four.fea
	'\u0034': '\uE06E',
	'\uE075': '\uE07E',
	'\uE142': '\uE14B',
	'\u2783': '\uE12E',

	// https://github.com/rsms/inter/blob/master/src/features/cv03-six.fea
	'\u0036': '\uE06F',
	'\uE077': '\uE07F',
	'\uE144': '\uE14C',
	'\u2785': '\uE12F',

	// https://github.com/rsms/inter/blob/master/src/features/cv04-nine.fea
	'\u0039': '\uE070',
	'\uE07A': '\uE080',
	'\uE147': '\uE14D',
	'\u2788': '\uE130',

	// https://github.com/rsms/inter/blob/master/src/features/cv11-single-storey-a.fea
	'\u0061': '\uE02C',
	'\u00E1': '\uE02D',
	'\u0103': '\uE02E',
	'\u1EAF': '\uE02F',
	'\u1EB7': '\uE030',
	'\u1EB1': '\uE031',
	'\u1EB3': '\uE032',
	'\u1EB5': '\uE033',
	'\u01CE': '\uE034',
	'\u00E2': '\uE035',
	'\u1EA5': '\uE036',
	'\u1EAD': '\uE037',
	'\u1EA7': '\uE038',
	'\u1EA9': '\uE039',
	'\u1EAB': '\uE03A',
	'\u0201': '\uE03B',
	'\u00E4': '\uE03C',
	'\u01DF': '\uE03D',
	'\u0227': '\uE03E',
	'\u1EA1': '\uE03F',
	'\u01E1': '\uE040',
	'\u00E0': '\uE041',
	'\u1EA3': '\uE042',
	'\u0203': '\uE043',
	'\u0101': '\uE044',
	'\u0105': '\uE045',
	'\u1E9A': '\uE046',
	'\u00E5': '\uE047',
	'\u01FB': '\uE048',
	'\u1E01': '\uE049',
	'\u00E3': '\uE04A',
	'\u0430': '\uE02C'
}

function t(text: string) {
	let newText = ''
	for (let i = 0; i < text.length; i++) {
		let char = text[i]
		newText += charVariants[char as keyof typeof charVariants] ?? char
	}
	return newText
}

export default async function Image({ params }: { params: { id: string } }) {
	let interMedium = await load('Inter-Medium.otf')
	let interSemiBold = await load('Inter-SemiBold.otf')
	let interExtraBold = await load('Inter-ExtraBold.otf')
	let bgImage = await load('og-bg.png').then((buf) => Buffer.from(buf).toString('base64'))

	const match = await getMatch(params.id)

	const title = `${match.details.teams.faction1.name} vs ${match.details.teams.faction2.name}`
	const description = `OWCS Match Overview for ${title}`

	let imageResponse = new ImageResponse(
		(
			<div tw="flex">
				<img
					src={`data:image/png;base64,${bgImage}`}
					alt=""
					width={WIDTH}
					height={HEIGHT}
					style={{ width: '100%', height: HEIGHT }}
				/>
				<div tw="absolute flex flex-col justify-between p-24 w-full h-full">
					<div tw="h-30"></div>
					<div tw="flex flex-col">
						<div tw="flex text-orange-500 text-[28px] leading-[48px] font-semibold">
							{t(match.details.competition_name)}
						</div>
						<div tw="mt-4 flex text-slate-900 text-[72px] leading-[80px] tracking-tight font-extrabold">
							{t(title)}
						</div>
						<div tw="mt-4 flex text-slate-500 text-[32px] leading-[56px] font-medium">
							{description.split(' ').length > 2 ? (
								<div tw="flex">
									{t(description.split(' ').slice(0, -1).join(' '))}
									&nbsp;
									{t(description.split(' ').at(-1) ?? '')}
								</div>
							) : (
								<div tw="flex">{t(description)}</div>
							)}
						</div>
					</div>
				</div>
			</div>
		),
		{
			width: WIDTH,
			height: HEIGHT,
			fonts: [
				{ name: 'Inter', data: interMedium, weight: 500 },
				{ name: 'Inter', data: interSemiBold, weight: 600 },
				{ name: 'Inter', data: interExtraBold, weight: 800 }
			]
		}
	)

	return imageResponse
}
