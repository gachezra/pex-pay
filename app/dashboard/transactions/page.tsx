'use client';

import { useEffect, useState } from 'react';
import { auth } from '@/lib/firebase/client';
import { onAuthStateChanged } from 'firebase/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getTransactions } from '@/lib/actions';

export default function TransactionsPage() {
  const [user, setUser] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        const fetchedTransactions = await getTransactions(user.uid, 50); // Fetch more transactions for this page
        setTransactions(fetchedTransactions);
        setLoading(false);
      } else {
        setUser(null);
        setTransactions([]);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-primary">Transactions</h1>
        <p className="text-muted-foreground">View all of your transactions.</p>
      </header>

      <main>
        <Card>
            <CardHeader>
                <CardTitle>All Transactions</CardTitle>
            </CardHeader>
            <CardContent>
            {loading ? (
                <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 rounded-full bg-primary animate-pulse"></div>
                    <p>Loading transactions...</p>
                </div>
            ) : transactions.length > 0 ? (
                <div className="space-y-4">
                {transactions.map((transaction) => (
                    <div key={transaction.id} className="flex justify-between items-center p-4 border rounded-lg">
                        <div>
                            <p className="font-bold">{transaction.transactionId}</p>
                            <p className="text-sm text-muted-foreground">{new Date(transaction.timestamp.seconds * 1000).toLocaleString()}</p>
                        </div>
                        <div className="text-right">
                            <p className="font-bold text-lg">KES {transaction.amount.toLocaleString()}</p>
                            <p className={`text-sm font-semibold ${transaction.status === 'completed' ? 'text-green-500' : 'text-red-500'}`}>{transaction.status}</p>
                        </div>
                    </div>
                ))}
                </div>
            ) : (
                <p>No transactions yet.</p>
            )}
            </CardContent>
        </Card>
      </main>
    </div>
  );
}
