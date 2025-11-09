'use server';

/**
 * @fileOverview A lead scoring AI agent.
 *
 * - categorizeLeadFit - A function that categorizes the lead fit based on project request details.
 * - CategorizeLeadFitInput - The input type for the categorizeLeadFit function.
 * - CategorizeLeadFitOutput - The return type for the categorizeLeadFit function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CategorizeLeadFitInputSchema = z.object({
  maturity: z.string().describe('The maturity of the project.'),
  companySize: z.string().describe('The size of the company.'),
  engineeringTeam: z.string().describe('The size of the engineering team.'),
  projectFocus: z.string().describe('The focus of the project.'),
  challenges: z.string().describe('The challenges the project faces.'),
  vision: z.string().describe('The vision for the project.'),
  budgetReadiness: z.string().describe('The readiness of the budget.'),
  timelineReadiness: z.string().describe('The readiness of the timeline.'),
  contactInfo: z.string().describe('The contact information of the lead.'),
});
export type CategorizeLeadFitInput = z.infer<typeof CategorizeLeadFitInputSchema>;

const CategorizeLeadFitOutputSchema = z.object({
  fitCategory: z
    .enum(['High-fit', 'Medium-fit', 'Low-fit'])
    .describe('The fit category of the lead.'),
  summary: z.string().describe('A one-sentence summary of the project challenge and vision.'),
});
export type CategorizeLeadFitOutput = z.infer<typeof CategorizeLeadFitOutputSchema>;

export async function categorizeLeadFit(
  input: CategorizeLeadFitInput
): Promise<CategorizeLeadFitOutput> {
  return categorizeLeadFitFlow(input);
}

const prompt = ai.definePrompt({
  name: 'categorizeLeadFitPrompt',
  input: {schema: CategorizeLeadFitInputSchema},
  output: {schema: CategorizeLeadFitOutputSchema},
  prompt: `You are an AI assistant specializing in lead qualification for AI development projects. Analyze the following project request details to determine the lead fit and summarize the project.

Project Details:
Company Size: {{{companySize}}}
Engineering Team: {{{engineeringTeam}}}
Project Focus: {{{projectFocus}}}
Challenges: {{{challenges}}}
Vision: {{{vision}}}
Budget Readiness: {{{budgetReadiness}}}
Timeline Readiness: {{{timelineReadiness}}}
Contact Info: {{{contactInfo}}}

Based on these details, categorize the lead as "High-fit", "Medium-fit", or "Low-fit". Also, provide a one-sentence summary of the project challenge and vision.

Output in JSON format:
{{$instructions=JSON}}`,
});

const categorizeLeadFitFlow = ai.defineFlow(
  {
    name: 'categorizeLeadFitFlow',
    inputSchema: CategorizeLeadFitInputSchema,
    outputSchema: CategorizeLeadFitOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
