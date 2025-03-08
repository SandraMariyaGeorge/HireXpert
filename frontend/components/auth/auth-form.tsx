"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SocialButtons } from "./social-buttons";
import { OrDivider } from "./or-divider";
import Link from "next/link";

interface AuthFormProps {
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
}

export function AuthForm({ onSubmit, isLoading }: AuthFormProps) {
  return (
    <div className="w-full space-y-6">
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <Input
            type="text"
            name="username"
            placeholder="Username"
            className="h-12 rounded-xl border-purple-200 focus:border-purple-400 focus:ring-slate-300 transition-colors"
            required
          />
        </div>
        <div className="space-y-2">
          <Input
            type="password"
            name="password"
            placeholder="Password"
            className="h-12 rounded-xl border-purple-200 focus:border-purple-400 focus:ring-slate-300 transition-colors"
            required
          />
          <div className="flex justify-end">
            <Link href="/forgot-password" className="text-sm text-purple-500 hover:text-purple-800">
              Forgot password?
            </Link>
          </div>
        </div>
        <Button
          type="submit"
          className="w-full h-12 text-base bg-purple hover:bg-purple-800 rounded-xl transition-all duration-200 font-medium"
          disabled={isLoading}
        >
          {isLoading ? "Signing in..." : "Sign in"}
        </Button>
      </form>
      <OrDivider />
      <SocialButtons />
    </div>
  );
}
