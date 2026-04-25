import { jsPDF } from 'jspdf';

interface CertificateData {
  recipientName: string;
  courseTitle: string;
  instructor?: string;
  completionDate?: Date;
  certificateId?: string;
}

/**
 * Generates a premium ChefsCircle completion certificate as a downloadable PDF.
 * Uses A4 landscape with warm ivory background, gold accents, and serif typography.
 */
export const generateCertificatePdf = ({
  recipientName,
  courseTitle,
  instructor = 'ChefsCircle Faculty',
  completionDate = new Date(),
  certificateId,
}: CertificateData) => {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();

  // Warm ivory background
  doc.setFillColor(248, 244, 234);
  doc.rect(0, 0, pageW, pageH, 'F');

  // Outer gold border
  doc.setDrawColor(194, 158, 78);
  doc.setLineWidth(3);
  doc.rect(28, 28, pageW - 56, pageH - 56);

  // Inner thin border
  doc.setLineWidth(0.6);
  doc.rect(40, 40, pageW - 80, pageH - 80);

  // Header label
  doc.setTextColor(60, 45, 30);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  doc.text('CHEFSCIRCLE  •  CERTIFICATE OF COMPLETION', pageW / 2, 90, { align: 'center' });

  // Decorative gold rule
  doc.setDrawColor(194, 158, 78);
  doc.setLineWidth(1);
  doc.line(pageW / 2 - 70, 104, pageW / 2 + 70, 104);

  // "This certifies that"
  doc.setFontSize(13);
  doc.setTextColor(90, 70, 50);
  doc.text('This certifies that', pageW / 2, 150, { align: 'center' });

  // Recipient name (serif, large)
  doc.setFont('times', 'bold');
  doc.setFontSize(46);
  doc.setTextColor(34, 28, 22);
  doc.text(recipientName || 'Valued Member', pageW / 2, 210, { align: 'center' });

  // Body
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(13);
  doc.setTextColor(90, 70, 50);
  doc.text(
    'has successfully completed the ChefsCircle culinary masterclass',
    pageW / 2,
    248,
    { align: 'center' }
  );

  // Course title
  doc.setFont('times', 'italic');
  doc.setFontSize(26);
  doc.setTextColor(160, 120, 40);
  doc.text(`“${courseTitle}”`, pageW / 2, 296, { align: 'center' });

  // Footer columns
  const footerY = pageH - 110;
  doc.setDrawColor(194, 158, 78);
  doc.setLineWidth(0.5);
  doc.line(120, footerY, 300, footerY);
  doc.line(pageW - 300, footerY, pageW - 120, footerY);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(60, 45, 30);
  const dateStr = completionDate.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  doc.text(dateStr, 210, footerY + 18, { align: 'center' });
  doc.text('Date of Completion', 210, footerY + 34, { align: 'center' });

  doc.text(instructor, pageW - 210, footerY + 18, { align: 'center' });
  doc.text('Lead Instructor', pageW - 210, footerY + 34, { align: 'center' });

  // Cert id
  if (certificateId) {
    doc.setFontSize(9);
    doc.setTextColor(140, 120, 90);
    doc.text(`Verify: chefscircle.com/id/${certificateId}`, pageW / 2, pageH - 56, {
      align: 'center',
    });
  }

  // Brand mark
  doc.setFont('times', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(160, 120, 40);
  doc.text('ChefsCircle', pageW / 2, pageH - 72, { align: 'center' });

  const safeName = (recipientName || 'member').replace(/[^a-z0-9]+/gi, '-').toLowerCase();
  const safeCourse = courseTitle.replace(/[^a-z0-9]+/gi, '-').toLowerCase();
  doc.save(`chefscircle-${safeName}-${safeCourse}.pdf`);
};
