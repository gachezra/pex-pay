'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase/client';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      
      setLoading(false);

      toast({
        title: 'Welcome back!',
        description: 'Successfully signed in to your account.',
      });
      router.push('/dashboard');
      
    } catch (error: any) {
      setLoading(false);
      toast({
        title: 'Error',
        description: error.message || 'An unexpected error occurred. Please check your credentials.',
        variant: 'destructive',
      });
    }
  };

  return (
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
                    <CardTitle className='text-2xl text-center'>Sign In</CardTitle>
                    <CardDescription className='text-center'>
                        Enter your credentials to access your account
                    </CardDescription>
                </CardHeader>
                <CardContent className='space-y-4'>
                    <form onSubmit={handleSubmit} className='space-y-4'>
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
                                className='transition-all focus:scale-[1.01]'
                            />
                        </div>
                        <Button
                            type='submit'
                            className='w-full bg-gradient-to-r from-primary to-accent hover:opacity-90'
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                                    Signing in...
                                </> 
                            ) : (
                                'Sign In'
                            )}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className='flex flex-col space-y-4'>
                    <div className='text-sm text-center text-muted-foreground'>
                        Don&apos;t have an account?{' '}
                        <Link href='/signup' className='text-primary hover:underline font-semibold'>
                            Sign up
                        </Link>
                    </div>
                </CardFooter>
            </Card>
        </motion.div>
    </div>
  );
}
