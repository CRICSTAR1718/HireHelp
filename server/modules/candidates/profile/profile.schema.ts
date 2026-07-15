import { z } from 'zod';

const optionalUrl = z.string().trim().max(500).optional().or(z.literal(''));

export const updateProfileSchema = z.object({
  fullName: z.string().trim().max(255).optional(),
  phone: z.string().trim().max(20).optional(),
  headline: z.string().trim().max(255).optional(),
  summary: z.string().max(5000).optional(),
  location: z.string().trim().max(255).optional(),
  website: optionalUrl,
  linkedin: optionalUrl,
  github: optionalUrl,
  portfolio: optionalUrl,
  skills: z.array(z.string().trim().min(1).max(100)).optional(),
  profilePictureUrl: z.string().trim().max(500).optional(),
});

export const experienceSchema = z.object({
  company: z.string().min(1, 'Company is required'),
  title: z.string().min(1, 'Title is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().optional(),
  current: z.boolean().default(false),
  description: z.string().optional(),
});

export const educationSchema = z.object({
  institution: z.string().min(1, 'Institution is required'),
  degree: z.string().min(1, 'Degree is required'),
  field: z.string().optional(),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().optional(),
  description: z.string().optional(),
});

export const skillSchema = z.object({
  name: z.string().min(1, 'Skill name is required'),
  level: z.string().min(1, 'Skill level is required'),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type ExperienceInput = z.infer<typeof experienceSchema>;
export type EducationInput = z.infer<typeof educationSchema>;
export type SkillInput = z.infer<typeof skillSchema>;
