import { z } from "zod";
import { isValidPhoneNumber } from "react-phone-number-input";

/**
 * List of common public email providers to exclude for professional email validation.
 */
const publicEmailDomains = [
  "gmail.com", "yahoo.com", "hotmail.com", "outlook.com", "icloud.com", "aol.com", "zoho.com", "mail.com", "protonmail.com", "gmx.com"
];

export const projectRequestSchema = z.object({
  // Step 1: Lead Identity
  workEmail: z.string().email("Please enter a valid email address.").refine(email => {
    const domain = email.split('@')[1]?.toLowerCase();
    return !publicEmailDomains.includes(domain);
  }, { message: "Please use a professional business email address." }),
  
  // Step 2: Sizing
  companySize: z.string({ required_error: "Please select your company size." }),
  
  // Step 3: Scope
  objectives: z.array(z.string()).min(1, "Please select at least one objective."),
  objectivesOther: z.string().optional(),
  
  // Step 4: Technical Context
  infrastructure: z.array(z.string()).min(1, "Please select at least one infrastructure type."),
  
  // Step 5: Pain Points
  bottlenecks: z.array(z.string()).min(1, "Please select at least one bottleneck."),
  bottlenecksOther: z.string().optional(),
  
  // Step 6: Urgency
  timeline: z.string({ required_error: "Please select a timeline." }),
  
  // Step 7: Economic Qualification
  budget: z.string({ required_error: "Please select a budget range." }),
  
  // Contact details for follow-up
  firstName: z.string().min(1, "Please enter your first name."),
  lastName: z.string().min(1, "Please enter your last name."),
  company: z.string().min(1, "Please enter your company name."),
  phone: z.string().refine(value => !value || isValidPhoneNumber(value), { message: "Please enter a valid phone number." }).optional(),
  consent: z.literal(true, {
    errorMap: () => ({ message: "You must agree to the privacy policy." }),
  }),
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
