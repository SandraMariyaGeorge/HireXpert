import { Separator } from "@/components/ui/separator";

export function OrDivider() {
  return (
    <div className="relative my-6">
      <div className="absolute inset-0 flex items-center">
        <Separator />
      </div>
      <div className="relative flex justify-center text-sm">
        <span className="px-2 bg-white text-slate-500">or continue with</span>
      </div>
    </div>
  );
}