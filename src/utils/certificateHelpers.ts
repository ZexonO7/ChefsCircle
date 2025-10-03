import type { CertificateType } from '@/hooks/useCertificateData';

export const formatCertificateId = (id: string): string => {
  return id.toUpperCase();
};

export const parseCertificateId = (id: string): { type: CertificateType | null; year: string | null; number: string | null } => {
  // Expected format: CC-2025-CH01 (charter) or CC-2025-CF01 (certificate)
  const match = id.match(/^CC-(\d{4})-(CH|CF)(\d{2,})$/i);
  
  if (!match) {
    return { type: null, year: null, number: null };
  }

  const [, year, typeCode, number] = match;
  const type = typeCode.toUpperCase() === 'CH' ? 'charter' : 'certificate';
  
  return { type, year, number };
};

export const validateCertificateId = (id: string): boolean => {
  const parsed = parseCertificateId(id);
  return parsed.type !== null;
};

export const getCertificateTypeLabel = (type: CertificateType): string => {
  return type === 'charter' ? 'Charter' : 'Certificate';
};

export const formatCertificateDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};
