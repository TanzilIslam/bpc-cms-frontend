import { useEffect, useState } from "react"
import { useForm, useWatch } from "react-hook-form"
import { useSearchParams } from "react-router-dom"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

import { enrollmentFormsApi } from "@/api/enrollment-forms.api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

const enrollmentSchema = z
  .object({
    full_name: z.string().min(3, "Enter your full name."),
    email: z.string().email("Enter a valid email."),
    phone: z.string().min(11, "Enter a valid phone number."),
    interested_course: z.string().min(2, "Enter course name."),
    has_laptop: z.boolean(),
    laptop_specs: z.string().optional(),
    has_internet: z.boolean(),
    why_join: z.string().min(20, "Write at least 20 characters."),
  })
  .superRefine((value, context) => {
    if (value.has_laptop && (!value.laptop_specs || value.laptop_specs.trim().length === 0)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["laptop_specs"],
        message: "Laptop specs are required when you have a laptop.",
      })
    }
  })

type EnrollmentFormData = z.infer<typeof enrollmentSchema>

export function EnrollmentFormPage() {
  const [searchParams] = useSearchParams()
  const courseParam = searchParams.get("course") ?? ""

  const [isSuccess, setIsSuccess] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EnrollmentFormData>({
    resolver: zodResolver(enrollmentSchema),
    defaultValues: {
      full_name: "",
      email: "",
      phone: "",
      interested_course: "",
      has_laptop: false,
      laptop_specs: "",
      has_internet: true,
      why_join: "",
    },
  })

  useEffect(() => {
    if (courseParam) {
      setValue("interested_course", courseParam)
    }
  }, [courseParam, setValue])

  const hasLaptop = useWatch({ control, name: "has_laptop" })
  const hasInternet = useWatch({ control, name: "has_internet" })

  async function onSubmit(values: EnrollmentFormData) {
    setServerError(null)
    setIsSuccess(false)

    try {
      await enrollmentFormsApi.submit(values)
      setIsSuccess(true)
      reset({
        full_name: "",
        email: "",
        phone: "",
        interested_course: courseParam,
        has_laptop: false,
        laptop_specs: "",
        has_internet: true,
        why_join: "",
      })
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to submit enrollment form. Please try again."
      setServerError(message)
    }
  }

  return (
    <section className="mx-auto w-full max-w-2xl space-y-4">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Enrollment Form</h1>
        <p className="text-muted-foreground">
          Submit your details and our team will contact you for the next batch.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 rounded-lg border p-6">
        <div className="grid gap-2">
          <Label htmlFor="full-name">Full Name</Label>
          <Input id="full-name" {...register("full_name")} />
          {errors.full_name ? (
            <p className="text-sm text-destructive">{errors.full_name.message}</p>
          ) : null}
        </div>

        <div className="grid gap-2 md:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...register("email")} />
            {errors.email ? (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            ) : null}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" {...register("phone")} placeholder="+8801XXXXXXXXX" />
            {errors.phone ? (
              <p className="text-sm text-destructive">{errors.phone.message}</p>
            ) : null}
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="interested-course">Interested Course</Label>
          <Input id="interested-course" {...register("interested_course")} />
          {errors.interested_course ? (
            <p className="text-sm text-destructive">{errors.interested_course.message}</p>
          ) : null}
        </div>

        <div className="grid gap-2">
          <Label className="text-sm">Do you have a laptop?</Label>
          <div className="flex items-center gap-6">
            <label className="inline-flex items-center gap-2 text-sm">
              <input type="radio" onChange={() => setValue("has_laptop", true)} checked={hasLaptop} />
              Yes
            </label>
            <label className="inline-flex items-center gap-2 text-sm">
              <input
                type="radio"
                onChange={() => setValue("has_laptop", false)}
                checked={!hasLaptop}
              />
              No
            </label>
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="laptop-specs">Laptop Specs</Label>
          <Input
            id="laptop-specs"
            {...register("laptop_specs")}
            disabled={!hasLaptop}
            placeholder="CPU, RAM, SSD/HDD"
          />
          {errors.laptop_specs ? (
            <p className="text-sm text-destructive">{errors.laptop_specs.message}</p>
          ) : null}
        </div>

        <div className="grid gap-2">
          <Label className="text-sm">Do you have internet access?</Label>
          <div className="flex items-center gap-6">
            <label className="inline-flex items-center gap-2 text-sm">
              <input
                type="radio"
                onChange={() => setValue("has_internet", true)}
                checked={hasInternet}
              />
              Yes
            </label>
            <label className="inline-flex items-center gap-2 text-sm">
              <input
                type="radio"
                onChange={() => setValue("has_internet", false)}
                checked={!hasInternet}
              />
              No
            </label>
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="why-join">Why do you want to join?</Label>
          <Textarea id="why-join" rows={4} {...register("why_join")} />
          {errors.why_join ? (
            <p className="text-sm text-destructive">{errors.why_join.message}</p>
          ) : null}
        </div>

        {serverError ? <p className="text-sm text-destructive">{serverError}</p> : null}
        {isSuccess ? (
          <p className="text-sm text-green-600">
            Enrollment request submitted successfully. We will contact you soon.
          </p>
        ) : null}

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit Enrollment Request"}
        </Button>
      </form>
    </section>
  )
}
