"use server";

import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth/session";
import { customerFetch } from "@/lib/shopify/customer-client";
import {
  ADDRESS_CREATE_MUTATION,
  ADDRESS_UPDATE_MUTATION,
  ADDRESS_DELETE_MUTATION,
} from "@/lib/shopify/customer-queries";

interface AddressInput {
  firstName: string;
  lastName: string;
  address1: string;
  address2?: string;
  city: string;
  province: string;
  zip: string;
  country: string;
  phone?: string;
}

function parseForm(formData: FormData): AddressInput {
  return {
    firstName: formData.get("firstName") as string,
    lastName: formData.get("lastName") as string,
    address1: formData.get("address1") as string,
    address2: (formData.get("address2") as string) || undefined,
    city: formData.get("city") as string,
    province: formData.get("province") as string,
    zip: formData.get("zip") as string,
    country: formData.get("country") as string,
    phone: (formData.get("phone") as string) || undefined,
  };
}

export async function createAddress(
  formData: FormData
): Promise<{ error?: string }> {
  const session = await getSession();
  if (!session) return { error: "Not authenticated" };

  const address = parseForm(formData);

  const data = await customerFetch<{
    customerAddressCreate: {
      userErrors: { field: string[]; message: string }[];
    };
  }>({
    query: ADDRESS_CREATE_MUTATION,
    variables: { address },
    accessToken: session.accessToken,
  });

  const errors = data.customerAddressCreate.userErrors;
  if (errors.length > 0) {
    return { error: errors.map((e) => e.message).join(", ") };
  }

  revalidatePath("/account/addresses");
  return {};
}

export async function updateAddress(
  addressId: string,
  formData: FormData
): Promise<{ error?: string }> {
  const session = await getSession();
  if (!session) return { error: "Not authenticated" };

  const address = parseForm(formData);

  const data = await customerFetch<{
    customerAddressUpdate: {
      userErrors: { field: string[]; message: string }[];
    };
  }>({
    query: ADDRESS_UPDATE_MUTATION,
    variables: { addressId, address },
    accessToken: session.accessToken,
  });

  const errors = data.customerAddressUpdate.userErrors;
  if (errors.length > 0) {
    return { error: errors.map((e) => e.message).join(", ") };
  }

  revalidatePath("/account/addresses");
  return {};
}

export async function deleteAddress(
  addressId: string
): Promise<{ error?: string }> {
  const session = await getSession();
  if (!session) return { error: "Not authenticated" };

  const data = await customerFetch<{
    customerAddressDelete: {
      userErrors: { field: string[]; message: string }[];
    };
  }>({
    query: ADDRESS_DELETE_MUTATION,
    variables: { addressId },
    accessToken: session.accessToken,
  });

  const errors = data.customerAddressDelete.userErrors;
  if (errors.length > 0) {
    return { error: errors.map((e) => e.message).join(", ") };
  }

  revalidatePath("/account/addresses");
  return {};
}
