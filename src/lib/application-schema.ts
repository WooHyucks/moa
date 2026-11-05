import { z } from "zod";

export const applicationSchema = z.object({
  partner1_name: z.string().trim().max(40).optional().default(""),
  partner2_name: z.string().trim().max(40).optional().default(""),
  anniversary_date: z.string().trim().max(32).optional().or(z.literal("")),
  story_answers: z
    .object({
      meet: z.string().trim().max(500).optional().default(""),
      memorable: z.string().trim().max(500).optional().default(""),
      grateful: z.string().trim().max(500).optional().default(""),
    })
    .optional()
    .default({ meet: "", memorable: "", grateful: "" }),
  instagram_username: z
    .string()
    .trim()
    .transform((v) => v.replace(/^@/, ""))
    .pipe(z.string().min(2).max(30).regex(/^[a-zA-Z0-9._]+$/)),
  consent_given: z.literal(true),
  consent_version: z.string().min(1),
  utm_source: z.string().max(120).optional(),
  utm_campaign: z.string().max(120).optional(),
});

export type ApplicationInput = z.infer<typeof applicationSchema>;
