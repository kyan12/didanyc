"use client";

import { useState, useTransition } from "react";
import type { CustomerAddress } from "@/lib/shopify/customer-types";
import { createAddress, updateAddress, deleteAddress } from "./actions";
import styles from "./addresses.module.css";

interface Props {
  addresses: CustomerAddress[];
  defaultAddressId: string | null;
}

export default function AddressList({ addresses, defaultAddressId }: Props) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showNew, setShowNew] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleCreate(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await createAddress(formData);
      if (result.error) {
        setError(result.error);
      } else {
        setShowNew(false);
      }
    });
  }

  function handleUpdate(addressId: string, formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await updateAddress(addressId, formData);
      if (result.error) {
        setError(result.error);
      } else {
        setEditingId(null);
      }
    });
  }

  function handleDelete(addressId: string) {
    if (!confirm("Delete this address?")) return;
    setError(null);
    startTransition(async () => {
      const result = await deleteAddress(addressId);
      if (result.error) setError(result.error);
    });
  }

  return (
    <div>
      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.toolbar}>
        <button
          className={styles.addButton}
          onClick={() => {
            setShowNew(true);
            setEditingId(null);
          }}
          disabled={isPending}
        >
          Add Address
        </button>
      </div>

      {showNew && (
        <AddressForm
          onSubmit={handleCreate}
          onCancel={() => setShowNew(false)}
          isPending={isPending}
        />
      )}

      {addresses.length === 0 && !showNew && (
        <p className={styles.empty}>No saved addresses.</p>
      )}

      <div className={styles.grid}>
        {addresses.map((addr) =>
          editingId === addr.id ? (
            <AddressForm
              key={addr.id}
              address={addr}
              onSubmit={(fd) => handleUpdate(addr.id, fd)}
              onCancel={() => setEditingId(null)}
              isPending={isPending}
            />
          ) : (
            <div key={addr.id} className={styles.card}>
              {addr.id === defaultAddressId && (
                <span className={styles.defaultBadge}>Default</span>
              )}
              <p className={styles.addressName}>
                {addr.firstName} {addr.lastName}
              </p>
              <p className={styles.addressLine}>{addr.address1}</p>
              {addr.address2 && (
                <p className={styles.addressLine}>{addr.address2}</p>
              )}
              <p className={styles.addressLine}>
                {addr.city}, {addr.province} {addr.zip}
              </p>
              <p className={styles.addressLine}>{addr.country}</p>
              {addr.phone && (
                <p className={styles.addressLine}>{addr.phone}</p>
              )}
              <div className={styles.cardActions}>
                <button
                  className={styles.editButton}
                  onClick={() => {
                    setEditingId(addr.id);
                    setShowNew(false);
                  }}
                  disabled={isPending}
                >
                  Edit
                </button>
                <button
                  className={styles.deleteButton}
                  onClick={() => handleDelete(addr.id)}
                  disabled={isPending}
                >
                  Delete
                </button>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}

function AddressForm({
  address,
  onSubmit,
  onCancel,
  isPending,
}: {
  address?: CustomerAddress;
  onSubmit: (formData: FormData) => void;
  onCancel: () => void;
  isPending: boolean;
}) {
  return (
    <form action={onSubmit} className={styles.form}>
      <div className={styles.formRow}>
        <div className={styles.field}>
          <label className={styles.label}>First Name</label>
          <input
            name="firstName"
            defaultValue={address?.firstName}
            required
            className={styles.input}
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Last Name</label>
          <input
            name="lastName"
            defaultValue={address?.lastName}
            required
            className={styles.input}
          />
        </div>
      </div>
      <div className={styles.field}>
        <label className={styles.label}>Address</label>
        <input
          name="address1"
          defaultValue={address?.address1}
          required
          className={styles.input}
        />
      </div>
      <div className={styles.field}>
        <label className={styles.label}>Apartment, suite, etc.</label>
        <input
          name="address2"
          defaultValue={address?.address2 ?? ""}
          className={styles.input}
        />
      </div>
      <div className={styles.formRow}>
        <div className={styles.field}>
          <label className={styles.label}>City</label>
          <input
            name="city"
            defaultValue={address?.city}
            required
            className={styles.input}
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>State / Province</label>
          <input
            name="province"
            defaultValue={address?.province}
            required
            className={styles.input}
          />
        </div>
      </div>
      <div className={styles.formRow}>
        <div className={styles.field}>
          <label className={styles.label}>ZIP / Postal</label>
          <input
            name="zip"
            defaultValue={address?.zip}
            required
            className={styles.input}
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Country</label>
          <input
            name="country"
            defaultValue={address?.country ?? "US"}
            required
            className={styles.input}
          />
        </div>
      </div>
      <div className={styles.field}>
        <label className={styles.label}>Phone</label>
        <input
          name="phone"
          type="tel"
          defaultValue={address?.phone ?? ""}
          className={styles.input}
        />
      </div>
      <div className={styles.formActions}>
        <button
          type="submit"
          className={styles.submitButton}
          disabled={isPending}
        >
          {isPending ? "Saving…" : address ? "Update" : "Add"}
        </button>
        <button
          type="button"
          className={styles.cancelButton}
          onClick={onCancel}
          disabled={isPending}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
