'use client';

import { useState } from 'react';
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
import { addAccount } from '@/lib/actions';
import { useAuth } from '@/context/auth-context';

export function AddAccountModal({ onAccountAdded }: { onAccountAdded: () => void }) {
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [type, setType] = useState<'till' | 'business'>('till');
  const [tillNumber, setTillNumber] = useState('');
  const [businessNumber, setBusinessNumber] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [open, setOpen] = useState(false);

  const handleAddAccount = async () => {
    if (user) {
      await addAccount(user.uid, { name, type, tillNumber, businessNumber, accountNumber });
      onAccountAdded();
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add Account</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Account</DialogTitle>
          <DialogDescription>
            Add a new account to your profile.
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
          <Button type="submit" onClick={handleAddAccount}>Add Account</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
