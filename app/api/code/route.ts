import { checkApiLimit, increaseApiLimit } from '@/lib/api-limit';
import { checkSubscription } from '@/lib/subscription';
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

        // Extract the message from the messages array
        const { messages } = body;
        const message = messages?.[0]?.content;

        if (!message) {
            return new NextResponse("Bad Request: 'message' field is required", { status: 400 });
        }
        if (!userId) {
            return new NextResponse("Unauthorized: User ID is missing", { status: 401 });
        }
        if (!process.env.OPENAI_API_KEY) {
            return new NextResponse("Internal Server Error: OpenAI API key not configured", { status: 500 });
        }

        const freeTrial = await checkApiLimit();
        const isPro = await checkSubscription();

        if (!freeTrial && !isPro) {
            return new NextResponse("Payment Required: Free trial limit exceeded", { status: 403 });
        }

        const contextualMessage = 'You are a code generator. Please generate code for the following prompt: ' + message;

        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { role: 'user', content: contextualMessage }
            ]
        });

        if (!isPro) {
            await increaseApiLimit();
        }

        return NextResponse.json(response.choices[0].message);

    } catch (error) {
        console.log("[CODE_ERROR]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
