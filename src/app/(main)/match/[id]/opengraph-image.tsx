import { ImageResponse } from 'next/og'
import { join } from 'path'
import { readFile } from 'fs/promises'
import { getMatch } from './actions'

const WIDTH = 1200
const HEIGHT = 630

function load(filename: string) {
	return fetch(`${process.env.VERCEL_URL ?? 'http://localhost:3000'}/${filename}`).then((res) => res.arrayBuffer())
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
	let logo = (
		<svg viewBox="0 0 202 25" width="404">
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M20.832 0c-5.556 0-9.028 2.778-10.417 8.333 2.084-2.777 4.514-3.82 7.292-3.125 1.585.397 2.718 1.546 3.971 2.819 2.043 2.073 4.407 4.473 9.57 4.473 5.556 0 9.028-2.778 10.417-8.333-2.083 2.777-4.514 3.819-7.291 3.125-1.585-.397-2.718-1.546-3.972-2.82C28.359 2.4 25.995 0 20.832 0ZM10.417 12.5C4.86 12.5 1.389 15.276 0 20.832c2.083-2.778 4.514-3.82 7.292-3.125 1.584.396 2.717 1.546 3.971 2.818C13.306 22.6 15.67 25 20.833 25c5.556 0 9.028-2.777 10.417-8.333-2.084 2.778-4.514 3.82-7.292 3.125-1.585-.396-2.717-1.546-3.971-2.819-2.043-2.073-4.407-4.473-9.57-4.473Z"
				fill="#0EA5E9"
			/>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M62.5 10.528h-3.636v7.037c0 1.876 1.232 1.847 3.636 1.73v2.844c-4.867.586-6.803-.762-6.803-4.574v-7.037H53v-3.05h2.697V3.54l3.167-.938v4.877H62.5v3.049ZM76.363 7.48h3.166v14.66h-3.166V20.03c-1.114 1.554-2.844 2.492-5.131 2.492-3.988 0-7.301-3.372-7.301-7.711 0-4.369 3.313-7.711 7.3-7.711 2.288 0 4.018.938 5.132 2.462V7.48ZM71.728 19.5c2.639 0 4.632-1.964 4.632-4.691s-1.993-4.691-4.632-4.691c-2.64 0-4.633 1.964-4.633 4.691s1.994 4.691 4.633 4.691ZM84.804 5.28c-1.114 0-2.023-.938-2.023-2.023 0-1.114.909-2.023 2.023-2.023s2.023.909 2.023 2.023c0 1.085-.909 2.023-2.023 2.023ZM83.22 22.14V7.478h3.167v14.66H83.22Zm6.835 0V.736h3.166V22.14h-3.166ZM113.772 7.48h3.343l-4.604 14.66h-3.108l-3.049-9.88-3.079 9.88h-3.108L95.564 7.48h3.343l2.844 10.116 3.078-10.116h3.02l3.05 10.116 2.873-10.116Zm7.27-2.199c-1.114 0-2.023-.938-2.023-2.023 0-1.114.909-2.023 2.023-2.023s2.023.909 2.023 2.023c0 1.085-.909 2.023-2.023 2.023Zm-1.58 16.86V7.478h3.167v14.66h-3.167Zm14.544-15.041c3.284 0 5.63 2.228 5.63 6.04v9.001h-3.167v-8.679c0-2.228-1.29-3.401-3.284-3.401-2.082 0-3.724 1.231-3.724 4.222v7.858h-3.166V7.48h3.166v1.876c.968-1.524 2.551-2.257 4.545-2.257Zm20.639-5.483h3.166v20.525h-3.166V20.03c-1.114 1.554-2.844 2.492-5.131 2.492-3.988 0-7.301-3.372-7.301-7.711 0-4.37 3.313-7.712 7.301-7.712 2.287 0 4.017.939 5.131 2.463V1.616Zm-4.633 17.885c2.639 0 4.633-1.964 4.633-4.691s-1.994-4.691-4.633-4.691c-2.639 0-4.633 1.964-4.633 4.691s1.994 4.691 4.633 4.691Zm18.411 3.02c-4.427 0-7.74-3.372-7.74-7.711 0-4.369 3.313-7.711 7.74-7.711 2.874 0 5.366 1.495 6.539 3.782l-2.727 1.583c-.645-1.378-2.082-2.258-3.841-2.258-2.58 0-4.545 1.965-4.545 4.604 0 2.639 1.965 4.603 4.545 4.603 1.759 0 3.196-.909 3.9-2.258l2.727 1.554c-1.232 2.317-3.724 3.812-6.598 3.812Zm11.82-10.995c0 2.668 7.888 1.056 7.888 6.48 0 2.932-2.551 4.515-5.718 4.515-2.932 0-5.043-1.32-5.981-3.43l2.727-1.584c.469 1.32 1.642 2.111 3.254 2.111 1.408 0 2.492-.469 2.492-1.641 0-2.61-7.887-1.144-7.887-6.392 0-2.757 2.375-4.486 5.366-4.486 2.404 0 4.398 1.114 5.424 3.049l-2.668 1.495c-.528-1.143-1.554-1.671-2.756-1.671-1.144 0-2.141.498-2.141 1.554Zm13.517 0c0 2.668 7.887 1.056 7.887 6.48 0 2.932-2.551 4.515-5.717 4.515-2.932 0-5.043-1.32-5.982-3.43l2.727-1.584c.469 1.32 1.642 2.111 3.255 2.111 1.407 0 2.492-.469 2.492-1.641 0-2.61-7.887-1.144-7.887-6.392 0-2.757 2.375-4.486 5.366-4.486 2.404 0 4.398 1.114 5.424 3.049l-2.668 1.495c-.528-1.143-1.554-1.671-2.756-1.671-1.144 0-2.141.498-2.141 1.554Z"
				fill="#111827"
			/>
		</svg>
	)

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
