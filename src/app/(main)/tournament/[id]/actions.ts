'use server'

import FaceitClient from '@/lib/faceit'

const faceit = new FaceitClient()

export async function fetchMatches(
	championshipId: string,
	type: 'all' | 'upcoming' | 'ongoing' | 'past' = 'all',
	offset: number = 0,
	limit: number = 100
) {
	const matches = await faceit.getMatches(championshipId, {
		type,
		offset,
		limit
	})

	return matches
}

export async function fetchChampionship(championshipId: string) {
	const championship = await faceit.getChampionship(championshipId)

	return championship
}
