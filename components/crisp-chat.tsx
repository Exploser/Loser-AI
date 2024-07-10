"use client";

import { useEffect } from "react";
import { Crisp } from "crisp-sdk-web";

export const CrispChat = () => {
    useEffect(() => {
        Crisp.configure("f641d1f0-dfb7-429c-bbbd-7a011c930e58");
    }, []);
    
    return null;
};