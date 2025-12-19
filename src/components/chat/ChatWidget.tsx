import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, X, Send, Loader2, RefreshCcw } from "lucide-react";
import { ChatMessage } from "./ChatMessage";
import { AnimatePresence, motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Message {
    role: "user" | "assistant";
    content: string;
}

// Simple type for the context data
interface UniversityContext {
    name: string;
    city: string;
    tuition_range?: string;
    disciplines?: string[];
    application_deadline?: string;
    study_mode?: string;
}

export default function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            role: "assistant",
            content:
                "Hi! I'm your education counselor. I can help recommend universities based on your marks, budget (e.g. 50k), or city (e.g. Lahore). What are you looking for?",
        },
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const { toast } = useToast();
    const [contextData, setContextData] = useState<UniversityContext[]>([]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    // Fetch context once on mount
    useEffect(() => {
        const fetchContext = async () => {
            const { data, error } = await supabase
                .from("universities")
                .select("name, city, tuition_range, disciplines, application_deadline, study_mode")
                .limit(50); // Limit to top 50 for now to keep context reasonable

            if (!error && data) {
                setContextData(data);
            }
        };
        fetchContext();
    }, []);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage: Message = { role: "user", content: input };
        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);

        try {
            let apiKey = import.meta.env.VITE_GEMINI_API_KEY;

            if (!apiKey) {
                throw new Error("Missing API Key");
            }

            // Clean request
            apiKey = apiKey.trim();

            // Dynamic Model Selection (First time only)
            let modelToUse = "gemini-1.5-flash"; // Default optimistic
            try {
                const modelsResp = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
                const modelsData = await modelsResp.json();

                if (modelsData.models) {
                    // Filter for models that support generateContent
                    const capableModels = modelsData.models
                        .filter((m: any) => m.supportedGenerationMethods && m.supportedGenerationMethods.includes("generateContent"))
                        .map((m: any) => m.name.replace("models/", ""));

                    console.log("Capable Gemini Models:", capableModels);

                    if (capableModels.length > 0) {
                        // Priority list
                        if (capableModels.includes("gemini-1.5-flash")) modelToUse = "gemini-1.5-flash";
                        else if (capableModels.includes("gemini-pro")) modelToUse = "gemini-pro";
                        else if (capableModels.includes("gemini-1.0-pro")) modelToUse = "gemini-1.0-pro";
                        else modelToUse = capableModels[0]; // Fallback to any capable model
                    } else {
                        console.warn("No models found with generateContent support. Using default.");
                    }
                }
            } catch (e) {
                console.warn("Failed to auto-detect models, using default:", modelToUse, e);
            }

            console.log("Selected Gemini Model:", modelToUse);

            // Construct system prompt with context
            const systemPrompt = `
You are 'FuturePath AI', a concise education counselor.
Goal: RECOMMEND universities from the provided list.

Database:
${JSON.stringify(contextData)}

STRICT RULES:
1. BREVITY: Max 3-4 sentences total.
2. STRUCTURE: Use bullet points for university names.
3. DATA: Only recommend from the provided database.
4. If no match: Say "I don't have data for that city/discipline yet."
5. No "Hello there!" or "I'd be happy to help" - get straight to the answer.
6. Use clear line breaks between sections.
      `;

            // Call Gemini API (Using gemini-pro as it's the most widely compatible free model)
            const response = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/${modelToUse}:generateContent?key=${apiKey}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        contents: [
                            {
                                role: "user",
                                parts: [
                                    {
                                        text: systemPrompt + "\n\nUser Question: " + input,
                                    },
                                ],
                            },
                        ],
                    }),
                }
            );

            const data = await response.json();

            if (data.error) {
                console.error("Gemini API Error:", data.error);
                throw new Error(data.error.message || "Failed to get AI response");
            }

            const aiText =
                data.candidates?.[0]?.content?.parts?.[0]?.text ||
                "I'm sorry, I couldn't process that.";

            setMessages((prev) => [
                ...prev,
                { role: "assistant", content: aiText },
            ]);
        } catch (error: any) {
            console.error("Chat error:", error);
            let errorMessage = "Failed to get a response. Please try again.";

            if (error.message === "Missing API Key") {
                errorMessage = "Configuration Error: VITE_GEMINI_API_KEY is missing in .env";
                setMessages((prev) => [
                    ...prev,
                    { role: "assistant", content: "⚠️ System Error: I am missing my brain (API Key). Please tell the developer to add VITE_GEMINI_API_KEY to the .env file." },
                ]);
            } else {
                // Show specific model error if available
                if (error.message.includes("is not found")) {
                    errorMessage = `Model Error: The selected model is not available for your API key. (Try verifying your key on Google AI Studio).`;
                } else {
                    errorMessage = "AI Error: " + error.message;
                }
                toast({ variant: "destructive", title: "Chat Error", description: errorMessage });
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                    >
                        <Card className="w-[350px] sm:w-[400px] h-[550px] shadow-2xl border-primary/20 flex flex-col bg-background/95 backdrop-blur-sm">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 border-b bg-primary/5">
                                <CardTitle className="text-sm font-bold flex items-center gap-2">
                                    <Bot className="w-4 h-4 text-primary" />
                                    AI Counselor
                                </CardTitle>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => setIsOpen(false)}
                                >
                                    <X className="w-4 h-4" />
                                </Button>
                            </CardHeader>
                            <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
                                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                    {messages.map((msg, idx) => (
                                        <ChatMessage
                                            key={idx}
                                            role={msg.role}
                                            content={msg.content}
                                        />
                                    ))}
                                    {isLoading && (
                                        <div className="flex justify-start p-2">
                                            <div className="bg-muted rounded-lg px-3 py-2 flex items-center gap-2 text-sm text-muted-foreground">
                                                <Loader2 className="w-3 h-3 animate-spin" />
                                                Thinking...
                                            </div>
                                        </div>
                                    )}
                                    <div ref={messagesEndRef} />
                                </div>
                                <div className="p-4 border-t bg-background">
                                    <form
                                        onSubmit={(e) => {
                                            e.preventDefault();
                                            handleSend();
                                        }}
                                        className="flex gap-2"
                                    >
                                        <Input
                                            value={input}
                                            onChange={(e) => setInput(e.target.value)}
                                            placeholder="e.g. Best CS uni in Lahore?"
                                            disabled={isLoading}
                                            className="flex-1"
                                        />
                                        <Button
                                            type="submit"
                                            size="icon"
                                            disabled={isLoading || !input.trim()}
                                        >
                                            <Send className="w-4 h-4" />
                                        </Button>
                                    </form>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>

            <Button
                onClick={() => setIsOpen(!isOpen)}
                size="lg"
                className="h-14 w-14 rounded-full shadow-lg bg-primary hover:bg-primary/90 text-primary-foreground transition-transform hover:scale-105"
            >
                {isOpen ? (
                    <X className="w-6 h-6" />
                ) : (
                    <MessageCircle className="w-6 h-6" />
                )}
            </Button>
        </div>
    );
}

// Helper component for icon
function Bot({ className }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="M12 2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2 2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" />
            <path d="M4 10a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8z" />
            <path d="M8 14v4" />
            <path d="M16 14v4" />
            <circle cx="9" cy="12" r="1" />
            <circle cx="15" cy="12" r="1" />
        </svg>
    );
}
