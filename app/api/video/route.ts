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
          "anotherjesse/zeroscope-v2-xl:9f747673945c62801b13b84701c783929c0ee784e4748ec062204894dda1a351",
          {
            input: {
              fps: 24,
              model: "xl",
              width: 1024,
              height: 576,
              prompt: prompt,
              batch_size: 1,
              num_frames: 24,
              init_weight: 0.5,
              guidance_scale: 17.5,
              negative_prompt: "very blue, dust, noisy, washed out, ugly, distorted, broken",
              remove_watermark: false,
              num_inference_steps: 50
            }
          }
        );
        console.log(response);

        await increaseApiLimit();
        return NextResponse.json(response);
    } catch (error) {
        console.log("[VIDEO_ERROR]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
