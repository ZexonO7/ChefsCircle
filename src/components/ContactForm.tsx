import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Send, Mail, User, MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import emailjs from 'emailjs-com';

// Updated schema with honeypot field validation
const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  honeypot: z.string().max(0, 'Bot detected'), // Honeypot field must be empty
  timestamp: z.number() // To prevent automated quick submissions
});

type FormValues = z.infer<typeof formSchema>;

// EmailJS configuration - Updated with correct template ID
const EMAILJS_SERVICE_ID = "service_i3h66xg";
const EMAILJS_TEMPLATE_ID = "template_fgq53nh"; // Updated to the correct template ID
const EMAILJS_PUBLIC_KEY = "wQmcZvoOqTAhGnRZ3";

const ContactForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formStartTime] = useState<number>(Date.now()); // Track when form was opened
  
  const { toast } = useToast();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      message: '',
      honeypot: '',
      timestamp: formStartTime
    }
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    
    try {
      // Bot checks
      // 1. Honeypot check - should be caught by zod, but double-check
      if (data.honeypot) {
        console.log('Bot detected via honeypot');
        toast({
          title: "Error",
          description: "There was a problem with your submission. Please try again.",
          variant: "destructive"
        });
        return;
      }
      
      // 2. Time-based check - Submission should take at least 3 seconds (too fast is likely a bot)
      const timeDiff = Date.now() - data.timestamp;
      if (timeDiff < 3000) {
        console.log(`Bot detected: Form submitted too quickly (${timeDiff}ms)`);
        toast({
          title: "Error",
          description: "Please take a moment to review your message before submitting.",
          variant: "destructive"
        });
        setIsSubmitting(false);
        return;
      }
      
      console.log('Form submitted:', data);
      
      // Remove honeypot and timestamp fields before sending
      const { honeypot, timestamp, ...emailData } = data;
      
      // Using parameters exactly as expected by EmailJS templates
      const templateParams = {
        from_name: emailData.name,
        from_email: emailData.email,
        message: emailData.message,
        to_name: 'Chefs Circle Team', // Adding recipient name parameter
        reply_to: emailData.email // Keeping reply_to for compatibility
      };
      
      console.log('Sending email with params:', templateParams);
      console.log('Using service:', EMAILJS_SERVICE_ID);
      console.log('Using template:', EMAILJS_TEMPLATE_ID);
      console.log('Using public key:', EMAILJS_PUBLIC_KEY);
      
      // Send email directly without initializing, as it's not needed with the send method that includes the key
      const response = await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams,
        EMAILJS_PUBLIC_KEY // Re-adding the public key parameter
      );
      
      console.log('Email sent successfully:', response);
      
      toast({
        title: "Message sent!",
        description: "We've received your message and will get back to you soon.",
        variant: "default"
      });

      form.reset({
        name: '',
        email: '',
        message: '',
        honeypot: '',
        timestamp: Date.now()
      });
    } catch (error) {
      console.error('Error sending email:', error);
      
      // More detailed error logging
      if (error && typeof error === 'object' && 'text' in error) {
        console.error('Error details:', (error as any).text);
      }
      
      toast({
        title: "Error",
        description: "There was a problem sending your message. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField control={form.control} name="name" render={({
          field
        }) => <FormItem>
                <FormLabel className="text-chef-charcoal">Name</FormLabel>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-5 w-5 text-chef-charcoal/40" />
                  <FormControl>
                    <Input placeholder="Your name" className="pl-10 border-chef-royal-green/20 focus:border-chef-royal-green" {...field} />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>} />
          
          <FormField control={form.control} name="email" render={({
          field
        }) => <FormItem>
                <FormLabel className="text-chef-charcoal">Email</FormLabel>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-5 w-5 text-chef-charcoal/40" />
                  <FormControl>
                    <Input type="email" placeholder="your.email@example.com" className="pl-10 border-chef-royal-green/20 focus:border-chef-royal-green" {...field} />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>} />
          
          <FormField control={form.control} name="message" render={({
          field
        }) => <FormItem>
                <FormLabel className="text-chef-charcoal">Message</FormLabel>
                <div className="relative">
                  <MessageSquare className="absolute left-3 top-3 h-5 w-5 text-chef-charcoal/40" />
                  <FormControl>
                    <Textarea placeholder="Tell us about your culinary interests or questions..." className="min-h-[120px] pl-10 resize-none border-chef-royal-green/20 focus:border-chef-royal-green" {...field} />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>} />
          
          {/* Honeypot field - hidden from real users but bots will fill it */}
          <FormField control={form.control} name="honeypot" render={({
          field
        }) => <FormItem className="hidden">
                <FormLabel>Leave this empty</FormLabel>
                <FormControl>
                  <Input {...field} tabIndex={-1} />
                </FormControl>
              </FormItem>} />
          
          {/* Hidden timestamp field */}
          <FormField control={form.control} name="timestamp" render={({
          field
        }) => <FormItem className="hidden">
                <FormControl>
                  <Input type="hidden" {...field} />
                </FormControl>
              </FormItem>} />
          
          <button 
            type="submit" 
            disabled={isSubmitting} 
            className="w-full bg-chef-royal-green hover:bg-chef-forest text-chef-warm-ivory py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center disabled:opacity-70 font-medium"
          >
            {isSubmitting ? "Sending..." : <>
                Send Message
                <Send className="ml-2 h-4 w-4" />
              </>}
          </button>
        </form>
      </Form>
    </div>
  );
};

export default ContactForm;