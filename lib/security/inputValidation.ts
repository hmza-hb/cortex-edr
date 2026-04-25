import { z } from 'zod';

export const emailSchema = z.string().email("Invalid email format").max(255);
export const passwordSchema = z.string().min(8, "Password must be at least 8 characters").max(100);
export const nameSchema = z.string().min(2, "Name must be at least 2 characters").max(100);
export const otpSchema = z.string().length(6, "Verification code must be exactly 6 digits").regex(/^\d+$/, "Code must contain only digits");
export const scanIdSchema = z.string().uuid("Invalid scan ID format");
export const redirectUrlSchema = z.string().regex(/^\/[^\/]/, "Must be a valid relative path starting with a single slash, no protocol");

export const signupDataSchema = z.object({
    email: emailSchema,
    name: nameSchema,
    password: passwordSchema
});

// A generic validator function wrapping zod
export function validateInput<T>(schema: z.ZodType<T>, data: unknown): { success: true; data: T } | { success: false; error: string } {
    const result = schema.safeParse(data);
    if (!result.success) {
        return { success: false, error: result.error.issues[0].message };
    }
    return { success: true, data: result.data };
}
