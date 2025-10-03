import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type CertificateType = 'certificate' | 'charter';

export interface CertificateData {
  id: string;
  certificate_id: string;
  type: CertificateType;
  recipient_name: string;
  recipient_email: string;
  issued_date: string;
  issuer_name: string;
  title: string;
  description: string | null;
  document_url: string | null;
  metadata: Record<string, any> | null;
  status: 'active' | 'revoked';
  created_at: string;
}

export const useCertificateData = (certificateId: string | undefined) => {
  return useQuery({
    queryKey: ['certificate', certificateId],
    queryFn: async () => {
      if (!certificateId) {
        throw new Error('Certificate ID is required');
      }

      const { data, error } = await supabase
        .from('certificates')
        .select('*')
        .eq('certificate_id', certificateId)
        .maybeSingle();

      if (error) {
        throw new Error(`Certificate not found: ${error.message}`);
      }

      if (!data) {
        throw new Error('Certificate not found');
      }

      return data as any as CertificateData;
    },
    enabled: !!certificateId,
    retry: false,
  });
};
