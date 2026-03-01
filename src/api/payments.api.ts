import { z } from "zod"

import { getHttpErrorMessage, mapApiItems } from "@/api/http"
import { getWithFallback } from "@/api/request"
import type { StudentPayment } from "@/types/payment"

const paymentStatusSchema = z.enum(["PENDING", "CONFIRMED", "FAILED", "REFUNDED"])

const paymentSchema = z.object({
  id: z.string().or(z.number()).optional(),
  amount: z.number().or(z.string()).optional(),
  payment_method: z.string().optional(),
  paymentMethod: z.string().optional(),
  status: paymentStatusSchema.optional(),
  payment_date: z.string().optional(),
  paymentDate: z.string().optional(),
  installment_number: z.number().optional(),
  installmentNumber: z.number().optional(),
  transaction_id: z.string().nullable().optional(),
  transactionId: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
})

function mapPayment(rawValue: unknown): StudentPayment {
  const raw = paymentSchema.parse(rawValue)

  return {
    id: String(raw.id ?? ""),
    amount: Number(raw.amount ?? 0),
    paymentMethod: raw.payment_method ?? raw.paymentMethod ?? "UNKNOWN",
    status: raw.status ?? "CONFIRMED",
    paymentDate: raw.payment_date ?? raw.paymentDate ?? null,
    installmentNumber: raw.installment_number ?? raw.installmentNumber ?? null,
    transactionId: raw.transaction_id ?? raw.transactionId ?? null,
    notes: raw.notes ?? null,
  }
}

export const paymentsApi = {
  async getMine(): Promise<StudentPayment[]> {
    try {
      const payload = await getWithFallback(["/students/me/payments", "/payments/me"])
      return mapApiItems(payload, mapPayment)
    } catch (error) {
      throw new Error(getHttpErrorMessage(error))
    }
  },
}
