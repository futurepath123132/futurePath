import { useState } from "react";
import Navbar from "@/components/Navbar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import emailjs from "@emailjs/browser";

export default function Feedback() {
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !message) {
      toast({ variant: "destructive", title: "All fields are required" });
      return;
    }

    setLoading(true);

    try {
      await emailjs.send(
        "service_pqcujlh",
        "template_t4fsgot",
        {
          from_name: name,
          from_email: email,
          message: message,
        },
        "daQDfDjwVtxEljRLL"
      );

      toast({ title: "Feedback sent!", description: "Thank you for your message." });
      setName("");
      setEmail("");
      setMessage("");
    } catch (err: any) {
      console.error(err);
      toast({ variant: "destructive", title: "Error", description: "Failed to send message." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Center Container */}
      <div className="flex justify-center items-center px-4 py-8">
        <div className="w-full max-w-lg">
          <h1 className="text-3xl font-bold text-foreground mb-6 text-center">
            Contact Us
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <Input
              placeholder="Your Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Textarea
              placeholder="Your Message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={6}
            />

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Sending..." : "Send Feedback"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
