'use server';

/**
 * @fileOverview Skill suggestion AI agent.
 *
 * - suggestSkills - A function that suggests skills based on user profile information and common skill pairings.
 * - SkillSuggestionInput - The input type for the suggestSkills function.
 * - SkillSuggestionOutput - The return type for the suggestSkills function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SkillSuggestionInputSchema = z.object({
  skillsOffered: z
    .array(z.string())
    .describe('The skills that the user is offering.'),
  skillsWanted: z
    .array(z.string())
    .describe('The skills that the user is requesting.'),
  profileDescription: z
    .string()
    .optional()
    .describe('A description of the user and their skills.'),
});
export type SkillSuggestionInput = z.infer<typeof SkillSuggestionInputSchema>;

const SkillSuggestionOutputSchema = z.object({
  suggestedSkillsToOffer: z
    .array(z.string())
    .describe('Skills suggested for the user to offer.'),
  suggestedSkillsToRequest: z
    .array(z.string())
    .describe('Skills suggested for the user to request.'),
});
export type SkillSuggestionOutput = z.infer<typeof SkillSuggestionOutputSchema>;

export async function suggestSkills(
  input: SkillSuggestionInput
): Promise<SkillSuggestionOutput> {
  return suggestSkillsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'skillSuggestionPrompt',
  input: {schema: SkillSuggestionInputSchema},
  output: {schema: SkillSuggestionOutputSchema},
  prompt: `You are a skill suggestion expert, helping users discover new skills to offer and request on a skill swapping platform.

Given the user's current skills offered and wanted, and a profile description, suggest new skills for them to offer and request.

Skills Offered: {{skillsOffered}}
Skills Wanted: {{skillsWanted}}
Profile Description: {{profileDescription}}

Consider common skill pairings and skills that complement the user's existing skills.

Format your response as a JSON object with "suggestedSkillsToOffer" and "suggestedSkillsToRequest" fields. Each field should contain an array of suggested skills.
`,
});

const suggestSkillsFlow = ai.defineFlow(
  {
    name: 'suggestSkillsFlow',
    inputSchema: SkillSuggestionInputSchema,
    outputSchema: SkillSuggestionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
