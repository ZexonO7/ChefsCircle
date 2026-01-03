import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { GraduationCap, Mail, Phone, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface EnrollmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEnroll: (data: EnrollmentData) => void;
  courseTitle: string;
}

export interface EnrollmentData {
  certificateName: string;
  email: string;
  phone?: string;
}

const EnrollmentModal = ({ isOpen, onClose, onEnroll, courseTitle }: EnrollmentModalProps) => {
  const { toast } = useToast();
  const [certificateName, setCertificateName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!certificateName.trim()) {
      toast({
        title: "Name Required",
        description: "Please enter your name for the certificate.",
        variant: "destructive",
      });
      return;
    }

    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast({
        title: "Valid Email Required",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      await onEnroll({
        certificateName: certificateName.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
      });
      
      toast({
        title: "Enrolled Successfully! 🎉",
        description: `Welcome to ${courseTitle}. Let's start learning!`,
      });
    } catch (error) {
      toast({
        title: "Enrollment Failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-chef-warm-ivory border-chef-gold/20">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-chef-gold/20 rounded-full">
              <GraduationCap className="w-6 h-6 text-chef-gold" />
            </div>
            <DialogTitle className="text-xl font-semibold text-chef-charcoal">
              Enroll in Course
            </DialogTitle>
          </div>
          <DialogDescription className="text-chef-charcoal/70">
            Enter your details to enroll in <span className="font-medium text-chef-charcoal">{courseTitle}</span>. 
            Your name will appear on the certificate upon completion.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="certificateName" className="text-chef-charcoal flex items-center gap-2">
              <User className="w-4 h-4" />
              Name on Certificate *
            </Label>
            <Input
              id="certificateName"
              type="text"
              placeholder="John Doe"
              value={certificateName}
              onChange={(e) => setCertificateName(e.target.value)}
              className="bg-white border-chef-charcoal/20 focus:border-chef-gold focus:ring-chef-gold"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-chef-charcoal flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Email Address *
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="john@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white border-chef-charcoal/20 focus:border-chef-gold focus:ring-chef-gold"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="text-chef-charcoal flex items-center gap-2">
              <Phone className="w-4 h-4" />
              Phone Number <span className="text-chef-charcoal/50 text-sm">(optional)</span>
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+1 234 567 8900"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="bg-white border-chef-charcoal/20 focus:border-chef-gold focus:ring-chef-gold"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 border-chef-charcoal/20 text-chef-charcoal hover:bg-chef-charcoal/5"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-chef-gold hover:bg-chef-gold/90 text-chef-charcoal font-medium"
            >
              {isSubmitting ? 'Enrolling...' : 'Enroll Now'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EnrollmentModal;
