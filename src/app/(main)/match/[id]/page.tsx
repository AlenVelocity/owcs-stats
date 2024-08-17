import { getMatch } from './actions'
import Rounds from './rounds'
import Overview from './overview'
import MatchTabs from './tabs'

const teams = ['faction1', 'faction2']

export const generateMetadata = async ({ params }: { params: { id: string } }) => {
	const match = await getMatch(params.id)
	return {
		title: `${match.details.teams[teams[0]].name} vs ${match.details.teams[teams[1]].name}`
	}
}

export default async function MatchPage({ params }: { params: { id: string } }) {
	const match = await getMatch(params.id)

	return (
		<div className="container mx-auto my-4">
			<div className="flex flex-col md:flex-row items-center mb-6 w-full justify-between">
				<div className="flex flex-col md:flex-row items-center gap-4 mb-4 md:mb-0 md:mr-4">
					<img src={match.details.teams[teams[0]].avatar} alt={`logo`} className="w-16 h-16" />
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
					<img
						src={match.details.teams[teams[1]].avatar || '/assets/ow.png'}
						alt={`logo`}
						className="w-16 h-16"
					/>
				</div>
			</div>

			<MatchTabs match={match} />
		</div>
	)
}
