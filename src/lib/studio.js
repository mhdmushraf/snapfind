import { base44 } from '@/api/base44Client';

const makePrefix = () => 'studio_' + Math.random().toString(36).slice(2, 8);

/**
 * Returns the signed-in user's Studio, creating one if it doesn't exist.
 *
 * Accounts created before the signup flow started making Studio records —
 * or created through any other route — would otherwise dead-end on a
 * "no studio found" screen. This makes the app self-heal instead.
 *
 * Returns { user, studio }.
 */
export async function ensureStudio() {
  const user = await base44.auth.me();
  const existing = await base44.entities.Studio.filter({ created_by_id: user.id });
  if (existing?.length) return { user, studio: existing[0] };

  const studio = await base44.entities.Studio.create({
    name: user.full_name ? `${user.full_name.split(' ')[0]}'s Studio` : 'My Studio',
    owner_email: user.email,
    r2_prefix: makePrefix(),
    plan: 'trial',
    photo_credits: 5000,
  });
  return { user, studio };
}
