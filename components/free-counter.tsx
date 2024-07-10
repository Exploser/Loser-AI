'use client';
import { useEffect, useState } from "react";
import { Card, CardContent } from "./ui/card";
import { MAX_FREE_COUNTS } from "@/constants";
import { Progress } from "./ui/progress";
import { Button } from "./ui/button";
import { Zap } from "lucide-react";
import { useProModal } from "@/hooks/use-pro-modal";

interface FreeCounterProps {
    apiLimitCount: number;
    isPro: boolean;
}

export const FreeCounter = ({
    apiLimitCount=0,
    isPro=false 
} : FreeCounterProps) => {
    const proModal = useProModal();
    const [mounter, setMounter] = useState(false);

    useEffect(() => {
        setMounter(true);
    }, []);

    if (!mounter) return null;
    if (isPro) return null;

    return (
        <div className="px-3">
            <Card className="bg-gray-50/10 border-0">
                <CardContent className="py-6">
                    <div className="text-sm text-white/70 text-center mb-4 space-y-2">
                        <p>
                            {apiLimitCount} / {MAX_FREE_COUNTS} Free Usage
                        </p>
                        <Progress value={(apiLimitCount / MAX_FREE_COUNTS) * 100} className='h-3'/>
                    </div>
                    <Button onClick={proModal.onOpen} className='w-full rounded-xl' variant={"premium"}>
                        Upgrade!
                        <Zap size={16} className='ml-2'/>
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}