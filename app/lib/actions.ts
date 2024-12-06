"use server";

import { z } from "zod";
import { pool } from "app/lib/data";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const FormSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  amount: z.coerce.number(),
  status: z.enum(["pending", "paid"]),
  date: z.string(),
});

const CreateInvoice = FormSchema.omit({ id: true, date: true });

export const createInvoice = async (formData: FormData) => {
  const { customerId, amount, status } = CreateInvoice.parse({
    customerId: formData.get("customerId"),
    amount: formData.get("amount"),
    status: formData.get("status"),
  });

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
    return { message: "Failed to create invoice." };
  }
  revalidatePath("/dashboard/invoices");
  redirect("/dashboard/invoices");
};

const UpdateInvoice = FormSchema.omit({ id: true, date: true });

export async function updateInvoice(id: string, formData: FormData) {
  const { customerId, amount, status } = UpdateInvoice.parse({
    customerId: formData.get("customerId"),
    amount: formData.get("amount"),
    status: formData.get("status"),
  });

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
    return { message: "Failed to update invoice." };
  }
  revalidatePath("/dashboard/invoices");
  redirect("/dashboard/invoices");
}

export async function deleteInvoice(id: string) {
  throw new Error("Failed to Delete Invoice");
  try {
    const client = await pool.connect();
    await client.query(`DELETE FROM invoices WHERE id = $1`, [id]);
    revalidatePath("/dashboard/invoices");
    return { message: "Deleted Invoice." };
  } catch (error) {
    return { message: "Failed to delete invoice." };
  }
}
