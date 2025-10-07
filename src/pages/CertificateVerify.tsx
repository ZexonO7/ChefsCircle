import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Download, Calendar, User, Mail, FileText } from 'lucide-react';
import { useCertificateData } from '@/hooks/useCertificateData';
import {
  formatCertificateId,
  validateCertificateId,
  getCertificateTypeLabel,
  formatCertificateDate
} from '@/utils/certificateHelpers';
import PageLayout from '@/components/PageLayout';
import LoadingScreen from '@/components/LoadingScreen';

const CertificateVerify = () => {
  const { certificateId } = useParams<{ certificateId: string }>();
  const formattedId = certificateId ? formatCertificateId(certificateId) : '';
  const isValidFormat = certificateId ? validateCertificateId(certificateId) : false;

  const { data: certificate, isLoading, error } = useCertificateData(formattedId);

  if (isLoading) {
    return <LoadingScreen />;
  }

  const isValid = !error && certificate && certificate.status === 'active';

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Document Verification</h1>
          <p className="text-muted-foreground">
            Verify the authenticity of ChefsCircle certificates and charters
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl">Verification Status</CardTitle>
              {isValid ? (
                <Badge className="bg-green-500 text-white">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Valid
                </Badge>
              ) : (
                <Badge variant="destructive">
                  <XCircle className="w-4 h-4 mr-1" />
                  Invalid
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Document ID</p>
                <p className="text-lg font-mono font-semibold">{formattedId}</p>
              </div>

              {!isValidFormat && (
                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                  <p className="text-destructive font-medium">Invalid Certificate ID Format</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Expected format: CC-YYYY-CH## (charter) or CC-YYYY-CF## (certificate)
                  </p>
                </div>
              )}

              {isValidFormat && error && (
                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                  <p className="text-destructive font-medium">Document Not Found</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    This document ID does not exist in our system or has been revoked.
                  </p>
                </div>
              )}

              {certificate && isValid && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                    <div className="flex items-start gap-3">
                      <FileText className="w-5 h-5 text-primary mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Type</p>
                        <p className="font-medium">{getCertificateTypeLabel(certificate.type)}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <User className="w-5 h-5 text-primary mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Recipient</p>
                        <p className="font-medium">{certificate.recipient_name}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Mail className="w-5 h-5 text-primary mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <p className="font-medium">{certificate.recipient_email}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Calendar className="w-5 h-5 text-primary mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Issue Date</p>
                        <p className="font-medium">{formatCertificateDate(certificate.issued_date)}</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <p className="text-sm text-muted-foreground mb-1">Title</p>
                    <p className="font-semibold text-lg">{certificate.title}</p>
                  </div>

                  {certificate.description && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Description</p>
                      <p className="text-sm">{certificate.description}</p>
                    </div>
                  )}

                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Issued By</p>
                    <p className="font-medium">{certificate.issuer_name}</p>
                  </div>

                  {certificate.document_url && (
                    <>
                      <div className="pt-4 border-t">
                        <p className="text-sm text-muted-foreground mb-3">Document Preview</p>
                        <div className="rounded-lg border overflow-hidden bg-white">
                          <object
                            data={certificate.document_url}
                            type="application/pdf"
                            className="w-full h-[600px]"
                          >
                            <p className="p-4 text-center">
                              Unable to display PDF. Please download the document to view it.
                            </p>
                          </object>
                        </div>
                      </div>
                      <div className="pt-4">
                        <p className="text-sm text-muted-foreground mb-3">Image Preview</p>
                        <img 
                          src={`/documents/${certificate.certificate_id}.jpg`}
                          alt={`Preview of document ${certificate.certificate_id}`}
                          className="w-full rounded-lg border"
                          onError={(e) => { e.currentTarget.style.display = 'none'; }}
                        />
                      </div>
                      <div className="pt-4">
                        <a 
                          href={certificate.document_url} 
                          download={`${certificate.certificate_id}.pdf`}
                          className="inline-flex items-center justify-center w-full h-10 px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download Document
                        </a>
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>About Document Verification</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <p>
              ChefsCircle issues verifiable certificates and charters to document achievements,
              memberships, and milestones within our culinary community.
            </p>
            <p>
              Each document has a unique ID that can be verified on this page. If a document
              shows as valid, it confirms that it was genuinely issued by ChefsCircle and has
              not been revoked.
            </p>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default CertificateVerify;
