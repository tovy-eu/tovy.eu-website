'use server';

import { z } from 'zod';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { projectRequestSchema, type ProjectRequestData } from '@/lib/definitions';
import { categorizeLeadFit } from '@/ai/flows/categorize-lead-fit';

type FormState = {
  message: string;
  success: boolean;
};

export async function submitProjectRequest(
  prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  
  const rawData = Object.fromEntries(formData.entries());

  const validatedFields = projectRequestSchema.safeParse(rawData);

  if (!validatedFields.success) {
    console.error(validatedFields.error.flatten().fieldErrors);
    return {
      message: 'Invalid form data. Please check your inputs.',
      success: false,
    };
  }

  const data: ProjectRequestData = validatedFields.data;

  try {
    // 1. Get AI-powered lead qualification
    const aiResult = await categorizeLeadFit({
      maturity: data.maturity,
      companySize: data.companySize,
      engineeringTeam: data.engineeringTeam,
      projectFocus: data.projectFocus,
      challenges: data.challenges,
      vision: data.vision,
      budgetReadiness: data.budgetReadiness,
      timelineReadiness: data.timelineReadiness,
      contactInfo: `Name: ${data.name}, Email: ${data.email}`,
    });

    // 2. Save to Firestore
    await addDoc(collection(db, 'project_requests'), {
      ...data,
      aiSummary: aiResult.summary,
      aiFitCategory: aiResult.fitCategory,
      createdAt: serverTimestamp(),
    });

    return {
      message: 'Your project request has been submitted successfully.',
      success: true,
    };
  } catch (error) {
    console.error('Error submitting project request:', error);
    return {
      message: 'An unexpected error occurred. Please try again later.',
      success: false,
    };
  }
}
