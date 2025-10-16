'use client';

import { useState } from 'react';
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

const tiers = [
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
  const [isAnnual, setIsAnnual] = useState(false);

  const handlePlanSelection = async (plan: string) => {
    setLoading(true);
    if (user) {
      try {
        const paymentServerUrl = 'https://your-payment-server.com/initiate-payment';

        const response = await fetch(paymentServerUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: user.uid,
            plan: plan,
            isAnnual,
            // Your M-Pesa details would be sent here
          }),
        });

        if (response.ok) {
          toast({
            title: 'Payment Initialized',
            description: 'Please complete the payment on your phone to generate the API key.',
          });
          setIsOpen(false);
        } else {
          const errorData = await response.json();
          toast({
            title: 'Error',
            description: errorData.message || 'Failed to initialize payment.',
            variant: 'destructive',
          });
        }
      } catch (error: any) {
        toast({
          title: 'Error',
          description: 'An unexpected error occurred. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Generate API Key</Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Choose Your Plan</DialogTitle>
          <DialogDescription>
            Select a plan to generate your API key. The 14-day free trial can only be used once.
          </DialogDescription>
        </DialogHeader>
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
                    <Button onClick={() => handlePlanSelection(tier.value)} disabled={loading} className="mt-4">
                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : `Choose ${tier.name}`}
                    </Button>
                </div>
            )
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
