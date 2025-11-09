import { z } from "zod";

export const projectRequestSchema = z.object({
  maturity: z.string({ required_error: "Please select a project maturity stage." }),
  companySize: z.string({ required_error: "Please select your company size." }),
  engineeringTeam: z.string({ required_error: "Please select your engineering team size." }),
  projectFocus: z.string().min(1, "Please provide your project's main focus."),
  challenges: z.string().min(1, "Please describe your main challenges."),
  vision: z.string().min(1, "Please describe your vision for the project."),
  budgetReadiness: z.string({ required_error: "Please select your budget readiness." }),
  timelineReadiness: z.string({ required_error: "Please select your timeline readiness." }),
  name: z.string().min(1, "Please enter your name."),
  email: z.string().email("Please enter a valid email address."),
});

export type ProjectRequestData = z.infer<typeof projectRequestSchema>;
