"use server";

import { z } from "zod";
import { pool } from "app/lib/data";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { client } from "app/lib/data";

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
    await client.query(`DELETE FROM invoices WHERE id = $1`, [id]);
    revalidatePath("/dashboard/invoices");
    return { message: "Deleted Invoice." };
  } catch (error) {
    console.log(error);
    return { message: "Failed to delete invoice." };
  }
}

export type CustomerState = {
  errors?: {
    name?: string[];
    email?: string[];
  };
  message?: string | null;
};

const CustomerFormSchema = z.object({
  id: z.string(),
  name: z.string().min(3),
  email: z.string().email(),
  image_url: z.string(),
});

const UpdateCustomer = CustomerFormSchema.omit({ id: true, image_url: true });

export const updateCustomer = async (
  id: string,
  prevState: CustomerState,
  formData: FormData
) => {
  const validatedFields = UpdateCustomer.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
  });
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to edit Customer.",
    };
  }
  const { name, email } = validatedFields.data;

  try {
    await client.query(
      `UPDATE customers
      SET name = $2, email = $3
      WHERE id = $1`,
      [id, name, email]
    );
  } catch (error) {
    console.log(error);
    return { message: "Failed to update customer." };
  }
  revalidatePath("/dashboard/customers");
  redirect("/dashboard/customers");
};

const CreateCustomer = CustomerFormSchema.omit({ id: true, image_url: true });

export const createCustomer = async (
  prevState: CustomerState,
  formData: FormData
) => {
  const validatedFields = CreateCustomer.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
  });
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to create Customer.",
    };
  }
  const { name, email } = validatedFields.data;
  try {
    await client.query(
      `
      INSERT INTO customers (name, email, image_url)
      VALUES ($1, $2, '/customers/avatar.png')
      `,
      [name, email]
    );
  } catch (error) {
    console.log(error);
    return { message: "Failed to create customer." };
  }
  revalidatePath("/dashboard/customers");
  redirect("/dashboard/customers");
};
