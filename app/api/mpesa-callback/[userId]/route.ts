'use server'
import { NextResponse } from 'next/server';
import { getFirestore, collection, query, where, getDocs, writeBatch } from 'firebase/firestore';
import { app } from '@/lib/firebase/client';
import { generateApiKey } from '@/lib/actions';

const db = getFirestore(app);

export async function POST(req: Request, { params }: { params: { userId: string } }) {
    try {
        const { userId } = params;
        const mpesaCallbackData = await req.json();

        console.log(`M-Pesa callback received for user ${userId}:`, mpesaCallbackData);

        const { Body } = mpesaCallbackData;

        if (Body && Body.stkCallback && Body.stkCallback.ResultCode === 0) {
            const { CheckoutRequestID } = Body.stkCallback;

            const pendingPaymentsRef = collection(db, 'pendingPayments');
            const q = query(pendingPaymentsRef, where("checkoutRequestID", "==", CheckoutRequestID));

            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                throw new Error('Pending payment not found.');
            }

            const pendingPaymentDoc = querySnapshot.docs[0];
            const pendingPaymentData = pendingPaymentDoc.data();

            if (pendingPaymentData.userId !== userId) {
                throw new Error('User ID mismatch.');
            }

            const { plan, isAnnual } = pendingPaymentData;

            await generateApiKey(userId, plan, isAnnual);

            const batch = writeBatch(db);
            batch.delete(pendingPaymentDoc.ref);
            await batch.commit();

            return NextResponse.json({ message: 'API key generated successfully' });
        } else {
            const resultDesc = Body?.stkCallback?.ResultDesc || 'Unknown error.';
            console.error(`M-Pesa payment failed or callback is malformed for user ${userId}.`, mpesaCallbackData);
            return new NextResponse(JSON.stringify({ error: `Payment failed: ${resultDesc}` }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }
    } catch (error: any) {
        console.error('Error processing M-Pesa callback:', error);
        return new NextResponse(JSON.stringify({ error: error.message || 'Failed to process callback' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
