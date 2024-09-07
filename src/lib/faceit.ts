type ChampionshipDetails = {
	anticheat_required: boolean
	avatar: string
	background_image: string
	championship_id: string
	championship_start: number
	checkin_clear: number
	checkin_enabled: boolean
	checkin_start: number
	cover_image: string
	current_subscriptions: number
	description: string
	faceit_url: string
	featured: boolean
	full: boolean
	game_data: {
		assets: {
			cover: string
			featured_img_l: string
			featured_img_m: string
			featured_img_s: string
			flag_img_icon: string
			flag_img_l: string
			flag_img_m: string
			flag_img_s: string
			landing_page: string
		}
		game_id: string
		long_label: string
		order: number
		parent_game_id: string
		platforms: string[]
		regions: string[]
		short_label: string
	}
	game_id: string
	id: string
	join_checks: {
		allowed_team_types: string[]
		blacklist_geo_countries: string[]
		join_policy: string
		max_skill_level: number
		membership_type: string
		min_skill_level: number
		whitelist_geo_countries: string[]
		whitelist_geo_countries_min_players: number
	}
	name: string
	organizer_data: {
		avatar: string
		cover: string
		description: string
		facebook: string
		faceit_url: string
		followers_count: number
		name: string
		organizer_id: string
		twitch: string
		twitter: string
		type: string
		vk: string
		website: string
		youtube: string
	}
	organizer_id: string
	prizes: Array<{
		faceit_points: number
		rank: number
	}>
	region: string
	rules_id: string
	schedule: {
		[key: string]: {
			date: number
			status: string
		}
	}
	screening: {
		enabled: boolean
		id: string
	}
	seeding_strategy: string
	slots: number
	status: string
	stream: {
		active: boolean
		platform: string
		source: string
		title: string
	}
	subscription_end: number
	subscription_start: number
	subscriptions_locked: boolean
	substitution_configuration: {
		max_substitutes: number
		max_substitutions: number
	}
	total_groups: number
	total_prizes: number
	total_rounds: number
	type: string
}

type ChampionshipMatches = {
	end: number
	items: Array<{
		best_of: number
		broadcast_start_time: number
		broadcast_start_time_label: string
		calculate_elo: boolean
		chat_room_id: string
		competition_id: string
		competition_name: string
		competition_type: string
		configured_at: number
		demo_url: string[]
		detailed_results: Array<{
			asc_score: boolean
			factions: {
				[key: string]: {
					score: number
				}
			}
			winner: string
		}>
		faceit_url: string
		finished_at: number
		game: string
		group: number
		match_id: string
		organizer_id: string
		region: string
		results: {
			score: {
				[key: string]: number
			}
			winner: string
		}
		round: number
		scheduled_at: number
		started_at: number
		status: string
		teams: {
			[key: string]: {
				avatar: string
				faction_id: string
				leader: string
				name: string
				roster: Array<{
					anticheat_required: boolean
					avatar: string
					game_player_id: string
					game_player_name: string
					game_skill_level: number
					membership: string
					nickname: string
					player_id: string
				}>
				roster_v1: null
				stats: {
					rating: number
					skillLevel: {
						average: number
						range: {
							max: number
							min: number
						}
					}
					winProbability: number
				}
				substituted: boolean
				type: string
			}
		}
		version: number
		voting: null
	}>
	start: number
}

type MatchDetails = {
	best_of: number
	broadcast_start_time: number
	broadcast_start_time_label: string
	calculate_elo: boolean
	chat_room_id: string
	competition_id: string
	competition_name: string
	competition_type: string
	configured_at: number
	demo_url: string[]
	detailed_results: {
		asc_score: boolean
		factions: {
			[key: string]: {
				score: number
			}
		}
		winner: string
	}[]
	faceit_url: string
	finished_at: number
	game: string
	group: number
	match_id: string
	organizer_id: string
	region: string
	results: {
		score: {
			[key: string]: number
		}
		winner: string
	}
	round: number
	scheduled_at: number
	started_at: number
	status: string
	teams: {
		[key: string]: {
			avatar: string
			faction_id: string
			leader: string
			name: string
			roster: {
				anticheat_required: boolean
				avatar: string
				game_player_id: string
				game_player_name: string
				game_skill_level: number
				membership: string
				nickname: string
				player_id: string
			}[]
			roster_v1: null
			stats: {
				rating: number
				skillLevel: {
					average: number
					range: {
						max: number
						min: number
					}
				}
				winProbability: number
			}
			substituted: boolean
			type: string
		}
	}
	version: number
	voting: {
		map: {
			entities: {
				class_name: string
				game_map_id: string
				guid: string
				image_lg: string
				image_sm: string
				name: string
			}[]
			pick: string[]
		}
	}
}

type MatchStats = {
	rounds: {
		best_of: string
		competition_id: string | null
		game_id: string
		game_mode: string
		match_id: string
		match_round: string
		played: string
		round_stats: {
			'OW2 Mode': string
			'Score Summary': string
			'Winner': string
			'Map': string
		}
		teams: {
			team_id: string
			premade: boolean
			team_stats: {
				'Team Avg Eliminations': string
				'Team': string
				'Team Win': string
				'Team Total Eliminations': string
				'Team Total Deaths': string
				'Team Avg Deaths': string
				'Team Score': string
			}
			players: {
				player_id: string
				nickname: string
				player_stats: {
					'Healing Done': string
					'Role': 'Support' | 'Damage' | 'Tank'
					'Result': string
					'K/D Ratio': string
					'Assists': string
					'Damage Mitigated': string
					'Eliminations': string
					'Deaths': string
					'Damage Dealt': string
				}
			}[]
		}[]
	}[]
}

export type OrganizerChampionships = {
	items: ChampionshipDetails[]
}

class FaceitClient {
	constructor(private readonly apiKey: string = process.env.FACEIT_API_KEY || '') {}

	public async getChampionships(
		organizerId: string,
		{ offset = 0, limit = 100 }: { offset?: number; limit?: number }
	): Promise<OrganizerChampionships> {
		return await this._makeRequest(`/organizers/${organizerId}/championships`, 'GET', { offset, limit })
	}

	public async getMatches(
		championshipId: string,
		queryParams?: { type?: 'all' | 'upcoming' | 'ongoing' | 'past'; offset?: number; limit?: number }
	): Promise<ChampionshipMatches> {
		1
		return await this._makeRequest(
			`/championships/${championshipId}/matches`,
			'GET',
			queryParams ?? {
				type: 'all',
				offset: 0,
				limit: 100
			}
		)
	}

	public async getChampionship(championshipId: string): Promise<ChampionshipDetails> {
		return await this._makeRequest(`/championships/${championshipId}`, 'GET')
	}

	public async getMatch(matchId: string): Promise<{ details: MatchDetails; stats: MatchStats }> {
		const [details, stats] = await Promise.all([
			this._makeRequest(`/matches/${matchId}`, 'GET'),
			this._makeRequest(`/matches/${matchId}/stats`, 'GET')
		])
		return { details, stats }
	}

	private async _makeRequest(
		endpoint: string,
		method: 'GET' | 'POST' | 'PUT' | 'DELETE',
		queryParams?: Record<string, string | number | boolean>
	) {
		const headers = new Headers()
		headers.set('Authorization', `Bearer ${this.apiKey}`)
		headers.set('Content-Type', 'application/json')

		const options = {
			method,
			headers
		}

		const url = new URL(`https://open.faceit.com/data/v4${endpoint}`)

		if (queryParams) {
			Object.entries(queryParams).forEach(([key, value]) => {
				if (typeof value !== 'string') {
					value = value.toString()
				}
				url.searchParams.append(key, value)
			})
		}

		const response = await fetch(url.toString(), { cache: 'no-store', ...options })

		if (!response.ok) {
			const error = await response.json()
			throw error
		}

		return await response.json()
	}
}

export default FaceitClient
export type { ChampionshipDetails, ChampionshipMatches, MatchDetails, MatchStats }
