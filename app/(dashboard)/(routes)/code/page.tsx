'use client';
import * as z from 'zod';
import Heading from "@/components/heading";
import { Code } from "lucide-react";
import { useForm } from "react-hook-form";
import { formSchema } from './constants';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import axios from 'axios';
import Empty from '@/components/empty';
import { Loader } from '@/components/loader';
import { cn } from '@/lib/utils';
import { UserAvatar } from '@/components/user-avatar';
import { BotAvatar } from '@/components/bot-avatar';
import ReactMarkdown from 'react-markdown';
import { useProModal } from '@/hooks/use-pro-modal';
import toast from 'react-hot-toast';

type ChatCompletionRequestMessage = {
    role: string;
    content: string;
};

const CodePage = () => {
    const proModal = useProModal();
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
            console.log(values.prompt);
            const userMessage: ChatCompletionRequestMessage = {
                role: 'user',
                content: values.prompt,
            };
            const newMessages = [userMessage, ...messages];
            console.log(newMessages);
            const response = await axios.post("/api/code", { messages: newMessages });
            console.log(response);
            setMessages((current) => [...current, userMessage, { role: 'assistant', content: response.data.content }]);
            form.reset();
        } catch (error: any) {
            if (error?.response?.status === 403) {
                proModal.onOpen();
            } else {
                toast.error("An error occurred. Please try again later.");
            }
        } finally {
            router.refresh();
        }
    };

    return (
        <div className='flex flex-col min-h-[95vh] justify-between'>
            <Heading
                title="Code Generation"
                description="This is the code page"
                icon={Code}
                iconColor="text-violet-500"
                bgColor="bg-green-700/10"
            />
            <div className="px-4 lg:px-8">
                <div className='space-y-4 mt-4'>
                    {messages.length === 0 && !isLoading && (
                        <div>
                            <Empty
                                label='Start a conversation by typing a message in the input above.'
                                />
                        </div>
                    )}
                    <div className='flex flex-col-reverse gap-y-4'>
                        {messages.slice().reverse().map((message, index) => (
                            <div key={index} className={cn(`p-8 w-full items-center flex gap-x-8 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`)}>
                                <div className={`p-4 flex flex-row rounded-lg ${message.role === 'user' ? 'bg-violet-500/10' : 'bg-violet-500/20'}`}>
                                    {message.role === 'user' ? <UserAvatar/> : <BotAvatar/>}
                                    <ReactMarkdown 
                                        components={{
                                            pre:({ node, ...props }) => (
                                                <div className='overflow-auto w-full my-2 bg-black/10 p-2 rounded-lg'>
                                                    <pre {...props} />
                                                </div>
                                            ),
                                            code:({ node, ...props }) => (
                                                <code className='bg-black/10 rounded-lg p-1' {...props} />
                                            )
                                        }}
                                        className={'text-sm mx-2 align-middle flex flex-col rounded-lg justify-center overflow-hidden'}
                                    >
                                        {message.content}
                                    </ReactMarkdown>
                                </div>
                            </div>
                        ))}
                    </div>
                        {isLoading && (
                            <div className='p-8 rounded-lg w-full flex items-center justify-center bg-muted'>
                                <Loader />
                            </div>
                        )}
                </div>
            </div>
            <div className='sticky bottom-0 bg-white'> 
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
                                            placeholder='Clean up the code and make it more readable.'
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
        </div>
    );
}

export default CodePage;