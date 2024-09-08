import { getMatch } from './actions'
import { Metadata } from 'next'

import MatchTabs from './tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import Image from 'next/image'

const teams = ['faction1', 'faction2']

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
	const match = await getMatch(params.id)
	const title = `${match.details.teams.faction1.name} vs ${match.details.teams.faction2.name}`
	const description = `Match overview for ${title}`

	return {
		title,
		description,
		openGraph: {
			title,
			description
		},
		twitter: {
			card: 'summary_large_image',
			title,
			description
		}
	}
}

export default async function MatchPage({ params }: { params: { id: string } }) {
	const match = await getMatch(params.id)

	return (
		<div className="container mx-auto my-4">
			<div className="flex flex-col md:flex-row items-center mb-6 w-full justify-between">
				<div className="flex flex-col md:flex-row items-center gap-4 mb-4 md:mb-0 md:mr-4">
					<Avatar className="md:w-8 md:h-8 w-10 h-10">
						<AvatarImage
							src={match.details.teams[teams[0]].avatar || '/assets/ow.png'}
							alt={`logo`}
							width={40}
							height={40}
						/>
						<AvatarFallback>
							<Image src="/assets/ow.png" alt="OW logo" width={40} height={40} />
						</AvatarFallback>
					</Avatar>
					<div className="text-center md:text-left">
						<h2 className="text-xl font-bold">{match.details.teams[teams[0]].name}</h2>
						<p className="text-3xl font-bold text-green-500">{match.details.results.score[teams[0]]}</p>
					</div>
				</div>
				<div className="text-center mb-4 md:mb-0 md:mx-4 space-y-2">
					<p className="text-sm text-muted-foreground">
						{new Date(match.details.started_at * 1000).toLocaleString('en-US', {
							weekday: 'short',
							month: 'short',
							day: 'numeric',
							hour: '2-digit',
							minute: '2-digit',
							hour12: true
						})}
					</p>
					<p className="text-sm font-medium">{match.details.competition_name}</p>
				</div>
				<div className="flex flex-col md:flex-row items-center gap-4">
					<div className="text-center md:text-right">
						<h2 className="text-xl font-bold">{match.details.teams[teams[1]].name}</h2>
						<p className="text-3xl font-bold text-muted-foreground">
							{match.details.results.score[teams[1]]}
						</p>
					</div>
					<Avatar className="md:w-8 md:h-8 w-10 h-10">
						<AvatarImage
							src={match.details.teams[teams[1]].avatar || '/assets/ow.png'}
							alt={`logo`}
							width={40}
							height={40}
						/>
						<AvatarFallback>
							<Image src="/assets/ow.png" alt="OW logo" width={40} height={40} />
						</AvatarFallback>
					</Avatar>
				</div>
			</div>

			<MatchTabs match={match} />
		</div>
	)
}
