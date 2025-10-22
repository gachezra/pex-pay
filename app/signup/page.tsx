'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { signUp } from '@/lib/actions';

export default function SignUpPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showEmailInUseAlert, setShowEmailInUseAlert] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await signUp(email, password);
      toast({
        title: 'Account created!',
        description: 'Welcome to PexPay. Redirecting to your dashboard...',
      });
      router.push('/dashboard');
    } catch (error: any) {
       if (error.message.includes('email-already-in-use') || error.message.includes('already in use')) {
        setShowEmailInUseAlert(true);
      } else {
        toast({
          title: 'Error',
          description: error.message || 'Failed to create account. Please try again.',
          variant: 'destructive',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-card to-background p-4'>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='w-full max-w-md'
      >
        <div className='text-center mb-8'>
          <Link href='/'>
            <motion.h1
              whileHover={{ scale: 1.05 }}
              className='text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent inline-block cursor-pointer'
            >
              PexPay
            </motion.h1>
          </Link>
        </div>

        <Card className='border-2'>
          <CardHeader className='space-y-1'>
            <CardTitle className='text-2xl text-center'>Create Account</CardTitle>
            <CardDescription className='text-center'>
              Get started with your free PexPay account
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <form onSubmit={handleSubmit} className='space-y-4'>
              <div className='space-y-2'>
                <Label htmlFor='fullName'>Full Name</Label>
                <Input
                  id='fullName'
                  type='text'
                  placeholder='John Doe'
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className='transition-all focus:scale-[1.01]'
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='email'>Email</Label>
                <Input
                  id='email'
                  type='email'
                  placeholder='name@example.com'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className='transition-all focus:scale-[1.01]'
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='password'>Password</Label>
                <Input
                  id='password'
                  type='password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className='transition-all focus:scale-[1.01]'
                />
                <p className='text-xs text-muted-foreground'>
                  Must be at least 6 characters
                </p>
              </div>
              <Button
                type='submit'
                className='w-full bg-gradient-to-r from-primary to-accent hover:opacity-90'
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    Creating account...
                  </>
                ) : (
                  'Create Account'
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className='flex flex-col space-y-4'>
            <div className='text-sm text-center text-muted-foreground'>
              Already have an account?{' '}
              <Link href='/login' className='text-primary hover:underline font-semibold'>
                Sign in
              </Link>
            </div>
            <p className='text-xs text-center text-muted-foreground'>
              By creating an account, you agree to our{' '}
              <Link href='/toc' className='underline hover:text-foreground'>
                Terms of Service
              </Link>
              and{' '}
              <Link href='/privacy' className='underline hover:text-foreground'>
                Privacy Policy
              </Link>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
    <AlertDialog open={showEmailInUseAlert} onOpenChange={setShowEmailInUseAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Email Already Registered</AlertDialogTitle>
            <AlertDialogDescription>
              The email address you entered is already associated with an account.
              Would you like to sign in instead?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => router.push('/login')}>
              Sign In
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
