import type { ParticipantDraft } from '@/lib/types'

function normalizeValue(value?: string | null) {
  return value?.trim().toLowerCase() ?? ''
}

export function findDuplicateParticipant(
  participants: ParticipantDraft[],
  candidate: { name: string }
) {
  const normalizedName = normalizeValue(candidate.name)
  return participants.find((participant) => normalizeValue(participant.name) === normalizedName) ?? null
}