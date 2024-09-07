import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useMemo, useState } from 'react'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { MatchDetails, MatchStats } from '@/lib/faceit'

export default function Overview({ match }: { match: { details: MatchDetails; stats: MatchStats } }) {
	const [sortColumn, setSortColumn] = useState<keyof (typeof overallStats)[0]>('eliminations')
	const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
	const [groupBy, setGroupBy] = useState<'none' | 'team'>('team')

	const handleSort = (column: keyof (typeof overallStats)[0]) => {
		if (column === sortColumn) {
			setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
		} else {
			setSortColumn(column)
			setSortDirection('asc')
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
								playerAcc.push({
									nickname: player.nickname,
									team: team.team_stats.Team,
									eliminations: parseInt(player.player_stats.Eliminations),
									assists: parseInt(player.player_stats.Assists),
									deaths: parseInt(player.player_stats.Deaths),
									damage: parseInt(player.player_stats['Damage Dealt']),
									healing: parseInt(player.player_stats['Healing Done']),
									mitigation: parseInt(player.player_stats['Damage Mitigated']),
									kdSum: parseFloat(player.player_stats['K/D Ratio']),
									roundsPlayed: 1
								})
							}
							return playerAcc
						}, teamAcc)
					}, acc)
				},
				[] as Array<{
					nickname: string
					team: string
					eliminations: number
					deaths: number
					damage: number
					healing: number
					mitigation: number
					assists: number
					kdSum: number
					roundsPlayed: number
				}>
			)
			.map((player) => ({
				...player,
				kd: player.kdSum / player.roundsPlayed
			}))

		// Sort the stats
		stats.sort((a, b) => {
			if (a[sortColumn] < b[sortColumn]) return sortDirection === 'asc' ? -1 : 1
			if (a[sortColumn] > b[sortColumn]) return sortDirection === 'asc' ? 1 : -1
			return 0
		})

		// Group the stats if needed
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
	}, [match.stats.rounds, sortColumn, sortDirection, groupBy]) as Array<{
		nickname: string
		team: string
		eliminations: number
		deaths: number
		damage: number
		healing: number
		mitigation: number
		assists: number
		kd: number
	}>

	return (
		<div>
			<div className="mb-4">
				<Select onValueChange={(value) => setGroupBy(value as 'none' | 'team')} defaultValue={groupBy}>
					<SelectTrigger className="w-[180px]">
						<SelectValue placeholder="Group by" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="none">No Grouping</SelectItem>
						<SelectItem value="team">Group by Team</SelectItem>
					</SelectContent>
				</Select>
			</div>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead onClick={() => handleSort('nickname')}>Nickname</TableHead>
						<TableHead onClick={() => handleSort('team')}>Team</TableHead>
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
					{overallStats.map((player, index) =>
						(player as { isGroupHeader?: boolean }).isGroupHeader ? (
							<TableRow key={index} className="bg-muted/50">
								<TableCell colSpan={9} className="font-bold">
									{player.team}
								</TableCell>
							</TableRow>
						) : (
							<TableRow key={player.nickname}>
								<TableCell>{player.nickname}</TableCell>
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
