import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../../config/cloudinary";

// Storage for resume files (PDF/DOCX)
const resumeStorage = new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => {
        return {
            folder: "hirehelp/resumes",
            resource_type: "raw",
            allowed_formats: ["pdf", "docx", "doc"],
        };
    },
});

// Storage for profile pictures (images)
const profilePictureStorage = new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => {
        return {
            folder: "hirehelp/profile-pictures",
            resource_type: "image",
            allowed_formats: ["jpg", "jpeg", "png", "webp"],
        };
    },
});

export const uploadResume = multer({
    storage: resumeStorage,
});

export const uploadResumesBulk = multer({
    storage: resumeStorage,
    limits: { files: 50, fileSize: 10 * 1024 * 1024 },
}).array('resumes', 50);

export const uploadProfilePicture = multer({
    storage: profilePictureStorage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
});