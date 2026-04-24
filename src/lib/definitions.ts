import { z } from "zod";
import { isValidPhoneNumber } from "react-phone-number-input";

export const projectRequestSchema = z.object({
  // Step 1: Lead Identity
  email: z.string().email("Please enter a valid email address."),
  
  // Step 2: Sizing
  companySize: z.string({ required_error: "Please select your company size." }),
  
  // Step 3: Problem Statement
  hasProblem: z.string({ required_error: "Please select an option." }),
  problemDescription: z.string().optional(),
  idealState: z.string().optional(),
  
  // Step 4: Data Infrastructure
  hasDataTeam: z.string({ required_error: "Please select an option." }),
  hasCentralDatabase: z.string({ required_error: "Please select an option." }),
  hasCloudPlatform: z.string({ required_error: "Please select an option." }),
  solutionsInUse: z.array(z.string()).optional(),
  
  // Step 5: Urgency
  timeline: z.string({ required_error: "Please select a timeline." }),
  
  // Step 6: Economic Qualification
  budget: z.string({ required_error: "Please select a budget range." }),
  
  // Contact details for follow-up
  firstName: z.string().min(1, "Please enter your first name."),
  lastName: z.string().min(1, "Please enter your last name."),
  company: z.string().min(1, "Please enter your company name."),
  phone: z.string().refine(value => !value || isValidPhoneNumber(value), { message: "Please enter a valid phone number." }).optional(),
  consent: z.literal(true, {
    errorMap: () => ({ message: "You must agree to the privacy policy." }),
  }),
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

export type JSONContent = {
  public_company_profile: {
    entity_name: string;
    legal_structure: string;
    primary_identifiers: {
      commercial_registry_number: string;
      vat_id_number: string;
    };
    contact_details: {
      address_type: string;
      street_name: string;
      house_number: string;
      postal_code: string;
      city: string;
      country_code: string;
      phone_number: string;
      email: string;
    };
    business_context: {
      start_date: string;
      proprietor_name: string;
      primary_activity_description: string;
    };
  };
};
