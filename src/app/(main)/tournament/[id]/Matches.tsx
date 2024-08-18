import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import Image from 'next/image'
import { ChampionshipMatches } from '@/lib/faceit'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'

export default function Matches({ matches }: { matches: ChampionshipMatches['items'] }) {
	const teams = ['faction1', 'faction2']
	return (
		<div className="w-full">
			<ul className="space-y-4">
				{matches.map((match) => (
					<li key={match.match_id} className="bg-muted rounded-lg md:p-3 p-4 shadow-md">
						<Link href={`/match/${match.match_id}`} key={match.match_id}>
							<div className="flex flex-col md:grid md:grid-cols-[auto_1fr_auto_1fr_auto] md:gap-2 gap-4 items-center">
								{teams.map((team, index) => (
									<>
										{index === 0 && (
											<Avatar className="md:w-8 md:h-8 w-10 h-10">
												<AvatarImage
													src={match.teams[team].avatar || '/assets/ow.png'}
													alt={`logo`}
													width={40}
													height={40}
												/>
												<AvatarFallback>
													<Image src="/assets/ow.png" alt="OW logo" width={40} height={40} />
												</AvatarFallback>
											</Avatar>
										)}
										<div
											className={`md:gap-2 gap-4 flex flex-col md:flex-row items-center ${index === 1 ? 'flex-row-reverse md:justify-end' : ''}`}
										>
											<span
												className={`font-semibold truncate ${index === 1 ? 'md:text-right' : ''}`}
											>
												{match.teams[team].name}
											</span>
											{index === 1 && (
												<Avatar className="md:w-8 md:h-8 w-10 h-10">
													<AvatarImage
														src={match.teams[team].avatar || '/assets/ow.png'}
														alt={`logo`}
														width={40}
														height={40}
													/>
													<AvatarFallback>
														<Image
															src="/assets/ow.png"
															alt="OW logo"
															width={40}
															height={40}
														/>
													</AvatarFallback>
												</Avatar>
											)}
										</div>
										{index === 0 && (
											<div className="flex items-center space-x-2 col-span-1">
												{teams.map((scoreTeam, scoreIndex) => (
													<span
														key={scoreTeam}
														className={`text-xl font-bold ${
															match.results.score[scoreTeam] >
															match.results.score[teams[1 - scoreIndex]]
																? 'text-green-500'
																: 'text-muted-foreground'
														}`}
													>
														{match.results.score[scoreTeam]}
														{scoreIndex === 0 && <span className="ml-1">{' - '}</span>}
													</span>
												))}
											</div>
										)}
									</>
								))}
							</div>
							<div className="md:hidden flex flex-wrap justify-between items-center mt-2 text-sm">
								<div className="flex items-center space-x-2">
									<Badge
										variant={
											match.status === 'ong'
												? 'default'
												: match.status === 'upcoming'
													? 'outline'
													: 'secondary'
										}
										className="pt-1"
									>
										{match.status === 'ongoing'
											? 'Live'
											: match.status === 'upcoming'
												? 'Upcoming'
												: 'Finished'}
									</Badge>
								</div>
								<Badge variant={'outline'} className="pt-1 md:mt-1 mt-0">
									{new Date(match.finished_at * 1000).toLocaleString('en-US', {
										weekday: 'short',
										month: 'short',
										day: 'numeric',
										hour: '2-digit',
										minute: '2-digit',
										hour12: true
									})}
								</Badge>
								<Badge variant={'secondary'} className="pt-1 md:mt-1 mt-0">
									{match.competition_name}
								</Badge>
							</div>
							<div className="hidden md:flex flex-wrap justify-center items-center mt-2 text-sm w-full">
								<Badge
									variant={
										match.status === 'ongoing'
											? 'default'
											: match.status === 'upcoming'
												? 'outline'
												: 'secondary'
									}
									className="pt-1 w-1/3 justify-start"
								>
									{match.status === 'ongoing'
										? 'Live'
										: match.status === 'upcoming'
											? 'Upcoming'
											: 'Finished'}
								</Badge>
								<Badge variant={'outline'} className="pt-1 w-1/3 justify-center">
									{new Date(match.finished_at * 1000).toLocaleString('en-US', {
										weekday: 'short',
										month: 'short',
										day: 'numeric',
										hour: '2-digit',
										minute: '2-digit',
										hour12: true
									})}
								</Badge>
								<Badge variant={'secondary'} className="pt-1 w-1/3 justify-end">
									{match.competition_name}
								</Badge>
							</div>
						</Link>
					</li>
				))}
			</ul>
		</div>
	)
}
