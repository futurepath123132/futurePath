import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoaderProps {
    className?: string;
    size?: number | string;
    center?: boolean;
}

export function Loader({ className, size, center = false }: LoaderProps) {
    const content = (
        <Loader2
            className={cn("animate-spin text-primary", className)}
            size={size}
        />
    );

    if (center) {
        return (
            <div className="flex items-center justify-center p-8 w-full h-full min-h-[100px]">
                {content}
            </div>
        );
    }

    return content;
}
