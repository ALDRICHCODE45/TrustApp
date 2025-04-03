"use client";

import { type ReactElement } from "react";

import { Button } from "@/components/ui/button";
import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";

export interface SubmitButtonProps {
  text?: string;
  variant?: string;
}

export function SubmitButton({
  text = "Submit",
  variant = "default",
}: SubmitButtonProps): ReactElement {
  const { pending } = useFormStatus();

  return (
    <>
      {pending ? (
        <Button className="w-full" disabled>
          <Loader2 className="size-4 mr-2 animate-spin" />
          pending
        </Button>
      ) : (
        <Button
          className="w-full cursor-pointer"
          type="submit"
          variant={variant as "default"}
        >
          {text}
        </Button>
      )}
    </>
  );
}
