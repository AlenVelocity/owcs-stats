'use client'

import { useState, useEffect } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { MatchDetails, MatchStats } from '@/lib/faceit'
import { useSearchParams, useRouter } from 'next/navigation'
import { useMemo } from 'react'

type OverallStats = {
	nickname: string
	ign: string
	team: string
	role: string
	eliminations: number
	assists: number
	deaths: number
	damage: number
	healing: number
	mitigation: number
	kd: number
	roundsPlayed: number
}

const roleOrder = { Tank: 1, Damage: 2, Support: 3 }

export default function Overview({ match }: { match: { details: MatchDetails; stats: MatchStats } }) {
	const searchParams = useSearchParams()
	const router = useRouter()
	const [groupBy, setGroupBy] = useState<'none' | 'team'>((searchParams.get('groupBy') as 'none' | 'team') || 'team')
	const [showFaceitNames, setShowFaceitNames] = useState(searchParams.get('showFaceit') === 'true')
	const [sortColumn, setSortColumn] = useState<string>(searchParams.get('sortColumn') || 'role')
	const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>(
		(searchParams.get('sortDirection') as 'asc' | 'desc') || 'asc'
	)

	useEffect(() => {
		const params = new URLSearchParams(searchParams)
		params.set('groupBy', groupBy)
		params.set('showFaceit', showFaceitNames.toString())
		params.set('sortColumn', sortColumn)
		params.set('sortDirection', sortDirection)
		router.replace(`?${params.toString()}`)
	}, [groupBy, showFaceitNames, sortColumn, sortDirection, router, searchParams])

	const handleGroupByChange = (value: string) => {
		setGroupBy(value as 'none' | 'team')
	}

	const handleShowFaceitNamesChange = (checked: boolean) => {
		setShowFaceitNames(checked)
	}

	const handleSort = (column: string) => {
		if (column === sortColumn) {
			setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
		} else {
			setSortColumn(column)
			setSortDirection('desc')
		}
	}

	const overallStats = useMemo(() => {
		let stats = match.stats.rounds
			.reduce(
				(acc, round) => {
					return round.teams.reduce((teamAcc, team) => {
						return team.players.reduce((playerAcc, player) => {
							const existingPlayer = playerAcc.find((p) => p.nickname === player.nickname)
							if (existingPlayer) {
								existingPlayer.eliminations += parseInt(player.player_stats.Eliminations)
								existingPlayer.deaths += parseInt(player.player_stats.Deaths)
								existingPlayer.damage += parseInt(player.player_stats['Damage Dealt'])
								existingPlayer.healing += parseInt(player.player_stats['Healing Done'])
								existingPlayer.mitigation += parseInt(player.player_stats['Damage Mitigated'])
								existingPlayer.assists += parseInt(player.player_stats.Assists)
								existingPlayer.kdSum += parseFloat(player.player_stats['K/D Ratio'])
								existingPlayer.roundsPlayed++
							} else {
								const faction =
									team.team_stats.Team === match.details?.teams['faction1']?.name
										? 'faction1'
										: 'faction2'
								const rosterIndex = match.details.teams[faction].roster?.findIndex(
									(p) => p.nickname === player.nickname
								)
								playerAcc.push({
									nickname: player.nickname,
									ign:
										match.details.teams?.[faction]?.roster?.[rosterIndex]?.game_player_name ||
										player.nickname,
									team: team.team_stats.Team,
									eliminations: parseInt(player.player_stats.Eliminations),
									assists: parseInt(player.player_stats.Assists),
									deaths: parseInt(player.player_stats.Deaths),
									damage: parseInt(player.player_stats['Damage Dealt']),
									healing: parseInt(player.player_stats['Healing Done']),
									mitigation: parseInt(player.player_stats['Damage Mitigated']),
									kdSum: parseFloat(player.player_stats['K/D Ratio']),
									roundsPlayed: 1,
									role: player.player_stats.Role
								})
							}
							return playerAcc
						}, teamAcc)
					}, acc)
				},
				[] as Array<{
					nickname: string
					ign: string
					team: string
					eliminations: number
					deaths: number
					damage: number
					healing: number
					mitigation: number
					assists: number
					kdSum: number
					roundsPlayed: number
					role: string
				}>
			)
			.map((player) => ({
				...player,
				kd: player.kdSum / player.roundsPlayed
			}))

		stats.sort((a, b) => {
			if (sortColumn === 'role') {
				return (
					(roleOrder[a.role as keyof typeof roleOrder] - roleOrder[b.role as keyof typeof roleOrder]) *
					(sortDirection === 'asc' ? 1 : -1)
				)
			}
			if (a[sortColumn as keyof typeof a] < b[sortColumn as keyof typeof b])
				return sortDirection === 'asc' ? -1 : 1
			if (a[sortColumn as keyof typeof a] > b[sortColumn as keyof typeof b])
				return sortDirection === 'asc' ? 1 : -1
			return 0
		})

		if (groupBy === 'team') {
			const groupedStats = stats.reduce(
				(acc, player) => {
					if (!acc[player.team]) {
						acc[player.team] = []
					}
					acc[player.team].push(player)
					return acc
				},
				{} as Record<string, typeof stats>
			)

			return Object.entries(groupedStats).flatMap(([team, players]) => [
				{ team, isGroupHeader: true },
				...players
			])
		}

		return stats
	}, [match.stats.rounds, match.details.teams, sortColumn, sortDirection, groupBy])

	return (
		<div>
			<div className="mb-4 flex justify-between items-center">
				<Select onValueChange={handleGroupByChange} value={groupBy}>
					<SelectTrigger className="w-[180px]">
						<SelectValue placeholder="Group by" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="none">No Grouping</SelectItem>
						<SelectItem value="team">Group by Team</SelectItem>
					</SelectContent>
				</Select>
				<div className="flex items-center space-x-2">
					<Checkbox
						id="showFaceitNames"
						checked={showFaceitNames}
						onCheckedChange={handleShowFaceitNamesChange}
					/>
					<label htmlFor="showFaceitNames">Show Faceit ID</label>
				</div>
			</div>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead onClick={() => handleSort('nickname')}>
							Player {sortColumn === 'nickname' && (sortDirection === 'asc' ? '↑' : '↓')}
						</TableHead>
						<TableHead onClick={() => handleSort('role')}>
							Role {sortColumn === 'role' && (sortDirection === 'asc' ? '↑' : '↓')}
						</TableHead>
						<TableHead onClick={() => handleSort('team')}>
							Team {sortColumn === 'team' && (sortDirection === 'asc' ? '↑' : '↓')}
						</TableHead>
						<TableHead onClick={() => handleSort('eliminations')}>
							Eliminations {sortColumn === 'eliminations' && (sortDirection === 'asc' ? '↑' : '↓')}
						</TableHead>
						<TableHead onClick={() => handleSort('assists')}>
							Assists {sortColumn === 'assists' && (sortDirection === 'asc' ? '↑' : '↓')}
						</TableHead>
						<TableHead onClick={() => handleSort('deaths')}>
							Deaths {sortColumn === 'deaths' && (sortDirection === 'asc' ? '↑' : '↓')}
						</TableHead>
						<TableHead onClick={() => handleSort('damage')}>
							Damage {sortColumn === 'damage' && (sortDirection === 'asc' ? '↑' : '↓')}
						</TableHead>
						<TableHead onClick={() => handleSort('healing')}>
							Healing {sortColumn === 'healing' && (sortDirection === 'asc' ? '↑' : '↓')}
						</TableHead>
						<TableHead onClick={() => handleSort('mitigation')}>
							Mitigation {sortColumn === 'mitigation' && (sortDirection === 'asc' ? '↑' : '↓')}
						</TableHead>
						<TableHead onClick={() => handleSort('kd')}>
							K/D {sortColumn === 'kd' && (sortDirection === 'asc' ? '↑' : '↓')}
						</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{(overallStats as OverallStats[]).map((player, index) =>
						(player as { isGroupHeader?: boolean }).isGroupHeader ? (
							<TableRow key={index} className="bg-muted/50 w-full">
								<TableCell colSpan={9} className="font-bold">
									{player.team}
								</TableCell>
							</TableRow>
						) : (
							<TableRow key={player.nickname}>
								<TableCell>{showFaceitNames ? player.nickname : player.ign}</TableCell>
								<TableCell>{player.role}</TableCell>

								<TableCell>{player.team}</TableCell>
								<TableCell>{player.eliminations}</TableCell>
								<TableCell>{player.assists}</TableCell>
								<TableCell>{player.deaths}</TableCell>
								<TableCell>{player.damage}</TableCell>
								<TableCell>{player.healing}</TableCell>
								<TableCell>{player.mitigation}</TableCell>
								<TableCell>{player.kd.toFixed(2)}</TableCell>
							</TableRow>
						)
					)}
				</TableBody>
			</Table>
		</div>
	)
}
