// Christmas season switches. Decorations run from launch until 6 Jan; the sale (free
// onboarding & data migration) ends at the end of 31 Dec, UK time. Checked in the
// browser (pages are prerendered), so everything turns off by itself on the dates.
export const XMAS = {
  themeUntil: Date.parse('2027-01-07T00:00:00Z'),
  saleUntil: Date.parse('2027-01-01T00:00:00Z'),
  onboardingWorth: 149,
}
export const xmasThemeOn = (now = Date.now()) => now < XMAS.themeUntil
export const xmasSaleOn = (now = Date.now()) => now < XMAS.saleUntil
