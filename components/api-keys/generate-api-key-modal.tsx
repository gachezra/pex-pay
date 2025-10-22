'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { generateApiKey, getUserProfile, initiatePayment } from '@/lib/actions';
import { getFirestore, doc, onSnapshot } from 'firebase/firestore';
import { app } from '@/lib/firebase/client';

const db = getFirestore(app);

const allTiers = [
  {
    name: '14-Day Free Trial',
    price: { weekly: 'Free' },
    value: 'trial',
    description: 'For trying out the service',
    features: [
      'Up to 100 transactions',
      'Basic API access',
      'Email support',
    ],
  },
  {
    name: 'Pro',
    price: { monthly: 'KES 1,500', annually: 'KES 15,000' },
    value: 'pro',
    description: 'For regular users and businesses with consistent needs',
    features: [
      'Up to 2,000 transactions/month',
      'Full API access',
      'Priority email & chat support',
      'Real-time analytics',
    ],
  },
  {
    name: 'Enterprise',
    price: { monthly: 'Custom' },
    value: 'enterprise',
    description: 'Custom solutions for large organizations',
    features: [
      'Unlimited transactions',
      'Dedicated API endpoints',
      '24/7 phone support',
      'Custom integrations',
    ],
  },
];

export function GenerateApiKeyModal({ onApiKeyGenerated }: { onApiKeyGenerated: () => void }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);
  const [isAnnual, setIsAnnual] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [phoneNumber, setPhoneNumber] = useState('');

  useEffect(() => {
    if (isOpen && user) {
      const fetchUserProfile = async () => {
        const profile = await getUserProfile(user.uid);
        setUserProfile(profile);
      };
      fetchUserProfile();
    }
  }, [isOpen, user]);

  useEffect(() => {
    if (!user || !isWaiting) return;

    const unsub = onSnapshot(doc(db, "users", user.uid), (doc) => {
        const data = doc.data();
        if (data && data.apiKey) {
            toast({
                title: "Payment Confirmed!",
                description: `Your API key for the ${selectedPlan?.name} plan has been generated.`,
            });
            onApiKeyGenerated();
            setIsWaiting(false);
            setIsOpen(false);
            setSelectedPlan(null);
            setPhoneNumber('');
        }
    });

    return () => unsub();

  }, [isWaiting, user, onApiKeyGenerated, toast, selectedPlan]);

  const handlePlanSelection = async (plan: any) => {
    if (plan.value === 'trial') {
      setLoading(true);
      if (!user) {
        toast({
          title: 'Authentication Error',
          description: 'You must be logged in to select a plan.',
          variant: 'destructive',
        });
        setLoading(false);
        return;
      }

      try {
        await generateApiKey(user.uid, plan.value, isAnnual);
        toast({
          title: 'Success!',
          description: `Your 14-day free trial API key has been generated.`,
        });
        onApiKeyGenerated();
        setIsOpen(false);
      } catch (error: any) {
        console.error(`Error processing plan ${plan.value}:`, error.message);
        toast({
          title: 'Error',
          description: error.message || 'An unexpected error occurred. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    } else {
      setSelectedPlan(plan);
    }
  };

  const handlePayment = async () => {
    setLoading(true);
    if (!user || !selectedPlan) {
      toast({
        title: 'Error',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
      setLoading(false);
      return;
    }

    try {
        const amount = isAnnual ? 15000 : 1500;
      await initiatePayment(user.uid, phoneNumber, amount);
      toast({
        title: 'Payment Initiated',
        description: 'Please check your phone to complete the payment.',
      });
      setIsWaiting(true);

    } catch (error: any) {
      console.error('Payment initiation error:', error.message);
      toast({
        title: 'Payment Error',
        description: error.message || 'Failed to initiate payment. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  const tiers = userProfile?.hasUsedTrial 
    ? allTiers.filter(tier => tier.value !== 'trial')
    : allTiers;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) {
            setSelectedPlan(null);
            setPhoneNumber('');
            setIsWaiting(false);
        }
    }}>
      <DialogTrigger asChild>
        <Button>Generate API Key</Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{selectedPlan ? `Payment for ${selectedPlan.name}` : 'Choose Your Plan'}</DialogTitle>
          <DialogDescription>
            {selectedPlan ? (isWaiting ? 'Waiting for payment confirmation...' : 'Enter your phone number to complete the payment.') : 'Select a plan to generate your API key. The 14-day free trial can only be used once.'}
          </DialogDescription>
        </DialogHeader>

        {selectedPlan ? (
            <div className="space-y-4">
                <div>
                    <h3 className="font-bold text-xl">{selectedPlan.name}</h3>
                    <p className="text-sm text-muted-foreground">{isAnnual ? selectedPlan.price.annually : selectedPlan.price.monthly}</p>
                </div>
                <Input 
                    type="tel"
                    placeholder="e.g. 254712345678"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    disabled={isWaiting}
                />
                <Button onClick={handlePayment} disabled={loading || !phoneNumber || isWaiting} className="w-full">
                    {isWaiting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Waiting for Confirmation</> : (loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : `Pay ${isAnnual ? selectedPlan.price.annually : selectedPlan.price.monthly}`)}
                </Button>
            </div>
        ) : (
            <>
                <div className="flex items-center justify-center gap-4 my-4">
                    <Label htmlFor="billing-toggle" className={`text-lg ${!isAnnual ? 'font-bold text-primary' : 'text-muted-foreground'}`}>
                        Monthly
                    </Label>
                    <Switch
                        id="billing-toggle"
                        checked={isAnnual}
                        onCheckedChange={setIsAnnual}
                        className="data-[state=checked]:bg-primary"
                    />
                    <Label htmlFor="billing-toggle" className={`text-lg ${isAnnual ? 'font-bold text-primary' : 'text-muted-foreground'}`}>
                        Annual <span className="text-sm font-normal text-green-600">(Save 17%)</span>
                    </Label>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {tiers.map((tier) => {
                    let price = tier.price.monthly;
                    if (tier.name === 'Pro' && isAnnual) {
                        price = tier.price.annually;
                    }
                    if (tier.name === '14-Day Free Trial') {
                        price = tier.price.weekly
                    }

                    return (
                        <div key={tier.value} className="p-4 border rounded-lg flex flex-col justify-between">
                            <div>
                                <h3 className="font-bold text-xl">{tier.name}</h3>
                                <p className="text-sm text-muted-foreground">{price}</p>
                                <ul className="text-xs list-disc list-inside mt-2 space-y-1">
                                {tier.features.map((feature, index) => (
                                    <li key={index}>{feature}</li>
                                ))}
                                </ul>
                            </div>
                            <Button onClick={() => handlePlanSelection(tier)} disabled={loading} className="mt-4">
                                {loading && tier.value === 'trial' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : `Choose ${tier.name}`}
                            </Button>
                        </div>
                    )
                })}
                </div>
            </>
        )}
      </DialogContent>
    </Dialog>
  );
}
