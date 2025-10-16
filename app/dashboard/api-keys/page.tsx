'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'
import { Copy, Key, Loader2, Trash2 } from 'lucide-react'
import { useAuth } from '@/context/auth-context'
import { getUserProfile, deleteApiKey } from '@/lib/actions'
import { GenerateApiKeyModal } from '@/components/api-keys/generate-api-key-modal'

export default function ApiKeysPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [apiKey, setApiKey] = useState('')
  const [plan, setPlan] = useState('')
  const [expiryDate, setExpiryDate] = useState<Date | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const fetchUserProfile = async () => {
    if (user) {
      setLoading(true)
      const profile = await getUserProfile(user.uid)
      if (profile) {
        setApiKey(profile.apiKey || '')
        setPlan(profile.plan || '')
        setExpiryDate(profile.apiKeyExpiry ? profile.apiKeyExpiry.toDate() : null)
      }
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUserProfile()
  }, [user])

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: 'Copied!',
      description: 'API key copied to clipboard.',
    })
  }

  const handleDeleteApiKey = async () => {
    if (user) {
      try {
        await deleteApiKey(user.uid)
        setApiKey('')
        setPlan('')
        setExpiryDate(null)
        toast({ title: 'API Key Deleted', description: 'Your API key has been successfully deleted.' })
      } catch (error) {
        toast({ title: 'Error', description: 'Failed to delete API key. Please try again.', variant: 'destructive' })
      }
    }
    setIsDeleteDialogOpen(false)
  }

  return (
    <div className="p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl space-y-8"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">API Keys</h1>
            <p className="text-muted-foreground">
              Manage your API keys for secure access
            </p>
          </div>
          <GenerateApiKeyModal onApiKeyGenerated={fetchUserProfile} />
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
                <CardTitle>Your API Key</CardTitle>
                <CardDescription>This key is used to authenticate your requests to the PexPay API.</CardDescription>
            </div>
            {apiKey && (
                <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                    <DialogTrigger asChild>
                        <Button variant="destructive" size="icon">
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Are you sure?</DialogTitle>
                            <DialogDescription>
                                This will permanently delete your API key. This action cannot be undone.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="outline">Cancel</Button>
                            </DialogClose>
                            <Button variant="destructive" onClick={handleDeleteApiKey}>Delete</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-12 w-12 text-muted-foreground animate-spin" />
              </div>
            ) : apiKey ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <code className="text-sm break-all">{apiKey}</code>
                  <Button variant="ghost" size="icon" onClick={() => copyToClipboard(apiKey)}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <div className="text-sm text-muted-foreground">
                  <p><strong>Plan:</strong> {plan}</p>
                  <p><strong>Expires on:</strong> {expiryDate ? expiryDate.toLocaleDateString() : 'N/A'}</p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12">
                <Key className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-lg font-medium mb-2">No API key found</p>
                <p className="text-muted-foreground text-center mb-4">
                  Generate an API key to start using the PexPay API
                </p>
              </div>
            )}
          </CardContent>
        </Card>

      </motion.div>
    </div>
  )
}
