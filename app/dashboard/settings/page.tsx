'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { getUserProfile, setWebhookUrl as updateWebhookUrl } from '@/lib/actions';
import { ModeToggle } from '@/components/layout/mode-toggle';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function SettingsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState('');
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    if (user) {
      getUserProfile(user.uid).then((profile) => {
        setUserProfile(profile);
        setWebhookUrl(profile?.webhookUrl || '');
      });
    }
  }, [user]);

  const handleWebhookUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (user) {
      try {
        await updateWebhookUrl({ userId: user.uid, webhookUrl });
        toast({
          title: 'Success',
          description: 'Webhook URL updated successfully.',
        });
      } catch (error: any) {
        toast({
          title: 'Error',
          description: error.message || 'Failed to update webhook URL.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className='p-8'>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className='max-w-4xl space-y-8'
      >
        <div>
          <h1 className='text-4xl font-bold mb-2'>Settings</h1>
          <p className='text-muted-foreground'>
            Manage your account settings and preferences.
          </p>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="webhook">Webhook</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="plan">Plan & Billing</TabsTrigger>
          </TabsList>
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile Settings</CardTitle>
                <CardDescription>Update your personal details.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input value={user?.email || ''} disabled />
                </div>
                <Button disabled>Update Profile (Coming Soon)</Button>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="webhook">
            <Card>
              <CardHeader>
                <CardTitle>Webhook Configuration</CardTitle>
                <CardDescription>Set your webhook URL for receiving notifications.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleWebhookUpdate} className='space-y-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='webhook-url'>Webhook URL</Label>
                    <Input
                      id='webhook-url'
                      type='url'
                      placeholder='https://your-webhook-url.com'
                      value={webhookUrl}
                      onChange={(e) => setWebhookUrl(e.target.value)}
                    />
                  </div>
                  <Button type='submit' disabled={loading}>
                    {loading ? <Loader2 className='mr-2 h-4 w-4 animate-spin' /> : 'Save Webhook'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="appearance">
            <Card>
              <CardHeader>
                <CardTitle>Appearance</CardTitle>
                <CardDescription>Customize the look and feel of the dashboard.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                    <Label>Theme</Label>
                    <ModeToggle isCollapsed={false} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="plan">
            <Card>
              <CardHeader>
                <CardTitle>Plan & Billing</CardTitle>
                <CardDescription>Information about your current subscription plan.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>Your current plan: <span className="font-semibold">{userProfile?.plan || 'Free'}</span></p>
                <Button disabled>Upgrade Plan (Coming Soon)</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}
