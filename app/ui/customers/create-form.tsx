"use client";

import Link from "next/link";
import {} from "@heroicons/react/24/outline";
import { Button } from "@/app/ui/button";
import { createCustomer, CustomerState } from "@/app/lib/actions";
import { useActionState } from "react";

export default function Form() {
  const initialState: CustomerState = { message: null, errors: {} };
  const [state, formAction] = useActionState(createCustomer, initialState);

  return (
    <form action={formAction}>
      <div className="bg-gray-50 p-5">
        <div className="mb-4 w-full">
          <label htmlFor="name">Customer full name</label>
          <input
            placeholder="Customer name"
            type="text"
            id="name"
            className="w-full block rounded-lg border py-[9px] px-3 pr-4 text-sm focus:border-blue-400 focus:ring-1 focus:ring-blue-400 focus:outline-none"
            name="name"
          />
          <div id="name-error" aria-live="polite" aria-atomic="true">
            {state.errors?.name &&
              state.errors.name.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        <div className="mb-4 w-full">
          <label htmlFor="email">Customer email</label>
          <input
            placeholder="Customer email address"
            id="email"
            className="w-full block rounded-lg border py-[9px] px-3 pr-4 text-sm focus:border-blue-400 focus:ring-1 focus:ring-blue-400 focus:outline-none"
            name="email"
          />
          <div id="email-error" aria-live="polite" aria-atomic="true">
            {state.errors?.email &&
              state.errors.email.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>
        <div id="message-error" aria-live="polite" aria-atomic="true">
          {state.message && (
            <p className="mt-2 text-sm text-red-500">{state.message}</p>
          )}
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/customers"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit">Create Invoice</Button>
      </div>
    </form>
  );
}
