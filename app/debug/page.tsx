"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function DebugPage() {
  const [session, setSession] = useState<unknown>(null);
  const [user, setUser] = useState<unknown>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      try {
        // Check session
        const { data: sessionData } = await supabase.auth.getSession();
        setSession(sessionData.session);
        
        // Check user
        const { data: userData } = await supabase.auth.getUser();
        setUser(userData.user);
        
        console.log("Session:", sessionData.session);
        console.log("User:", userData.user);
      } catch (error) {
        console.error("Auth check error:", error);
      } finally {
        setLoading(false);
      }
    }
    
    checkAuth();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Auth Debug</h1>
      
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold">Session Status</h2>
          <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto">
            {session ? JSON.stringify(session, null, 2) : "No session"}
          </pre>
        </div>
        
        <div>
          <h2 className="text-lg font-semibold">User Status</h2>
          <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto">
            {user ? JSON.stringify(user, null, 2) : "No user"}
          </pre>
        </div>
        
        <div>
          <h2 className="text-lg font-semibold">Cookies</h2>
          <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto">
            {document.cookie || "No cookies"}
          </pre>
        </div>
      </div>
    </div>
  );
}
