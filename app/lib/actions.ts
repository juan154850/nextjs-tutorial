"use server";

import { z } from "zod";
import { pool } from "app/lib/data";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";

export type State = {
  errors?: {
    customerId?: string[];
    amount?: string[];
    status?: string[];
  };
  message?: string | null;
};

export async function authenticate(
  prevState: string | undefined,
  formData: FormData
) {
  try {
    await signIn("credentials", formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Invalid credentials.";
        default:
          return "Something went wrong.";
      }
    }
    throw error;
  }
}

const FormSchema = z.object({
  id: z.string(),
  customerId: z.string({
    invalid_type_error: "Please select a customer",
  }),
  amount: z.coerce.number().gt(0, {
    message: "Amount must be greater than $0",
  }),
  status: z.enum(["pending", "paid"], {
    invalid_type_error: "Please select a status",
  }),
  date: z.string(),
});

const CreateInvoice = FormSchema.omit({ id: true, date: true });

export const createInvoice = async (prevState: State, formData: FormData) => {
  const validatedFields = CreateInvoice.safeParse({
    customerId: formData.get("customerId"),
    amount: formData.get("amount"),
    status: formData.get("status"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create Invoice.",
    };
  }

  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100;
  const date = new Date().toISOString().split("T")[0];

  try {
    const client = await pool.connect();
    await client.query(
      `INSERT INTO invoices (customer_id, amount, status, date)
      VALUES ($1 ,$2 ,$3 ,$4)`,
      [customerId, amountInCents, status, date]
    );
  } catch (error) {
    console.log(error);
    return { message: "Failed to create invoice." };
  }
  revalidatePath("/dashboard/invoices");
  redirect("/dashboard/invoices");
};

const UpdateInvoice = FormSchema.omit({ id: true, date: true });

export async function updateInvoice(
  id: string,
  prevState: State,
  formData: FormData
) {
  const validatedFields = UpdateInvoice.safeParse({
    customerId: formData.get("customerId"),
    amount: formData.get("amount"),
    status: formData.get("status"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to edit Invoice.",
    };
  }

  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100;

  try {
    const client = await pool.connect();
    await client.query(
      `
      UPDATE invoices
      SET customer_id = $2, amount = $3, status = $4
      WHERE id = $1
    `,
      [id, customerId, amountInCents, status]
    );
  } catch (error) {
    console.log(error);
    return { message: "Failed to update invoice." };
  }
  revalidatePath("/dashboard/invoices");
  redirect("/dashboard/invoices");
}

export async function deleteInvoice(id: string) {
  try {
    const client = await pool.connect();
    await client.query(`DELETE FROM invoices WHERE id = $1`, [id]);
    revalidatePath("/dashboard/invoices");
    return { message: "Deleted Invoice." };
  } catch (error) {
    console.log(error);
    return { message: "Failed to delete invoice." };
  }
}
