/**
 * Termly policy IDs.
 *
 * Each value is the `data-id` UUID from the embed snippet Termly gives you:
 *   Termly dashboard → the document → Publish → Embed / "Code snippet"
 *   → <div name="termly-embed" data-id="THIS-BIT"></div>
 *
 * The same UUIDs are also used by the app repo (dni-studio) in
 * client/src/config/termly.js — keep the two in sync.
 *
 * A document whose ID is still an empty string renders a short
 * "not published yet" notice instead of a broken embed.
 */
export const TERMLY_POLICY_IDS = {
  privacy: '',
  terms:   '',
  cookies: '',
} as const

export type TermlyPolicy = keyof typeof TERMLY_POLICY_IDS

export const TERMLY_EMBED_SCRIPT = 'https://app.termly.io/embed-policy.min.js'
