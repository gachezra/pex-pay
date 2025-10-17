'use server';
import { NextRequest, NextResponse } from 'next/server';
import { generateApiKey } from '@/lib/actions';

interface MpesaCallbackBody {
  Body: {
    stkCallback: {
      ResultCode: number;
      ResultDesc: string;
      CallbackMetadata?: {
        Item: {
          Name: string;
          Value: string | number;
        }[];
      };
    };
  };
}

interface CustomCallbackBody {
  userId: string;
  plan: string;
  isAnnual: boolean;
  apiKey: string;
  mpesaCallback: MpesaCallbackBody;
}

export async function POST(req: NextRequest) {
  try {
    const body: CustomCallbackBody = await req.json();

    const { userId, plan, isAnnual, mpesaCallback } = body;

    if (mpesaCallback.Body.stkCallback.ResultCode === 0) {
      // Payment was successful
      await generateApiKey(userId, plan, isAnnual);
      return NextResponse.json({ message: 'Webhook received and processed successfully.' });
    } else {
      // Payment failed or was cancelled
      console.error('Payment failed:', mpesaCallback.Body.stkCallback.ResultDesc);
      return NextResponse.json({ message: 'Payment failed or was cancelled.' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error processing M-Pesa callback:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
