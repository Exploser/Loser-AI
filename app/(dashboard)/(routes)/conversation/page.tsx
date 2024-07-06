'use client';
import * as z from 'zod';
import Heading from "@/components/heading";
import { MessageSquare } from "lucide-react";
import { useForm } from "react-hook-form";
import { formSchema } from './constants';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import axios from 'axios';

type ChatCompletionRequestMessage = {
    role: 'user' | 'assistant' | 'system';
    content: string;
};

const ConversationPage = () => {
    const router = useRouter();
    const [messages, setMessages] = useState<ChatCompletionRequestMessage[]>([]);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            prompt: "",
        },
    });

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const userMessage: ChatCompletionRequestMessage = {
                role: 'user',
                content: values.prompt,
            };
            const newMessages = [...messages, userMessage];
            const response = await axios.post("/api/conversation", { messages: newMessages });

            setMessages((current) => [...current, userMessage, { role: 'assistant', content: response.data.choices[0].message.content }]);
            form.reset();
        } catch (error) {
            //Todo: Open pro modal
            console.error(error);
        } finally {
            router.refresh();
        }
    };

    return ( 
        <div>
            <Heading
                title="Conversation"
                description="This is the conversation page"
                icon={MessageSquare}
                iconColor="text-violet-500"
                bgColor="bg-violet-500/10"
            />
            <div className="px-4 lg:px-8">
                <div>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}
                            className="rounded-lg border w-full p-4 px-3 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2"
                        >
                            <FormField
                                name="prompt"
                                render={({ field }) => (
                                    <FormItem className='col-span-12 lg:col-span-10'>
                                        <FormControl className='m- p-0'>
                                            <Input 
                                                className='border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent'
                                                disabled={isLoading}
                                                placeholder='How much a person would need to eat to release 1kg of poop ?'
                                                {...field}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <Button className='col-span-12 lg:col-span-2 w-full' disabled={isLoading}>
                                Generate
                            </Button>
                        </form>
                    </Form>
                </div>
                <div className='space-y-4 mt-4'>
                    <div className='flex flex-col-reverse gap-y-4'>
                        {messages.map((message, index) => (
                            <div key={index} className={`flex gap-2 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`p-4 rounded-lg ${message.role === 'user' ? 'bg-violet-500/10' : 'bg-violet-500/20'} text-sm`}>
                                    {message.content}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
     );
}
 
export default ConversationPage;