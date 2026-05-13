"use client";

import { useFormState, useFormStatus } from "react-dom";
import { loginAction } from "@/app/actions";
import { Button } from "@/components/Button";
import { TextInput } from "@/components/TextInput";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button className="mt-2 w-full" disabled={pending} type="submit">
      {pending ? "Signing in..." : "Sign In"}
    </Button>
  );
}

export function LoginForm() {
  const [state, formAction] = useFormState(loginAction, {});

  return (
    <form action={formAction} className="mt-8 space-y-5">
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="email">
          Email
        </label>
        <TextInput autoComplete="email" id="email" name="email" placeholder="name@openpayd.local" required type="email" />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="password">
          Password
        </label>
        <TextInput autoComplete="current-password" id="password" name="password" placeholder="Enter your password" required type="password" />
      </div>
      {state.error ? <p aria-live="polite" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{state.error}</p> : null}
      <SubmitButton />
    </form>
  );
}
