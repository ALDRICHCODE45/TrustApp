"use client";

import { SpinnerLoader } from "@/svgs/loader";
import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="w-[100px] h-[100px]">
        <SpinnerLoader />
      </div>
    </div>
  );
}
