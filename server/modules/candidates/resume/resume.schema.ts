import { z } from 'zod';

export const uploadResumeSchema = z.object({
  originalFileName: z.string().min(1, 'Filename is required'),
  fileSize: z.number().positive('File size must be positive'),
  fileType: z.string().min(1, 'File type is required'),
});

export type UploadResumeInput = z.infer<typeof uploadResumeSchema>;
