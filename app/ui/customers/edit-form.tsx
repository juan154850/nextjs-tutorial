"use client";

import { Customer } from "@/app/lib/definitions";
import Link from "next/link";
import { Button } from "@/app/ui/button";
import { updateCustomer, CustomerState } from "@/app/lib/actions";
import { useActionState } from "react";
import Image from "next/image";

export default function EditCustomerForm({ customer }: { customer: Customer }) {
  const initialState: CustomerState = { message: null, errors: {} };
  const updateCustomerWithId = updateCustomer.bind(null, customer.id);
  const [state, formAction] = useActionState(
    updateCustomerWithId,
    initialState
  );

  return (
    <form action={formAction}>
      <div className="rounded-md p-4 md:p-6">
        {/* foto de perfil... */}
        <div className=" flex items-center justify-center">
          <div className="relative">
            <Image
              id="image_url"
              src={customer.image_url}
              className="rounded-full"
              alt={`${customer.name}'s profile picture`}
              width={60}
              height={60}
              defaultValue={customer.image_url}
            />
          </div>
        </div>
        {/* Nombre */}
        <div className="mt-6">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Name
          </label>
          <input
            type="text"
            name="name"
            id="name"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            defaultValue={customer.name}
          />
        </div>
        {/* email */}
        <div className="mt-6">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            defaultValue={customer.email}
          />
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/customers"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit">Edit customer</Button>
      </div>
    </form>
  );
}
