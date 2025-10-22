'use server';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { getFirestore, doc, setDoc, updateDoc, arrayUnion, arrayRemove, getDoc, deleteField, Timestamp } from 'firebase/firestore';
import { app } from './firebase/client';
import axios from 'axios';

const auth = getAuth(app);
const db = getFirestore(app);
const API_BASE_URL = process.env.SERVER_BASE_URL || 'https://sebastian-judicative-valorie.ngrok-free.dev';

// Helper function to convert Firestore Timestamps to ISO strings
const convertTimestamps = (data: any) => {
    for (const key in data) {
        if (data[key] instanceof Timestamp) {
            data[key] = data[key].toDate().toISOString();
        }
    }
    return data;
}

export const signUp = async (email: string, password: string) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;
  await setDoc(doc(db, "users", user.uid), {
    email: user.email,
    createdAt: new Date(),
    accounts: [],
    transactions: [],
    hasUsedTrial: false,
  });
  return {
    uid: user.uid,
    email: user.email,
  };
};

export const logIn = async (email: string, password: string) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;
  return {
    uid: user.uid,
    email: user.email,
  };
};

export const setWebhookUrl = async ({ userId, webhookUrl }: { userId: string, webhookUrl: string }) => {
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, {
    webhookUrl: webhookUrl,
  });
};

export const addAccount = async (
    userId: string,
    account: {
        name: string;
        type: 'till' | 'business';
        tillNumber?: string;
        businessNumber?: string;
        accountNumber?: string;
    }
) => {
    const userRef = doc(db, 'users', userId);

    const accountId = `pex${Math.random().toString(16).slice(2, 10)}`;

    const newAccount: any = {
      id: accountId,
      name: account.name,
      type: account.type
    };

    if (account.type === 'till') {
      newAccount.tillNumber = account.tillNumber;
    } else if (account.type === 'business') {
      newAccount.businessNumber = account.businessNumber;
      newAccount.accountNumber = account.accountNumber;
    }

    await updateDoc(userRef, {
        accounts: arrayUnion(newAccount)
    });
};

export const deleteAccount = async (userId: string, accountId: string) => {
  const userRef = doc(db, 'users', userId);
  const userSnap = await getDoc(userRef);
  if (userSnap.exists()) {
    const userData = userSnap.data();
    const accounts = userData.accounts || [];
    const accountToDelete = accounts.find((acc: any) => acc.id === accountId);
    if (accountToDelete) {
      await updateDoc(userRef, {
        accounts: arrayRemove(accountToDelete),
      });
    }
  }
};

export const updateAccount = async (userId: string, updatedAccount: any) => {
  const userRef = doc(db, 'users', userId);
  const userSnap = await getDoc(userRef);
  if (userSnap.exists()) {
    const userData = userSnap.data();
    const accounts = userData.accounts || [];
    const accountIndex = accounts.findIndex((acc: any) => acc.id === updatedAccount.id);
    if (accountIndex > -1) {
      accounts[accountIndex] = updatedAccount;
      await updateDoc(userRef, {
        accounts: accounts,
      });
    }
  }
};

export const getAccounts = async (userId: string) => {
  const userRef = doc(db, 'users', userId);
  const userSnap = await getDoc(userRef);
  if (userSnap.exists()) {
    const userData = userSnap.data();
    return userData.accounts || [];
  }
  return [];
};

export const getUserProfile = async (userId: string) => {
  const userRef = doc(db, 'users', userId);
  const userSnap = await getDoc(userRef);
  if (userSnap.exists()) {
    const data = userSnap.data();
    return convertTimestamps(data);
  }
  return null;
};

export const generateApiKey = async (userId: string, plan: string, isAnnual: boolean) => {
  const userRef = doc(db, 'users', userId);
  console.log('userId', userId)
  const userSnap = await getDoc(userRef);
  const creationSecret = process.env.KEY_GENERATION_SECRET;

  if (!userSnap.exists()) {
    throw new Error("User not found");
  }

  const userData = userSnap.data();

  if (plan === 'trial' && userData.hasUsedTrial) {
    throw new Error("Free trial has already been used.");
  }

  let expiresInDays;
  if (plan === 'trial') {
    expiresInDays = 14;
  } else if (plan === 'pro' && isAnnual) {
    expiresInDays = 365;
  } else if (plan === 'pro' && !isAnnual) {
    expiresInDays = 30;
  } else {
    throw new Error("Invalid plan specified.");
  }

  try {
    const response = await axios.post(`${API_BASE_URL}/api/auth/generate-key`, { userId, expiresInDays }, {
      headers: {
        'Content-Type': 'application/json',
        'x-generation-secret': `${creationSecret}`,
      },
    });

    const { apiKey, expiresAt } = response.data;

    const expiryDate = new Date(expiresAt);

    const updateData: any = {
      apiKey: apiKey,
      plan: plan,
      apiKeyExpiry: expiryDate,
    };

    if (plan === 'trial') {
      updateData.hasUsedTrial = true;
    }

    await updateDoc(userRef, updateData);

    return { apiKey, expiryDate: expiryDate.toISOString() };

  } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to generate API key.';
      throw new Error(errorMessage);
  }
};

export const deleteApiKey = async (userId: string) => {
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, {
    apiKey: deleteField(),
    plan: deleteField(),
    apiKeyExpiry: deleteField(),
  });
};

export const logTransaction = async (
    userId: string,
    transaction: {
        amount: number;
        transactionId: string;
        timestamp: Date;
        status: 'completed' | 'failed' | 'pending';
    }
) => {
    const transactionRef = doc(db, 'transactions', transaction.transactionId);
    await setDoc(transactionRef, {
        ...transaction,
        userId,
    });

    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
        transactions: arrayUnion(transaction.transactionId)
    });
};

export const getTransactions = async (userId: string, limit = 10) => {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
        const userData = userSnap.data();
        const transactionIds = userData.transactions || [];

        if (transactionIds.length === 0) {
            return [];
        }

        const transactions: any[] = [];
        const transactionIdsToFetch = transactionIds.slice(-limit);

        for (const transactionId of transactionIdsToFetch) {
            const transactionRef = doc(db, 'transactions', transactionId);
            const transactionSnap = await getDoc(transactionRef);
            if (transactionSnap.exists()) {
                transactions.push({ id: transactionSnap.id, ...transactionSnap.data() });
            }
        }

        return transactions.reverse();
    }

    return [];
}

export const initiateStkPush = async ({
  apiKey,
  accountId,
  amount,
  phoneNumber,
}: {
  apiKey: string;
  accountId: string;
  amount: number;
  phoneNumber: string;
}) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/api/mpesa/stkPush`, {
            accountId,
            amount,
            phoneNumber,
        }, {
            headers: {
                "Content-Type": "application/json",
                "x-api-key": apiKey,
            },
        });
        console.log(response.data);
        return response.data;
    } catch (error: any) {
        const errorMessage = error.response?.data?.error || error.message || "Failed to send STK push.";
        console.error('Error: ', errorMessage);
        throw new Error(errorMessage);
    }
};

export const initiatePayment = async (userId: string, phoneNumber: string, amount: number) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/api/mpesa/initiatePayment`, {
            userId,
            phoneNumber,
            amount
        });
        console.log(response.data);
        return response.data;
    } catch (error: any) {
        const errorMessage = error.response?.data?.error || error.message || "Failed to initiate payment.";
        console.error('Error: ', errorMessage);
        throw new Error(errorMessage);
    }
};
