import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Wallet,
  ExternalLink,
  RefreshCw
} from 'lucide-react';

interface PaymentSubmission {
  id: string;
  user_id: string;
  user_email: string;
  tier_id: string;
  tier_name: string;
  crypto_type: string;
  amount: string;
  transaction_id: string | null;
  status: string;
  admin_notes: string | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
  created_at: string;
}

const AdminPayments = () => {
  const { toast } = useToast();
  const [payments, setPayments] = useState<PaymentSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [adminNotes, setAdminNotes] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    fetchPayments();
    
    // Subscribe to realtime updates for immediate refresh
    const channel = supabase
      .channel('payment-submissions-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'payment_submissions' },
        () => {
          console.log('Payment submission changed, refreshing...');
          fetchPayments();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('payment_submissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPayments(data || []);
    } catch (error) {
      console.error('Error fetching payments:', error);
      toast({
        title: "Error",
        description: "Failed to fetch payment submissions",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updatePaymentStatus = async (paymentId: string, newStatus: 'approved' | 'rejected') => {
    setProcessingId(paymentId);
    try {
      const payment = payments.find(p => p.id === paymentId);
      if (!payment) throw new Error('Payment not found');

      // Update payment status
      const { error } = await supabase
        .from('payment_submissions')
        .update({ 
          status: newStatus,
          admin_notes: adminNotes[paymentId] || null,
          reviewed_at: new Date().toISOString()
        })
        .eq('id', paymentId);

      if (error) throw error;

      // If approved, update user's subscription
      if (newStatus === 'approved') {
        // Map tier_id to subscription tier
        const tierMapping: { [key: string]: string } = {
          'apprentice': 'basic',
          'sous-chef': 'premium', 
          'executive': 'enterprise'
        };
        const subscriptionTier = tierMapping[payment.tier_id] || 'basic';
        
        // Set subscription end date (1 year from now)
        const subscriptionEnd = new Date();
        subscriptionEnd.setFullYear(subscriptionEnd.getFullYear() + 1);

        // Upsert subscriber record
        const { error: subError } = await supabase
          .from('subscribers')
          .upsert({
            user_id: payment.user_id,
            email: payment.user_email,
            subscribed: true,
            subscription_tier: subscriptionTier,
            subscription_end: subscriptionEnd.toISOString(),
            updated_at: new Date().toISOString()
          }, { 
            onConflict: 'user_id',
            ignoreDuplicates: false
          });

        if (subError) {
          console.error('Error updating subscription:', subError);
          // Try insert if upsert fails
          const { error: insertError } = await supabase
            .from('subscribers')
            .insert({
              user_id: payment.user_id,
              email: payment.user_email,
              subscribed: true,
              subscription_tier: subscriptionTier,
              subscription_end: subscriptionEnd.toISOString()
            });
          
          if (insertError) console.error('Error inserting subscription:', insertError);
        }

        // Send approval notification email
        try {
          await supabase.functions.invoke('notify-payment-approval', {
            body: {
              userEmail: payment.user_email,
              tierName: payment.tier_name,
              status: 'approved'
            }
          });
        } catch (emailError) {
          console.error('Error sending approval email:', emailError);
        }
      } else {
        // Send rejection notification email
        try {
          await supabase.functions.invoke('notify-payment-approval', {
            body: {
              userEmail: payment.user_email,
              tierName: payment.tier_name,
              status: 'rejected',
              reason: adminNotes[paymentId] || 'No reason provided'
            }
          });
        } catch (emailError) {
          console.error('Error sending rejection email:', emailError);
        }
      }

      toast({
        title: newStatus === 'approved' ? "Payment Approved" : "Payment Rejected",
        description: newStatus === 'approved' 
          ? `Payment approved and membership activated for ${payment.user_email}`
          : `The payment has been rejected.`,
      });

      fetchPayments();
    } catch (error) {
      console.error('Error updating payment:', error);
      toast({
        title: "Error",
        description: "Failed to update payment status",
        variant: "destructive",
      });
    } finally {
      setProcessingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30"><CheckCircle className="w-3 h-3 mr-1" /> Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30"><XCircle className="w-3 h-3 mr-1" /> Rejected</Badge>;
      default:
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30"><Clock className="w-3 h-3 mr-1" /> Pending</Badge>;
    }
  };

  const getCryptoExplorerUrl = (cryptoType: string, txId: string) => {
    if (cryptoType === 'btc') {
      return `https://mempool.space/tx/${txId}`;
    } else if (cryptoType === 'xmr') {
      return `https://xmrchain.net/search?value=${txId}`;
    }
    return null;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-chef-royal-blue"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-chef-charcoal flex items-center gap-2">
          <Wallet className="w-6 h-6" />
          Payment Submissions
        </h2>
        <Button onClick={fetchPayments} variant="outline" size="sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {payments.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Wallet className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">No payment submissions yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {payments.map((payment, index) => (
            <motion.div
              key={payment.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="border border-gray-200">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg font-semibold text-chef-charcoal">
                        {payment.tier_name}
                      </CardTitle>
                      <p className="text-sm text-gray-500 mt-1">{payment.user_email}</p>
                    </div>
                    {getStatusBadge(payment.status)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Crypto</p>
                      <p className="font-medium text-chef-charcoal uppercase">{payment.crypto_type}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Amount</p>
                      <p className="font-medium text-chef-charcoal">{payment.amount}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Submitted</p>
                      <p className="font-medium text-chef-charcoal">
                        {new Date(payment.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Transaction ID</p>
                      {payment.transaction_id ? (
                        <div className="flex items-center gap-1">
                          <p className="font-mono text-xs text-chef-charcoal truncate max-w-[120px]">
                            {payment.transaction_id}
                          </p>
                          {getCryptoExplorerUrl(payment.crypto_type, payment.transaction_id) && (
                            <a 
                              href={getCryptoExplorerUrl(payment.crypto_type, payment.transaction_id)!}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-chef-royal-blue hover:text-chef-royal-blue/80"
                            >
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      ) : (
                        <p className="text-gray-400 italic">Not provided</p>
                      )}
                    </div>
                  </div>

                  {payment.status === 'pending' && (
                    <div className="space-y-3 pt-2 border-t">
                      <Textarea
                        placeholder="Admin notes (optional)"
                        value={adminNotes[payment.id] || ''}
                        onChange={(e) => setAdminNotes({ ...adminNotes, [payment.id]: e.target.value })}
                        className="text-sm"
                        rows={2}
                      />
                      <div className="flex gap-2">
                        <Button
                          onClick={() => updatePaymentStatus(payment.id, 'approved')}
                          disabled={processingId === payment.id}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Approve
                        </Button>
                        <Button
                          onClick={() => updatePaymentStatus(payment.id, 'rejected')}
                          disabled={processingId === payment.id}
                          variant="destructive"
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  )}

                  {payment.admin_notes && payment.status !== 'pending' && (
                    <div className="pt-2 border-t">
                      <p className="text-sm text-gray-500">Admin Notes:</p>
                      <p className="text-sm text-chef-charcoal">{payment.admin_notes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminPayments;
