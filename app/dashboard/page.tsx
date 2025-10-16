'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getTransactions } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import withAuth from '@/components/auth/withAuth';
import { useAuth } from '@/context/auth-context';

function DashboardPage() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      const fetchTransactions = async () => {
        const fetchedTransactions = await getTransactions(user.uid, 5);
        setTransactions(fetchedTransactions);
        setLoading(false);
      };

      fetchTransactions();
    }
  }, [user]);

  const totalVolume = transactions.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <header className="mb-8 flex justify-between items-center">
        <div>
            <h1 className="text-4xl font-bold text-primary">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back to your PexPay dashboard.</p>
        </div>
      </header>

      <main className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Total Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{transactions.length}</p>
          </CardContent>
        </Card>

        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Total Volume</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">KES {totalVolume.toLocaleString()}</p>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 lg:col-span-3">
            <CardHeader className="flex flex-row justify-between items-center">
                <CardTitle>Recent Transactions</CardTitle>
                <Link href="/dashboard/transactions">
                    <Button variant="outline">View All</Button>
                </Link>
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

export default withAuth(DashboardPage);
