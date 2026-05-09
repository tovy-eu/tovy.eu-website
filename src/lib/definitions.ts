import { z } from 'zod';
import { isValidPhoneNumber } from 'react-phone-number-input';

export const projectRequestSchema = z.object({
  // Step 1: Work Email
  email: z.string().email("Please enter a valid email address."),

  // Step 2: Company Size
  companySize: z.string().min(1, "Please select your company size."),

  // Step 3: Problem Statement
  hasProblem: z.string().min(1, "Please select an option."),
  problemDescription: z.string().optional(),
  idealState: z.string().optional(),

  // Step 4: Data Infrastructure
  hasDataTeam: z.string().min(1, "Please select an option."),
  hasCentralDatabase: z.string().min(1, "Please select an option."),
  hasCloudPlatform: z.string().min(1, "Please select an option."),
  solutionsInUse: z.array(z.string()).optional(),

  // Step 5: Timeline
  timeline: z.string().min(1, "Please select a timeline."),

  // Step 6: Budget
  budget: z.string().min(1, "Please select a budget."),

  // Step 7: Contact Details
  firstName: z.string().min(1, "Please enter your first name."),
  lastName: z.string().min(1, "Please enter your last name."),
  company: z.string().min(1, "Please enter your company name."),
  phone: z.string().refine(value => !value || isValidPhoneNumber(value), { message: "Please enter a valid phone number." }).optional(),
  consent: z.boolean().refine(value => value === true, { message: "You must agree to the privacy policy." }),
}).refine((data) => {
    if (data.hasProblem === 'yes') {
      return data.problemDescription && data.problemDescription.trim().length > 0;
    }
    return true;
  }, {
    message: "Please describe the problem.",
    path: ['problemDescription'],
  })
  .refine((data) => {
    if (data.hasProblem === 'yes') {
      return data.idealState && data.idealState.trim().length > 0;
    }
    return true;
  }, {
    message: "Please describe the ideal state.",
    path: ['idealState'],
  });

export type ProjectRequestData = z.infer<typeof projectRequestSchema>;
