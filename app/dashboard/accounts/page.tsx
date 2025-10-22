'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/context/auth-context';
import { getAccounts } from '@/lib/actions';
import { AddAccountModal } from '@/components/accounts/add-account-modal';
import { EditAccountModal } from '@/components/accounts/edit-account-modal';
import { DeleteAccountDialog } from '@/components/accounts/delete-account-dialog';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function AccountsPage() {
  const { user } = useAuth();
  const [accounts, setAccounts] = useState<any[]>([]);
  const { toast } = useToast();

  const fetchAccounts = useCallback(async () => {
    if (user) {
      const fetchedAccounts = await getAccounts(user.uid);
      setAccounts(fetchedAccounts);
    }
  }, [user]);

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied!',
      description: 'Account ID copied to clipboard.',
    });
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Accounts</h1>
        <AddAccountModal onAccountAdded={fetchAccounts} />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Account ID</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {accounts.map((account) => (
              <TableRow key={account.id}>
                <TableCell>{account.name}</TableCell>
                <TableCell>{account.type}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span>{account.id}</span>
                    <Button variant="ghost" size="icon" onClick={() => copyToClipboard(account.id)}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex gap-2 justify-end">
                    <EditAccountModal account={account} onAccountUpdated={fetchAccounts} />
                    <DeleteAccountDialog accountId={account.id} onAccountDeleted={fetchAccounts} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
