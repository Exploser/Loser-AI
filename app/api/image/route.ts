import { checkApiLimit, increaseApiLimit } from '@/lib/api-limit';
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
    try {
        const { userId } = auth();
        const body = await req.json();
        const { prompt, amount = 1, resolution = '512x512' } = body;
        console.log("[CONVERSATION_REQUEST_MESSAGEs]", body);

        if (!prompt) {
            return new NextResponse("Bad Request: 'Prompt' field is required", { status: 400 });
        }
        if (!amount) {
            return new NextResponse("Bad Request: 'Amount' field is required", { status: 400 });
        }
        if (!resolution) {
            return new NextResponse("Bad Request: 'Resolution' field is required", { status: 400 });
        }
        if (!userId) {
            return new NextResponse("Unauthorized: User ID is missing", { status: 401 });
        }
        if (!process.env.OPENAI_API_KEY) {
            return new NextResponse("Internal Server Error: OpenAI API key not configured", { status: 500 });
        }

        const freeTrial = await checkApiLimit();

        if (!freeTrial) {
            return new NextResponse("Payment Required: Free trial limit exceeded", { status: 403 });
        }

        const response = await openai.images.generate({
            prompt,
            n: parseInt(amount),
            size: resolution,
        });

        console.log("[IMAGE_RESPONSE]", response.data);

        await increaseApiLimit();
        return NextResponse.json(response.data);
    } catch (error) {
        console.log("[IMAGE_ERROR]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
