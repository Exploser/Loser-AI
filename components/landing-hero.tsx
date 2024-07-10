'use client';

import { useAuth } from "@clerk/nextjs";
import TypewriterComponent from 'typewriter-effect';
import { Button } from "./ui/button";
import Link from "next/link";

export const LandingHero = () => {
    const { isSignedIn } = useAuth();

    return (
        <div className="text-white font-bold py-36 text-center space-y-5">
            <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl space-y-5 font-extrabold h-full">
                Welcome to Loser AI
                <div className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                    <TypewriterComponent 
                        options = {{
                            strings: ["Chatbot", "Image Generation", "Music Generation", "Video Generation"],
                            autoStart: true,
                            loop: true,
                            delay: 50,
                        }}
                    />
                </div>
                <div className="text-sm md:text-xl font-light text-zinc-400">
                    Create AI generated content with ease
                </div>
                <div>
                    <Link href={isSignedIn ? '/dashboard' : '/sign-up'}>
                        <Button variant={'premium'} className="md:text-lg p-4 md:p-6 rounded-full font-semibold">
                            Start for Free!
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    )
};