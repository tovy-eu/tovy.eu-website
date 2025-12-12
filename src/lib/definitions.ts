
import { z } from "zod";
import { isValidPhoneNumber } from "react-phone-number-input";

export const projectRequestSchema = z.object({
  maturity: z.string({ required_error: "Please select a project maturity stage." }),
  companySize: z.string({ required_error: "Please select your company size." }),
  engineeringTeam: z.string({ required_error: "Please select your engineering team size." }),
  projectFocus: z.string().min(1, "Please provide the main focus of your project."),
  challenges: z.string().min(1, "Please describe your main challenges."),
  vision: z.string().min(1, "Please describe your vision for the project."),
  budgetReadiness: z.string({ required_error: "Please select your budget readiness." }),
  timelineReadiness: z.string({ required_error: "Please select your timeline readiness." }),
  firstName: z.string().min(1, "Please enter your first name."),
  lastName: z.string().min(1, "Please enter your last name."),
  phone: z.string().refine(value => !value || isValidPhoneNumber(value), { message: "Please enter a valid phone number." }).optional(),
  email: z.string().email("Please enter a valid email address."),
  company: z.string().min(1, "Please enter your company name."),
  consent: z.literal(true, {
    errorMap: () => ({ message: "You must agree to the privacy policy." }),
  }),
});

export type ProjectRequestData = z.infer<typeof projectRequestSchema>;
