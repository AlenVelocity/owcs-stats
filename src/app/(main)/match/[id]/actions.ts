import FaceitClient from '@/lib/faceit'

const faceit = new FaceitClient()

export async function getMatch(matchId: string) {
	const match = await faceit.getMatch(matchId)
	return match
}
