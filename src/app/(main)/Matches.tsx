import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import Image from 'next/image'
import { ChampionshipMatches } from '@/lib/faceit'

export default function Matches({ matches }: { matches: ChampionshipMatches['items'] }) {
	const teams = ['faction1', 'faction2']
	return (
		<div className="w-full">
			<ul className="space-y-4">
				{matches.map((match) => (
					<li key={match.match_id} className="bg-muted rounded-lg p-4 shadow-md">
						<Link href={`/match/${match.match_id}`} key={match.match_id}>
							<div className="grid grid-cols-[1fr_auto_1fr] gap-4 items-center">
								<div className="flex items-center space-x-2">
									<Image
										src={match.teams[teams[0]].avatar || '/assets/ow.png'}
										alt={`logo`}
										width={100}
										height={100}
										className="w-10 h-10"
									/>
									<span className="font-semibold truncate">{match.teams[teams[0]].name}</span>
								</div>
								<div className="flex items-center space-x-2">
									<span
										className={`text-xl font-bold ${match.results.score[teams[0]] > match.results.score[teams[1]] ? 'text-green-500' : 'text-muted-foreground'}`}
									>
										{match.results.score[teams[0]]}
									</span>
									<span className="text-xl font-bold">-</span>
									<span
										className={`text-xl font-bold ${match.results.score[teams[1]] > match.results.score[teams[0]] ? 'text-green-500' : 'text-muted-foreground'}`}
									>
										{match.results.score[teams[1]]}
									</span>
								</div>
								<div className="flex items-center justify-end space-x-2">
									<span className="font-semibold truncate">{match.teams[teams[1]].name}</span>
									<img
										src={match.teams[teams[1]].avatar || '/assets/ow.png'}
										alt={`logo`}
										className="w-10 h-10"
									/>
								</div>
							</div>
							<div className="grid grid-cols-[1fr_auto_1fr] gap-4 items-center mt-2">
								<div className="flex items-center space-x-2">
									{match.status === 'ong' ? (
										<Badge className="pt-1">Live</Badge>
									) : match.status === 'upcoming' ? (
										<Badge variant={'outline'} className="p-0 pt-1">
											Upcoming
										</Badge>
									) : (
										<Badge variant={'secondary'} className="p-0 pt-1">
											Finished
										</Badge>
									)}
								</div>
								<div className="flex items-center space-x-2">
									<span className="text-muted-foreground text-sm">
										{/* Wed Aug 14, 10:00:00 */}
										{new Date(match.finished_at * 1000).toLocaleString('en-US', {
											weekday: 'short',
											month: 'short',
											day: 'numeric',
											hour: '2-digit',
											minute: '2-digit',
											hour12: true
										})}
									</span>
								</div>
								<div className="flex items-center justify-end space-x-2">
									<Badge variant={'secondary'} className="p-0 pt-1">
										{match.competition_name}
									</Badge>
								</div>
							</div>
						</Link>
					</li>
				))}
			</ul>
		</div>
	)
}
