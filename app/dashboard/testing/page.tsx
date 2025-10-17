"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/auth-context";
import { getAccounts, getUserProfile } from "@/lib/actions";
import { Copy, Loader2, CheckCircle2, XCircle } from "lucide-react";

export default function TestingPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [accounts, setAccounts] = useState<any[]>([]);
  const [accountId, setAccountId] = useState("");
  const [amount, setAmount] = useState("1");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [response, setResponse] = useState<any>(null);

  useEffect(() => {
    if (user) {
      const fetchData = async () => {
        const profile = await getUserProfile(user.uid);
        if (profile?.apiKey) {
          setApiKey(profile.apiKey);
        }

        const userAccounts = await getAccounts(user.uid);
        setAccounts(userAccounts);
        if (userAccounts.length > 0) {
          setAccountId(userAccounts[0].id);
        }
      };
      fetchData();
    }
  }, [user]);

  const handleTest = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResponse(null);

    try {
      const res = await fetch("https://api.pexmon.one/api/mpesa/stkPush", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": `${apiKey}`,
        },
        body: JSON.stringify({
          accountId,
          amount: parseFloat(amount),
          phoneNumber,
        }),
      });

      const data = await res.json();
      setResponse(data);

      if (res.ok) {
        toast({
          title: "Request sent!",
          description: "STK push has been initiated successfully.",
        });
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to send STK push.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to test STK push. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Copied!",
      description: "Code copied to clipboard.",
    });
  };

  const nodeJsCode = `const axios = require('axios');

const stkPush = async () => {
  try {
    const response = await axios.post(
      'https://pexhub-api.onrender.com/api/mpesa/stkPush',
      {
        amount: ${amount || "1"},
        phoneNumber: '${phoneNumber || "254712345678"}',
        accountId: '${accountId || "YOUR_ACCOUNT_ID"}'
      },
      {
        headers: {
          'x-api-key': '${apiKey || "YOUR_API_KEY_HERE"}'
        }
      }
    );

    console.log('Success:', response.data);
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
};

stkPush();`;

  const pythonCode = `import requests

def stk_push():
    url = 'https://pexhub-api.onrender.com/api/mpesa/stkPush'
    headers = {
        'x-api-key': '${apiKey || "YOUR_API_KEY_HERE"}',
        'Content-Type': 'application/json'
    }
    data = {
        'amount': ${amount || "1"},
        'phoneNumber': '${phoneNumber || "254712345678"}',
        'accountId': '${accountId || "YOUR_ACCOUNT_ID"}'
    }

    try:
        response = requests.post(url, json=data, headers=headers)
        response.raise_for_status()
        print('Success:', response.json())
    except requests.exceptions.RequestException as e:
        print('Error:', e)

stk_push()`;

  const curlCode = `curl -X POST https://pexhub-api.onrender.com/api/mpesa/stkPush \\
  -H "x-api-key: ${apiKey || "YOUR_API_KEY_HERE"}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "amount": ${amount || "1"},
    "phoneNumber": "${phoneNumber || "254712345678"}",
    "accountId": "${accountId || "YOUR_ACCOUNT_ID"}"
  }'`;

  return (
    <div className="p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl space-y-8"
      >
        <div>
          <h1 className="text-4xl font-bold mb-2">Testing</h1>
          <p className="text-muted-foreground">
            Test your M-Pesa STK Push integration
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Live Test</CardTitle>
              <CardDescription>
                Send a real STK push request to test your integration
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleTest} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="apiKey">API Key</Label>
                  <Input
                    id="apiKey"
                    type="text"
                    placeholder="Your API key will appear here"
                    value={apiKey}
                    readOnly
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="accountId">Account</Label>
                  <Select onValueChange={setAccountId} value={accountId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an account" />
                    </SelectTrigger>
                    <SelectContent>
                      {accounts.map((acc) => (
                        <SelectItem key={acc.id} value={acc.id}>
                          {acc.name} - {acc.id}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amount">Amount (KES)</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="1"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                    min="1"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="254712345678"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Format: 254XXXXXXXXX (without + or spaces)
                  </p>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90"
                  disabled={loading || !apiKey || !accountId}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Send STK Push"
                  )}
                </Button>
              </form>

              {response && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 p-4 rounded-lg bg-muted"
                >
                  <div className="flex items-center space-x-2 mb-2">
                    {response.error ? (
                      <XCircle className="h-5 w-5 text-destructive" />
                    ) : (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    )}
                    <span className="font-semibold">
                      {response.error ? "Error" : "Success"}
                    </span>
                  </div>
                  <pre className="text-xs overflow-auto">
                    {JSON.stringify(response, null, 2)}
                  </pre>
                </motion.div>
              )}
            </CardContent>
          </Card>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Code Examples</CardTitle>
                <CardDescription>
                  Copy and paste these examples into your application
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="nodejs">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="nodejs">Node.js</TabsTrigger>
                    <TabsTrigger value="python">Python</TabsTrigger>
                    <TabsTrigger value="curl">cURL</TabsTrigger>
                  </TabsList>

                  <TabsContent value="nodejs" className="space-y-2">
                    <div className="relative">
                      <pre className="p-4 bg-muted rounded-lg text-xs overflow-auto max-h-96">
                        {nodeJsCode}
                      </pre>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="absolute top-2 right-2"
                        onClick={() => copyCode(nodeJsCode)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="python" className="space-y-2">
                    <div className="relative">
                      <pre className="p-4 bg-muted rounded-lg text-xs overflow-auto max-h-96">
                        {pythonCode}
                      </pre>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="absolute top-2 right-2"
                        onClick={() => copyCode(pythonCode)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="curl" className="space-y-2">
                    <div className="relative">
                      <pre className="p-4 bg-muted rounded-lg text-xs overflow-auto max-h-96">
                        {curlCode}
                      </pre>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="absolute top-2 right-2"
                        onClick={() => copyCode(curlCode)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>API Endpoint</CardTitle>
              </CardHeader>
              <CardContent>
                <code className="p-3 bg-muted rounded block text-sm">
                  POST https://pexhub-api.onrender.com/api/mpesa/stkPush
                </code>
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
