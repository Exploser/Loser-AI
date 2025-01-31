'use client';

import { Zap } from "lucide-react";
import { Button } from "./ui/button";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";

interface SubscriptionButtonProps {
    isPro: boolean;
}

export const SubscriptionButton = ({
    isPro = false
}: SubscriptionButtonProps ) => {
    const [loading, setLoading] = useState(false);
    const onClick = async () => {
        try{
            setLoading(true);
            const response = await axios.get('/api/stripe');
            if (response.data.url) {
                window.location.href = response.data.url;
            }
        } catch (error) {
            console.error(error);
            toast.error("An error occurred. Please try again later.");
        } finally {
            setLoading(false);
        }
    };
    return (
        <Button disabled={loading} variant={isPro ? 'default': 'premium'} onClick={onClick} >
            {isPro ? "Manage Subscription" : "Upgrade to Pro"}
            {!isPro && <Zap className="w-4 h-4 ml-2 fill-white" />}
        </Button>
    );
};