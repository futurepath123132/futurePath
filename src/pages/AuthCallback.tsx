import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const loadSession = async () => {
      // This forces Supabase to process the OAuth callback hash in the URL
      await supabase.auth.getSession();

      // Redirect after successful login
      navigate("/");
    };

    loadSession();
  }, [navigate]);

  return (
    <div className="flex h-screen items-center justify-center text-lg">
      Signing you in...
    </div>
  );
}
