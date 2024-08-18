'use server'

import FaceitClient from '@/lib/faceit'

const faceit = new FaceitClient()

export async function fetchChampionships(
	organizerId: string,
	{ offset = 0, limit = 100 }: { offset?: number; limit?: number }
) {
	const championships = await faceit.getChampionships(organizerId, { offset, limit })

	return championships
}
