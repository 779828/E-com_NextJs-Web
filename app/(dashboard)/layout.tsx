"use client";

import { useEffect, useState } from "react";
import {
  CssBaseline,
  ThemeProvider,
  Box,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { lightTheme } from "../../theme/theme";
import Sidebar from "../../components/Sidebar";
import { supabase } from "../../utils/supabase";
import LoginPage from "../../components/LoginPage";
import Appbar from "../../components/Appbar";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const [collapsed, setCollapsed] = useState(isMobile);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      console.log("Session:", session);
      setSession(session);

      if (session) {
        const { data, error } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", session.user.id)
          .single();

        if (error) {
          console.error("Profile fetch error:", error);
        } else {
          console.log("Profile data:", data);
          setProfile(data?.role);

          if (data?.role !== "admin") {
            router.push("/login");
          } else {
            router.push("/dashboard");
          }
        }
      }
      setLoading(false);
    };

    getSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("Auth state changed:", session);
      setSession(session);
      if (session) {
        getSession();
      } else {
        router.push("/login");
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  useEffect(() => {
    setCollapsed(isMobile);
  }, [isMobile]);

  if (loading) return null;

  return (
    <ThemeProvider theme={lightTheme}>
      <CssBaseline />
      {!session || profile !== "admin" ? (
        <LoginPage />
      ) : (
        <Box
          sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
        >
          <Appbar
            onToggle={() => setCollapsed(!collapsed)}
            collapsed={collapsed}
          />
          <Box
            sx={{
              display: "flex",
              flexGrow: 1,
              flexDirection: { xs: "column", sm: "row" },
              mt: isMobile ? "56px" : "40px",
              ml: isMobile ? "56px" : "0",
            }}
          >
            <Sidebar
              collapsed={collapsed}
              setCollapsed={setCollapsed}
              sx={{
                position: { xs: "fixed", sm: "relative" },
                zIndex: 1200,
                width: collapsed
                  ? { xs: 0, sm: "80px" }
                  : { xs: "250px", sm: "250px" },
                height: { xs: "100%", sm: "auto" },
                transform: {
                  xs: collapsed ? "translateX(-100%)" : "translateX(0)",
                  sm: "none",
                },
                transition:
                  "transform 0.3s ease-in-out, width 0.3s ease-in-out",
                backgroundColor: theme.palette.background.paper,
                overflowY: "auto",
              }}
            />
            {isMobile && !collapsed && (
              <Box
                sx={{
                  position: "fixed",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                  zIndex: 1199,
                  display: { sm: "none" },
                }}
                onClick={() => setCollapsed(true)}
              />
            )}
            <Box
              component="main"
              sx={{
                flexGrow: 1,
                p: { xs: 1, sm: 2, md: 3 },
                width: {
                  xs: "100%",
                  sm: collapsed ? "calc(100% - 80px)" : "calc(100% - 250px)",
                },
                transition: "width 0.3s ease-in-out",
                minHeight: "100vh",
                overflowX: "auto",
              }}
            >
              {children}
            </Box>
          </Box>
        </Box>
      )}
    </ThemeProvider>
  );
}
