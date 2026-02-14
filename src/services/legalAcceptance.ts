import type { LegalAcceptancePayload, LegalDocType } from '../types';

/** Document versions for re-acceptance on update. Bump to force users to re-accept. */
export const LEGAL_DOC_VERSIONS: Record<LegalDocType, string> = {
  tos: '2026-02-09-v1',
  privacy: '2026-02-09-v1',
  notice_at_collection: '2026-02-09-v1',
  explicit_consent: '2026-02-09-v1',
  clinic_agreement: '2026-02-09-v1',
  data_security_addendum: '2026-02-09-v1',
  age_gate: '2026-02-09-v1',
};

const getDefaultPayload = (
  actor_type: 'user' | 'clinic',
  actor_id: string,
  doc_type: LegalDocType
): Omit<LegalAcceptancePayload, 'actor_type' | 'actor_id' | 'doc_type'> => ({
  doc_version: LEGAL_DOC_VERSIONS[doc_type],
  accepted_at: new Date().toISOString(),
  ip_address: undefined,
  country: undefined,
  user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
});

/**
 * Log legal acceptance for audit. Call from signup (user) or clinic onboarding (clinic).
 * If backend table legal_acceptances exists, insert there; otherwise no-op or future API.
 */
export async function logLegalAcceptance(
  actor_type: 'user' | 'clinic',
  actor_id: string,
  doc_type: LegalDocType,
  doc_hash?: string
): Promise<void> {
  const payload: LegalAcceptancePayload = {
    actor_type,
    actor_id,
    doc_type,
    ...getDefaultPayload(actor_type, actor_id, doc_type),
    ...(doc_hash ? { doc_hash } : {}),
  };
  try {
    const { supabase } = await import('../lib/supabase');
    const { error } = await (supabase as any)
      .from('legal_acceptances')
      .insert({
        actor_type: payload.actor_type,
        actor_id: payload.actor_id,
        doc_type: payload.doc_type,
        doc_version: payload.doc_version,
        doc_hash: payload.doc_hash ?? null,
        accepted_at: payload.accepted_at,
        ip_address: payload.ip_address ?? null,
        country: payload.country ?? null,
        user_agent: payload.user_agent ?? null,
      });
    if (error) {
      console.warn('[legalAcceptance] Insert failed (table may not exist):', error.message);
    }
  } catch (e) {
    console.warn('[legalAcceptance] Log failed:', e);
  }
}
