'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { addAccount } from '@/lib/actions';
import { auth } from '@/lib/firebase/client';

const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  type: z.enum(['till', 'business'], { required_error: 'You need to select an account type.' }),
  tillNumber: z.string().optional(),
  businessNumber: z.string().optional(),
  accountNumber: z.string().optional(),
}).refine(data => {
  if (data.type === 'till') return !!data.tillNumber;
  return true;
}, { message: 'Till number is required for till accounts.', path: ['tillNumber'] })
.refine(data => {
  if (data.type === 'business') return !!data.businessNumber && !!data.accountNumber;
  return true;
}, { message: 'Business number and account number are required for business accounts.', path: ['businessNumber'] });

export default function AccountSetupPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
    },
  });
  const accountType = form.watch('type');

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    try {
        const user = auth.currentUser;
        if (!user) {
            throw new Error('You must be logged in to add an account.');
        }

        await addAccount(user.uid, values);

        toast({
            title: 'Account added successfully',
            description: `The ${values.name} account has been added.`
        });

        router.push('/dashboard');
    } catch (error: any) {
        toast({
            title: 'Error adding account',
            description: error.message,
            variant: 'destructive',
        });
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md p-8 space-y-8 bg-card rounded-lg shadow-md border">
        <h1 className="text-2xl font-bold text-center">Set Up Your Account</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account Name</FormLabel>
                  <FormControl>
                    <Input placeholder="My Personal Account" {...field} />
                  </FormControl>
                  <FormDescription>
                    Give your account a name to easily identify it later.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an account type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="till">Till</SelectItem>
                      <SelectItem value="business">Business</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Choose the type of account you want to set up.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            {accountType === 'till' && (
              <FormField
                control={form.control}
                name="tillNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Till Number</FormLabel>
                    <FormControl>
                      <Input placeholder="123456" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            {accountType === 'business' && (
              <>
                <FormField
                  control={form.control}
                  name="businessNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business Number</FormLabel>
                      <FormControl>
                        <Input placeholder="654321" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="accountNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Account Number</FormLabel>
                      <FormControl>
                        <Input placeholder="1122334455" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Saving...' : 'Save Account'}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
