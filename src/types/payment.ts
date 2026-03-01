export type StudentPaymentStatus = "PENDING" | "CONFIRMED" | "FAILED" | "REFUNDED"

export type StudentPayment = {
  id: string
  amount: number
  paymentMethod: string
  status: StudentPaymentStatus
  paymentDate: string | null
  installmentNumber: number | null
  transactionId: string | null
  notes: string | null
}
