
import { Button } from "@/components/ui/button";
import { Apple, Facebook, Mail, Twitter } from "lucide-react";

export function SocialButtons() {
  return (
    <div className="grid grid-cols-3 gap-3">
      <Button 
        variant="outline" 
        className="h-12 rounded-xl border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200"
      >
        <Facebook className="h-5 w-5" />
      </Button>
      <Button 
        variant="outline" 
        className="h-12 rounded-xl border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200"
      >
        <Apple className="h-5 w-5" />
      </Button>
      <Button 
        variant="outline" 
        className="h-12 rounded-xl border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200"
      >
        <Mail className="h-5 w-5" />
      </Button>
      <Button 
        variant="outline" 
        className="h-12 rounded-xl border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200"
      >
        <Twitter className="h-5 w-5" />
      </Button>
    </div>
  );
}