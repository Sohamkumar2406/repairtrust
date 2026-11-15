"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { User, Session } from "@supabase/supabase-js";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { Database } from "@/lib/supabase/types";

type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];

interface SignUpMetadata {
  fullName: string;
  phone: string;
  role?: "customer" | "technician";
  businessName?: string;
  experienceYears?: number;
}

interface AuthContextType {
  user: User | null;
  profile: ProfileRow | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signInWithEmail: (email: string, password: string) => Promise<{ error?: string }>;
  signUpWithEmail: (
    email: string,
    password: string,
    metadata: SignUpMetadata
  ) => Promise<{ error?: string; requireVerification?: boolean }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<ProfileRow | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const supabase = createClient();
  const isConfigured = isSupabaseConfigured();

  const fetchProfile = useCallback(
    async (userId: string) => {
      if (!isConfigured) return;

      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", userId)
          .single();

        if (error) {
          console.warn("[Auth] Failed to fetch profile from Supabase:", error.message);
          // If trigger was slightly delayed, attempt to call sync profile API
          try {
            const res = await fetch("/api/auth/profile");
            if (res.ok) {
              const resData = await res.json();
              if (resData.profile) {
                setProfile(resData.profile);
                return;
              }
            }
          } catch {
            // Ignore API fetch error
          }
          return;
        }

        setProfile(data);
      } catch (err) {
        console.error("[Auth] Unexpected error fetching profile:", err);
      }
    },
    [isConfigured, supabase]
  );

  useEffect(() => {
    let mounted = true;

    async function initializeAuth() {
      if (!isConfigured) {
        setIsLoading(false);
        return;
      }

      try {
        const {
          data: { session: initialSession },
        } = await supabase.auth.getSession();

        if (mounted) {
          setSession(initialSession);
          setUser(initialSession?.user ?? null);
          if (initialSession?.user) {
            await fetchProfile(initialSession.user.id);
          }
        }
      } catch (err) {
        console.error("[Auth] Error reading initial session:", err);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    initializeAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);

      if (newSession?.user) {
        await fetchProfile(newSession.user.id);
      } else {
        setProfile(null);
      }
      setIsLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [fetchProfile, isConfigured, supabase]);

  const signInWithEmail = async (email: string, password: string) => {
    if (!isConfigured) {
      return { error: "Supabase is not configured. Please check your .env.local file." };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { error: error.message };
      }

      if (data.user) {
        await fetchProfile(data.user.id);
      }

      return {};
    } catch (err: any) {
      return { error: err.message || "Failed to sign in" };
    }
  };

  const signUpWithEmail = async (
    email: string,
    password: string,
    metadata: SignUpMetadata
  ) => {
    if (!isConfigured) {
      return { error: "Supabase is not configured. Please check your .env.local file." };
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: metadata.fullName,
            phone: metadata.phone,
            role: metadata.role || "customer",
            business_name: metadata.businessName,
            experience_years: metadata.experienceYears,
          },
        },
      });

      if (error) {
        return { error: error.message };
      }

      // If user is auto-confirmed or email confirmation is off
      if (data.user) {
        // Also call the profile sync API to ensure profiles table is populated
        try {
          await fetch("/api/auth/profile", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userId: data.user.id,
              fullName: metadata.fullName,
              phone: metadata.phone,
              email,
              role: metadata.role || "customer",
              businessName: metadata.businessName,
            }),
          });
        } catch {
          // Trigger will handle it as fallback
        }

        await fetchProfile(data.user.id);
      }

      const requireVerification = !data.session;
      return { requireVerification };
    } catch (err: any) {
      return { error: err.message || "Failed to create account" };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      setProfile(null);
    } catch (err) {
      console.error("[Auth] Error signing out:", err);
    }
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.id);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        session,
        isLoading,
        isAuthenticated: !!user,
        signInWithEmail,
        signUpWithEmail,
        signOut,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
