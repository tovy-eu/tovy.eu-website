import { z } from "zod";
import { isValidPhoneNumber } from "react-phone-number-input";

export const projectRequestSchema = z.object({
  maturity: z.string({ required_error: "Selecteer alstublieft een volwassenheidsfase van het project." }),
  companySize: z.string({ required_error: "Selecteer alstublieft uw bedrijfsgrootte." }),
  engineeringTeam: z.string({ required_error: "Selecteer alstublieft de grootte van uw engineeringteam." }),
  projectFocus: z.string().min(1, "Geef alstublieft de belangrijkste focus van uw project op."),
  challenges: z.string().min(1, "Beschrijf alstublieft uw belangrijkste uitdagingen."),
  vision: z.string().min(1, "Beschrijf alstublieft uw visie voor het project."),
  budgetReadiness: z.string({ required_error: "Selecteer alstublieft uw budgetbereidheid." }),
  timelineReadiness: z.string({ required_error: "Selecteer alstublieft uw tijdslijnbereidheid." }),
  firstName: z.string().min(1, "Voer alstublieft uw voornaam in."),
  lastName: z.string().min(1, "Voer alstublieft uw achternaam in."),
  phone: z.string().refine(isValidPhoneNumber, { message: "Voer alstublieft een geldig telefoonnummer in." }),
  email: z.string().email("Voer alstublieft een geldig e-mailadres in."),
  company: z.string().min(1, "Voer alstublieft uw bedrijfsnaam in."),
});

export type ProjectRequestData = z.infer<typeof projectRequestSchema>;
