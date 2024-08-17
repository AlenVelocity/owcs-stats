'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { MatchDetails, MatchStats } from '@/lib/faceit'
import Image from 'next/image'
import { cn } from '@/lib/utils'

const teams = ['faction1', 'faction2']

export default function Rounds({ match }: { match: { details: MatchDetails; stats: MatchStats } }) {
	const [activeRound, setActiveRound] = useState(1)
	const maps = match.details.voting.map.entities.filter((map) => match.details.voting.map.pick.includes(map.guid))
	const roundStats = match.stats.rounds.map((round) => round.round_stats)

	const stats = match.stats.rounds.map((round) =>
		round.teams.flatMap((team) =>
			team.players.map((player) => ({
				...player,
				team: team.team_stats.Team
			}))
		)
	)

	return (
		<Tabs defaultValue={`round-${activeRound}`}>
			<div className="mb-4">
				<TabsList className="space-x-2">
					<span className="text-sm font-semibold mr-2">Round</span>
					{match.stats.rounds.map((round, index) => (
						<TabsTrigger
							key={index}
							value={`round-${index + 1}`}
							onClick={() => setActiveRound(index + 1)}
							className={'data-[state=active]:bg-primary data-[state=active]:text-primary-foreground'}
						>
							{`${index + 1}`}
						</TabsTrigger>
					))}
				</TabsList>
			</div>
			<div className="space-y-4">
				<div className="max-h-1/2 my-4">
					<div className="grid grid-cols-2 md:grid-cols-6 gap-4">
						<Card>
							<CardContent className="p-4">
								<h2 className="text-lg font-semibold text-center">Winner</h2>

								<div className="flex flex-col items-center justify-center h-[150px]">
									<Image
										src={
											match.details.teams[match.details.detailed_results[activeRound - 1].winner]
												.avatar || '/assets/ow.png'
										}
										alt={
											match.details.teams[match.details.detailed_results[activeRound - 1].winner]
												.name
										}
										width={100}
										height={100}
										className="rounded-lg"
									/>
								</div>
								<h2 className="text-lg font-semibold mb-2 text-center">
									{match.details.teams[match.details.detailed_results[activeRound - 1].winner].name}
								</h2>
							</CardContent>
						</Card>
						<Card>
							<CardContent className="p-4">
								<h2 className="text-lg font-semibold text-center">Map</h2>
								<div className="flex flex-col items-center justify-center h-[150px]">
									<Image
										src={maps[activeRound - 1].image_lg || '/assets/ow.png'}
										alt={maps[activeRound - 1].name}
										width={150}
										height={150}
										className="object-cover"
									/>
								</div>
								<h2 className="text-lg font-semibold mb-2 text-center">{maps[activeRound - 1].name}</h2>
							</CardContent>
						</Card>
					</div>
				</div>
				<div className="flex flex-row justify-between p-2 border-muted border-2 rounded-lg">
					<h2 className="text-lg font-semibold">{match.details.teams[teams[0]].name}</h2>
					<h2 className="text-lg font-semibold">
						<span
							className={cn(
								match.details.detailed_results[activeRound - 1].winner === teams[0]
									? 'text-green-500'
									: 'text-red-500',
								'mr-2'
							)}
						>
							{match.details.detailed_results[activeRound - 1].winner === teams[0] ? 'Win' : 'Loss'}
						</span>
						{match.stats.rounds[activeRound - 1].teams[0].team_stats['Team Score']}
						{' - '}
						{match.stats.rounds[activeRound - 1].teams[1].team_stats['Team Win']}
					</h2>
				</div>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Player</TableHead>
							<TableHead>Eliminations</TableHead>
							<TableHead>Assists</TableHead>

							<TableHead>Deaths</TableHead>
							<TableHead>Damage</TableHead>
							<TableHead>Healing</TableHead>
							<TableHead>KD</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{stats[activeRound - 1]
							.filter((player) => player.team === match.details.teams[teams[0]].name)
							.map((player) => (
								<TableRow key={player.player_id}>
									<TableCell>{player.nickname}</TableCell>
									<TableCell>{player.player_stats['Eliminations']}</TableCell>
									<TableCell>{player.player_stats['Assists']}</TableCell>
									<TableCell>{player.player_stats['Deaths']}</TableCell>
									<TableCell>{player.player_stats['Damage Dealt']}</TableCell>
									<TableCell>{player.player_stats['Healing Done']}</TableCell>
									<TableCell>{player.player_stats['K/D Ratio']}</TableCell>
								</TableRow>
							))}
					</TableBody>
				</Table>

				<div className="flex flex-row justify-between p-2 border-muted border-2 rounded-lg">
					<h2 className="text-lg font-semibold">{match.details.teams[teams[1]].name}</h2>
					<h2 className="text-lg font-semibold">
						<span
							className={cn(
								match.details.detailed_results[activeRound - 1].winner === teams[1]
									? 'text-green-500'
									: 'text-red-500',
								'mr-2'
							)}
						>
							{match.details.detailed_results[activeRound - 1].winner === teams[1] ? 'Win' : 'Loss'}
						</span>
						{match.stats.rounds[activeRound - 1].teams[1].team_stats['Team Score']}
						{' - '}
						{match.stats.rounds[activeRound - 1].teams[0].team_stats['Team Win']}
					</h2>
				</div>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Player</TableHead>
							<TableHead>Eliminations</TableHead>
							<TableHead>Assists</TableHead>
							<TableHead>Deaths</TableHead>
							<TableHead>Damage</TableHead>
							<TableHead>Healing</TableHead>
							<TableHead>KD</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{stats[activeRound - 1]
							.filter((player) => player.team === match.details.teams[teams[1]].name)
							.map((player) => (
								<TableRow key={player.player_id}>
									<TableCell>{player.nickname}</TableCell>
									<TableCell>{player.player_stats['Eliminations']}</TableCell>
									<TableCell>{player.player_stats['Assists']}</TableCell>
									<TableCell>{player.player_stats['Deaths']}</TableCell>
									<TableCell>{player.player_stats['Damage Dealt']}</TableCell>
									<TableCell>{player.player_stats['Healing Done']}</TableCell>
									<TableCell>{player.player_stats['K/D Ratio']}</TableCell>
								</TableRow>
							))}
					</TableBody>
				</Table>
			</div>
		</Tabs>
	)
}
