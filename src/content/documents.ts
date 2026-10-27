/**
 * Permits and compliance documents shown in the Tenders section.
 *
 * Only add documents that have been verified. For each entry:
 *  - `file` is a path under /public (e.g. "/documents/business-permit.pdf").
 *    Anything inside /public is downloadable by anyone, so only add files the
 *    business is happy to publish. Leave `file` null to show "Available on request".
 *  - Never publish documents containing private information (ID numbers,
 *    personal addresses, signatures) without redacting them first.
 *
 * Example:
 *   {
 *     title: "Single Business Permit",
 *     issuer: "County Government",
 *     reference: "SBP/2026/0000",
 *     validUntil: "2026-12-31",
 *     file: null,
 *   },
 */

export type ComplianceDocument = {
  title: string;
  issuer?: string;
  reference?: string;
  /** ISO date, e.g. "2026-12-31" */
  validUntil?: string;
  file: string | null;
};

export const complianceDocuments: ComplianceDocument[] = [];
