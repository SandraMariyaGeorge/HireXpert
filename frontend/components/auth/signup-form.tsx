"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function SignUpForm({ onSubmit, isLoading }: { onSubmit: (e: React.FormEvent) => void, isLoading: boolean }) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Input
          type="text"
          name="username"
          placeholder="Username"
          required
          className="h-12"
        />
      </div>
      <div className="space-y-2">
        <Input
          type="email"
          name="email"
          placeholder="Email Address"
          required
          className="h-12"
        />
      </div>
      <div className="space-y-2">
        <Input
          type="password"
          name="password"
          placeholder="Password"
          required
          className="h-12"
        />
      </div>
      <Button
        type="submit"
        className="w-full h-12 text-base bg-black hover:bg-gray-800 text-white"
        disabled={isLoading}
      >
        {isLoading ? "Signing up..." : "Sign up"}
      </Button>
    </form>
  );
}