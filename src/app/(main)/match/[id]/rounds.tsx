'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { MatchDetails, MatchStats } from '@/lib/faceit'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { Checkbox } from '@/components/ui/checkbox'
import { useSearchParams, useRouter } from 'next/navigation'
import { Label } from '@/components/ui/label'

const teams = ['faction1', 'faction2']

export default function Rounds({ match }: { match: { details: MatchDetails; stats: MatchStats } }) {
	const searchParams = useSearchParams()
	const router = useRouter()
	const [activeRound, setActiveRound] = useState(1)
	const [showFaceitNames, setShowFaceitNames] = useState(
		searchParams.get('showFaceit') ? searchParams.get('showFaceit') === 'true' : false
	)
	const maps = match.details.voting.map.entities.filter((map) => match.details.voting.map.pick.includes(map.guid))
	const roundStats = match.stats.rounds.map((round) => round.round_stats)

	useEffect(() => {
		const roundParam = searchParams.get('round')
		if (roundParam) {
			const round = parseInt(roundParam)
			if (round >= 1 && round <= match.stats.rounds.length) {
				setActiveRound(round)
			} else {
				handleRoundChange(1)
			}
		} else {
			handleRoundChange(1)
		}
	}, [searchParams, match.stats.rounds.length])

	useEffect(() => {
		const params = new URLSearchParams(searchParams)
		params.set('showFaceit', showFaceitNames.toString())
		router.replace(`?${params.toString()}`)
	}, [showFaceitNames, router, searchParams])

	const stats = match.stats.rounds.map((round) =>
		round.teams.flatMap((team) =>
			team.players
				.map((player) => {
					const faction =
						team.team_stats.Team === match.details?.teams['faction1']?.name ? 'faction1' : 'faction2'
					const rosterIndex = match.details.teams[faction].roster?.findIndex(
						(p) => p.nickname === player.nickname
					)
					return {
						...player,
						team: team.team_stats.Team,
						ign: match.details.teams?.[faction]?.roster?.[rosterIndex]?.game_player_name || player.nickname
					}
				})
				.sort((a, b) => {
					const roleOrder = { Tank: 1, Damage: 2, Support: 3 }
					return roleOrder[a.player_stats.Role] - roleOrder[b.player_stats.Role]
				})
		)
	)

	const handleRoundChange = (round: number) => {
		setActiveRound(round)
		const params = new URLSearchParams(searchParams)
		params.set('round', round.toString())
		router.replace(`?${params.toString()}`)
	}

	const handleShowFaceitNamesChange = (checked: boolean) => {
		setShowFaceitNames(checked)
	}

	return (
		<Tabs value={`round-${activeRound}`}>
			<div className="mb-4 flex flex-col md:flex-row justify-between md:items-center space-y-4 md:space-y-0">
				<TabsList className="space-x-2 justify-start w-auto">
					<span className="text-sm font-semibold mr-2">Round</span>
					{match.stats.rounds.map((round, index) => (
						<TabsTrigger
							key={index}
							value={`round-${index + 1}`}
							onClick={() => handleRoundChange(index + 1)}
							className={'data-[state=active]:bg-primary data-[state=active]:text-primary-foreground'}
						>
							{`${index + 1}`}
						</TabsTrigger>
					))}
				</TabsList>
				<div className="flex items-center space-x-2">
					<Checkbox
						id="showFaceitNames"
						checked={showFaceitNames}
						onCheckedChange={handleShowFaceitNamesChange}
					/>
					<Label htmlFor="showFaceitNames">Faceit IDs</Label>
				</div>
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
									: 'text-red-500'
							)}
						>
							{match.details.detailed_results[activeRound - 1].winner === teams[0] ? 'Win' : 'Loss'}
						</span>
						<span className="mx-2 text-muted-foreground">|</span>
						Score: {match.stats.rounds[activeRound - 1].teams[0].team_stats['Team Score']}
					</h2>
				</div>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className="w-1/8 min-w-[150px] max-w-[150px]">Player</TableHead>
							<TableHead className="w-1/8 min-w-[100px] max-w-[150px]">Role</TableHead>
							<TableHead className="w-1/8 min-w-[100px] max-w-[150px]">Eliminations</TableHead>
							<TableHead className="w-1/8 min-w-[100px] max-w-[150px]">Assists</TableHead>
							<TableHead className="w-1/8 min-w-[100px] max-w-[150px]">Deaths</TableHead>
							<TableHead className="w-1/8 min-w-[100px] max-w-[150px]">Damage</TableHead>
							<TableHead className="w-1/8 min-w-[100px] max-w-[150px]">Healing</TableHead>
							<TableHead className="w-1/8 min-w-[100px] max-w-[150px]">KD</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{stats[activeRound - 1]
							.filter((player) => player.team === match.details.teams[teams[0]].name)
							.map((player) => (
								<TableRow key={player.player_id}>
									<TableCell className="w-1/7 min-w-[100px] max-w-[150px]">
										{showFaceitNames ? player.nickname : player.ign}
									</TableCell>
									<TableCell className="w-1/7 min-w-[100px] max-w-[150px]">
										{player.player_stats.Role}
									</TableCell>
									<TableCell className="w-1/7 min-w-[100px] max-w-[150px]">
										{player.player_stats['Eliminations']}
									</TableCell>
									<TableCell className="w-1/7 min-w-[100px] max-w-[150px]">
										{player.player_stats['Assists']}
									</TableCell>
									<TableCell className="w-1/7 min-w-[100px] max-w-[150px]">
										{player.player_stats['Deaths']}
									</TableCell>
									<TableCell className="w-1/7 min-w-[100px] max-w-[150px]">
										{player.player_stats['Damage Dealt']}
									</TableCell>
									<TableCell className="w-1/7 min-w-[100px] max-w-[150px]">
										{player.player_stats['Healing Done']}
									</TableCell>
									<TableCell className="w-1/7 min-w-[100px] max-w-[150px]">
										{player.player_stats['K/D Ratio']}
									</TableCell>
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
									: 'text-red-500'
							)}
						>
							{match.details.detailed_results[activeRound - 1].winner === teams[1] ? 'Win' : 'Loss'}
						</span>
						<span className="mx-2 text-muted-foreground">|</span>
						Score: {match.stats.rounds[activeRound - 1].teams[1].team_stats['Team Score']}
					</h2>
				</div>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className="w-1/8 min-w-[150px] max-w-[150px]">Player</TableHead>
							<TableHead className="w-1/8 min-w-[100px] max-w-[150px]">Role</TableHead>
							<TableHead className="w-1/8 min-w-[100px] max-w-[150px]">Eliminations</TableHead>
							<TableHead className="w-1/8 min-w-[100px] max-w-[150px]">Assists</TableHead>
							<TableHead className="w-1/8 min-w-[100px] max-w-[150px]">Deaths</TableHead>
							<TableHead className="w-1/8 min-w-[100px] max-w-[150px]">Damage</TableHead>
							<TableHead className="w-1/8 min-w-[100px] max-w-[150px]">Healing</TableHead>
							<TableHead className="w-1/8 min-w-[100px] max-w-[150px]">KD</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{stats[activeRound - 1]
							.filter((player) => player.team === match.details.teams[teams[1]].name)
							.map((player) => (
								<TableRow key={player.player_id}>
									<TableCell className="w-1/7 min-w-[100px] max-w-[150px]">
										{showFaceitNames ? player.nickname : player.ign}
									</TableCell>
									<TableCell className="w-1/7 min-w-[100px] max-w-[150px]">
										{player.player_stats.Role}
									</TableCell>
									<TableCell className="w-1/7 min-w-[100px] max-w-[150px]">
										{player.player_stats['Eliminations']}
									</TableCell>
									<TableCell className="w-1/7 min-w-[100px] max-w-[150px]">
										{player.player_stats['Assists']}
									</TableCell>
									<TableCell className="w-1/7 min-w-[100px] max-w-[150px]">
										{player.player_stats['Deaths']}
									</TableCell>
									<TableCell className="w-1/7 min-w-[100px] max-w-[150px]">
										{player.player_stats['Damage Dealt']}
									</TableCell>
									<TableCell className="w-1/7 min-w-[100px] max-w-[150px]">
										{player.player_stats['Healing Done']}
									</TableCell>
									<TableCell className="w-1/7 min-w-[100px] max-w-[150px]">
										{player.player_stats['K/D Ratio']}
									</TableCell>
								</TableRow>
							))}
					</TableBody>
				</Table>
			</div>
		</Tabs>
	)
}
