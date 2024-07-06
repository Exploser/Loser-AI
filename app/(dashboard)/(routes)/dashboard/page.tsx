'use client';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { UserButton } from "@clerk/nextjs";
import { ArrowRight, Code, ImageIcon, MessageSquare, Music, Settings, VideoIcon } from "lucide-react";
import { useRouter } from "next/navigation";

const tools = [
  {
    label: 'Conversation',
    icon: MessageSquare,
    color: 'text-violet-500',
    bgColor: 'bg-violet-500/10',
    href: '/conversation'
  },
  {
    label: 'Music Generation',
    icon: Music,
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-500/10',
    href: '/music'
  },
  {
    label: 'Image Generation',
    icon: ImageIcon,
    color: 'text-pink-500',
    bgColor: 'bg-pink-500/10',
    href: '/image'
  },
  {
    label: 'Video Generation',
    icon: VideoIcon,
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10',
    href: '/video'
  },
  {
    label: 'Code Generation',
    icon: Code,
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
    href: '/code'
  },
  {
    label: 'Settings',
    icon: Settings,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
    href: '/settings'
  },
]


const DashboardPage = () => {
  const router = useRouter();
  return (
    <div>
      <div className="mb-8 space-y-4">
        <h2 className="text-2xl md:text-4xl font-bold text-center">Dashboard</h2>
        <p className="text-muted-foreground font-light text-sm md:text-lg text-center">What if AI was made by a silly goose ?</p>
      </div>
      <div className="px-4 md:px-20 lg:px-32 space-y-4">
        {tools.map((tool, index) => (
          <Card
            key={index}
            onClick={() => router.push(tool.href)}
            className={'p-4 border-black/5 flex items-center justify-between hover:shadow-md transition cursor-pointer'}
          >
            <div className="flex items-center justify-center gap-x-4">
              <div className={cn('p-2 w-fit rounded-md', tool.bgColor)}>
                <tool.icon size={48} className={cn('w-8 h-8', tool.color)} />
              </div>
            </div>
            <div className="font-semibold">
              {tool.label}
            </div>
            <ArrowRight size={24} className="w-5 h-5" />
          </Card>
        ))}
      </div>
    </div>
  );
}

export default DashboardPage;
