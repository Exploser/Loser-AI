import { checkApiLimit, increaseApiLimit } from '@/lib/api-limit';
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function POST(req: Request) {
    try {
        const { userId } = auth();
        const body = await req.json();
        const { prompt } = body;


        if (!prompt) {
            return new NextResponse("Bad Request: 'prompt' field is required", { status: 400 });
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
        const response = await replicate.run(
            "riffusion/riffusion:8cf61ea6c56afd61d8f5b9ffd14d7c216c0a93844ce2d82ac1c9ecc9c7f24e05",
            {
              input: {
                prompt_a: prompt,
              }
            }
          );
          console.log(response);

        await increaseApiLimit();
        return NextResponse.json(response);
    } catch (error) {
        console.log("[CONVERSATION_ERROR]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
