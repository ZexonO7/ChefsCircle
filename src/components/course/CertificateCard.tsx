import { motion } from 'framer-motion';
import { Award, Download, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { generateCertificatePdf } from '@/utils/certificatePdf';
import { useToast } from '@/hooks/use-toast';

interface CertificateCardProps {
  recipientName: string;
  courseTitle: string;
  instructor?: string;
}

/**
 * Premium completion certificate card with downloadable PDF.
 * Only renders when a course is fully complete.
 */
const CertificateCard = ({ recipientName, courseTitle, instructor }: CertificateCardProps) => {
  const { toast } = useToast();

  const handleDownload = () => {
    try {
      generateCertificatePdf({
        recipientName,
        courseTitle,
        instructor,
        completionDate: new Date(),
        certificateId: `cc-${Date.now().toString(36)}`,
      });
      toast({
        title: 'Certificate downloaded',
        description: 'Your ChefsCircle certificate has been saved.',
      });
    } catch (e) {
      console.error(e);
      toast({
        title: 'Download failed',
        description: 'Please try again in a moment.',
        variant: 'destructive',
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="premium-card relative overflow-hidden border-accent/30 p-8"
    >
      <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-accent/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-accent/10 blur-3xl" />

      <div className="relative">
        <div className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.22em] text-accent">
          <CheckCircle2 className="h-3.5 w-3.5" />
          Course complete
        </div>

        <div className="mt-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/15 text-accent">
          <Award className="h-7 w-7" />
        </div>

        <h3 className="mt-5 font-playfair text-2xl font-semibold text-foreground">
          Your certificate is ready.
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-foreground/60">
          Beautifully designed and verifiable. Download your ChefsCircle certificate
          for <span className="italic text-foreground">“{courseTitle}”</span>.
        </p>

        <Button
          onClick={handleDownload}
          className="btn-glow mt-6 w-full rounded-full bg-foreground text-background hover:bg-foreground/90"
        >
          <Download className="mr-2 h-4 w-4" />
          Download Certificate
        </Button>
      </div>
    </motion.div>
  );
};

export default CertificateCard;
