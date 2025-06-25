"use client";

import { useEffect, useState } from "react";
import { CssBaseline, ThemeProvider, Box } from "@mui/material";
import { lightTheme } from "../../theme/theme";
import Sidebar from "../../components/Sidebar";
import { supabase } from "../../utils/supabase";
import LoginPage from "../../components/LoginPage";
import Appbar from "../../components/Appbar";
import { useRouter } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSession(session);
      setLoading(false);

      if (session) router.push("/dashboard");
    };

    getSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) router.push("/dashboard");
    });

    return () => subscription.unsubscribe();
  }, [router]);

  if (loading) return null;

  return (
    <ThemeProvider theme={lightTheme}>
      <CssBaseline />
      {!session ? (
        <LoginPage />
      ) : (
        <>
          <Appbar onToggle={() => setCollapsed(!collapsed)} />
          <Box display="flex">
            <Sidebar collapsed={collapsed} />
            <Box component="main" sx={{ flexGrow: 1, p: 3, mt: "64px" }}>
              {children}
            </Box>
          </Box>
        </>
      )}
    </ThemeProvider>
  );
}
