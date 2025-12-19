import { cn } from "@/lib/utils";
import { User, Bot } from "lucide-react";

interface ChatMessageProps {
    role: "user" | "assistant";
    content: string;
}

export function ChatMessage({ role, content }: ChatMessageProps) {
    return (
        <div
            className={cn(
                "flex w-full items-start gap-2 p-2",
                role === "user" ? "flex-row-reverse" : "flex-row"
            )}
        >
            <div
                className={cn(
                    "flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-full border",
                    role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground"
                )}
            >
                {role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
            </div>
            <div
                className={cn(
                    "rounded-2xl px-4 py-2 text-sm max-w-[85%] whitespace-pre-wrap shadow-sm leading-relaxed",
                    role === "user"
                        ? "bg-primary text-primary-foreground rounded-tr-none"
                        : "bg-muted text-foreground rounded-tl-none"
                )}
            >
                {content}
            </div>
        </div>
    );
}
