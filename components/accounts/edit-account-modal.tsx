'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { updateAccount } from '@/lib/actions';
import { useAuth } from '@/context/auth-context';

export function EditAccountModal({ account, onAccountUpdated }: { account: any, onAccountUpdated: () => void }) {
  const { user } = useAuth();
  const [name, setName] = useState(account.name);
  const [type, setType] = useState<'till' | 'business'>('till');
  const [tillNumber, setTillNumber] = useState(account.tillNumber || '');
  const [businessNumber, setBusinessNumber] = useState(account.businessNumber || '');
  const [accountNumber, setAccountNumber] = useState(account.accountNumber || '');
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setName(account.name);
    setType(account.type);
    setTillNumber(account.tillNumber || '');
    setBusinessNumber(account.businessNumber || '');
    setAccountNumber(account.accountNumber || '');
  }, [account]);

  const handleUpdateAccount = async () => {
    if (user) {
      const updatedAccount = { ...account, name, type, tillNumber, businessNumber, accountNumber };
      await updateAccount(user.uid, updatedAccount);
      onAccountUpdated();
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Edit</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Account</DialogTitle>
          <DialogDescription>
            Update the details of your account.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="type" className="text-right">
              Type
            </Label>
            <select id="type" value={type} onChange={(e) => setType(e.target.value as 'till' | 'business')} className="col-span-3">
              <option value="till">Till</option>
              <option value="business">Business</option>
            </select>
          </div>
          {type === 'till' ? (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="tillNumber" className="text-right">
                Till Number
              </Label>
              <Input id="tillNumber" value={tillNumber} onChange={(e) => setTillNumber(e.target.value)} className="col-span-3" />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="businessNumber" className="text-right">
                  Business Number
                </Label>
                <Input id="businessNumber" value={businessNumber} onChange={(e) => setBusinessNumber(e.target.value)} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="accountNumber" className="text-right">
                  Account Number
                </Label>
                <Input id="accountNumber" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} className="col-span-3" />
              </div>
            </>
          )}
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleUpdateAccount}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
