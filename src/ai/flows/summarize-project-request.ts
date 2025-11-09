'use server';
/**
 * @fileOverview Summarizes a project request from the intake form into a concise sentence.
 *
 * - summarizeProjectRequest - A function that summarizes the project request.
 * - SummarizeProjectRequestInput - The input type for the summarizeProjectRequest function.
 * - SummarizeProjectRequestOutput - The return type for the summarizeProjectRequest function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeProjectRequestInputSchema = z.object({
  maturity: z.string().describe('Project maturity level'),
  companySize: z.string().describe('Company size'),
  engineeringTeam: z.string().describe('Engineering team size'),
  projectFocus: z.string().describe('Project focus'),
  challenges: z.string().describe('Project challenges'),
  vision: z.string().describe('Project vision'),
  budgetReadiness: z.string().describe('Budget readiness'),
  timelineReadiness: z.string().describe('Timeline readiness'),
  contactInfo: z.string().describe('Contact information'),
});
export type SummarizeProjectRequestInput = z.infer<
  typeof SummarizeProjectRequestInputSchema
>;

const SummarizeProjectRequestOutputSchema = z.object({
  summary: z.string().describe('A one-sentence summary of the project request.'),
  leadFit: z
    .enum(['High-fit', 'Medium-fit', 'Low-fit'])
    .describe('Lead qualification fit.'),
});
export type SummarizeProjectRequestOutput = z.infer<
  typeof SummarizeProjectRequestOutputSchema
>;

export async function summarizeProjectRequest(
  input: SummarizeProjectRequestInput
): Promise<SummarizeProjectRequestOutput> {
  return summarizeProjectRequestFlow(input);
}

const summarizeProjectRequestPrompt = ai.definePrompt({
  name: 'summarizeProjectRequestPrompt',
  input: {schema: SummarizeProjectRequestInputSchema},
  output: {schema: SummarizeProjectRequestOutputSchema},
  prompt: `Summarize the following project request into a concise one-sentence summary and classify the lead fit as "High-fit", "Medium-fit", or "Low-fit".\n\nProject Maturity: {{{maturity}}}\nCompany Size: {{{companySize}}}\nEngineering Team: {{{engineeringTeam}}}\nProject Focus: {{{projectFocus}}}\nChallenges: {{{challenges}}}\nVision: {{{vision}}}\nBudget Readiness: {{{budgetReadiness}}}\nTimeline Readiness: {{{timelineReadiness}}}\nContact Info: {{{contactInfo}}}\n\nSummary: \nLead Fit:`,
});

const summarizeProjectRequestFlow = ai.defineFlow(
  {
    name: 'summarizeProjectRequestFlow',
    inputSchema: SummarizeProjectRequestInputSchema,
    outputSchema: SummarizeProjectRequestOutputSchema,
  },
  async input => {
    const {output} = await summarizeProjectRequestPrompt(input);
    return output!;
  }
);
