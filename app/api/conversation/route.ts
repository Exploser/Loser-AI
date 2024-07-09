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

        // Log the entire request body for debugging
        console.log("[CONVERSATION_REQUEST_BODY]", body);

        // Extract the message from the messages array
        const { messages } = body;
        const message = messages?.[0]?.content;
        console.log("[CONVERSATION_REQUEST_MESSAGEs]", messages);

        // Additional logging for debugging
        console.log("[CONVERSATION_REQUEST_MESSAGE]", message);
        console.log("[CONVERSATION_USER_ID]", userId);

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

        if (!freeTrial) {
            return new NextResponse("Payment Required: Free trial limit exceeded", { status: 403 });
        }

        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: 'user', content: message }]
        });
        console.log("[CONVERSATION_RESPONSE]", response.choices[0].message);

        await increaseApiLimit();
        return NextResponse.json(response.choices[0].message);
    } catch (error) {
        console.log("[CONVERSATION_ERROR]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
