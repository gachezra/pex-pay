'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { setWebhookUrl as updateWebhookUrl } from '@/lib/actions';
import { auth } from '@/lib/firebase/client';

export default function SettingsPage() {
  const { toast } = useToast();
  const [webhookUrl, setWebhookUrl] = useState('');
  const [loadingWebhook, setLoadingWebhook] = useState(false);

  const handleWebhookSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user) {
      toast({ title: 'Authentication Error', description: 'Please log in again.', variant: 'destructive' });
      return;
    }

    setLoadingWebhook(true);
    try {
      await updateWebhookUrl({ userId: user.uid, webhookUrl });
      toast({ title: 'Success!', description: 'Webhook URL updated.' });
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setLoadingWebhook(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-primary">Settings</h1>
        <p className="text-muted-foreground">Manage your account and business settings.</p>
      </header>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Webhook URL</CardTitle>
            <CardDescription>Set the URL for receiving transaction updates.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleWebhookSubmit}>
              <div className="space-y-2">
                <Label htmlFor="webhook">Webhook URL</Label>
                <Input id="webhook" type="url" value={webhookUrl} onChange={(e) => setWebhookUrl(e.target.value)} placeholder="https://example.com/webhook" />
              </div>
              <Button type="submit" className="mt-4 w-full" disabled={loadingWebhook}>
                {loadingWebhook && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Save
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
