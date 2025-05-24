import React from "react";
import LoadingPage from "../loading";
import { Loader2 } from "lucide-react";

function loading() {
  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20">
      <Loader2 className="animate-spin w-8 h-8 text-white" aria-label="Loading..." />
    </div>
  );
}

export default loading;
