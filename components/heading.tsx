import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface HeadingProps {
    title: string;
    description: string;
    icon: LucideIcon;
    iconColor?: string;
    bgColor?: string;
}

const Heading = ({
    title,
    description,
    icon: Icon,
    iconColor,
    bgColor,
}: HeadingProps) => {

    return (
            <div className="px-4 lg:px-8 flex items-center gap-x-3 mb-8">
                <div className={cn("p-2 w-fit rounded-md", bgColor)}>
                    <Icon className={cn("w-10 h-10", iconColor)} size={48} />
                </div>
            <div className="px-4">
                <h2 className="text-3xl md:text-4xl font-bold">{title}</h2>
                <p className="text-muted-foreground font-light text-sm md:text-lg">{description}</p>
            </div>
            </div>
    );
}

export default Heading;