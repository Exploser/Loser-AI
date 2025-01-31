'use client';
import * as z from 'zod';
import Heading from "@/components/heading";
import { MessageSquare, VideoIcon } from "lucide-react";
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
import { useProModal } from '@/hooks/use-pro-modal';
import toast from 'react-hot-toast';

const VideoPage = () => {
    const proModal = useProModal();
    const router = useRouter();
    const [video, setVideo] = useState<string>();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            prompt: "",
        },
    });

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            setVideo(undefined);
            const response = await axios.post("/api/video", values);
            setVideo(response.data[0]);
            form.reset();
        } catch (error : any) {
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
                title="Video Generation"
                description="This is the Video generation page"
                icon={VideoIcon}
                iconColor="text-orange-700"
                bgColor="bg-orange-700/10"
            />
            <div className="px-4 lg:px-8">
                <div className='space-y-4 mt-4'>
                    {!video && !isLoading && (
                        <div>
                            <Empty
                                label='Generate videos from your dreams.'
                            />
                        </div>
                    )}
                    {video && (
                        <div className='p-8 rounded-lg w-full flex items-center justify-center bg-muted'>
                            <video
                                className='w-full rounded-lg aspect-video mt-8 border'
                                controls
                                src={video}
                            />
                        </div>
                    )}
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
                                            placeholder='Thanos hitting the griddy on a Sunday afternoon.'
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

export default VideoPage;