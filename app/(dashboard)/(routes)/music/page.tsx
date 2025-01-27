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
import Empty from '@/components/empty';
import { Loader } from '@/components/loader';
import { useProModal } from '@/hooks/use-pro-modal';
import Image from 'next/image';
import toast from 'react-hot-toast';

const MusicPage = () => {
    const proModal = useProModal();
    const router = useRouter();
    const [music, setMusic] = useState<string>();
    const [image, setImage] = useState<string>();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            prompt: "",
        },
    });

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            setMusic(undefined);
            const response = await axios.post("/api/music", values);
            setMusic(response.data.audio);
            setImage(response.data.spectrogram);
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
                title="Music Generation"
                description="This is the Music generation page"
                icon={MessageSquare}
                iconColor="text-emerald-500"
                bgColor="bg-emerald-500/10"
            />
            <div className="px-4 lg:px-8">
                <div className='space-y-4 mt-4'>
                    {!music && !isLoading && (
                        <div>
                            <Empty
                                label='Generate music from your dreams.'
                            />
                        </div>
                    )}
                    { image && (
                            <div className='px-8 rounded-lg w-full flex items-center justify-center '>
                                <Image src={image} alt='Spectrogram' width={512} height={512} />
                            </div>
                    )}
                    {music && (
                        <audio controls className='w-full mt-8'>
                            <source src={music}/>
                            Your browser does not support the audio element.
                        </audio>
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
                                            placeholder='Melodic Riff, Chord Progression, or Lyrics?'
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

export default MusicPage;