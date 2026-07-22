-- Seed generic question templates
-- These are common questions that can be used by all HR and Admin users

INSERT INTO question_templates (id, label, field_type, category, user_id, is_required, placeholder, helper_text, max_rating, options, usage_count, created_at) VALUES
-- Text fields
(gen_1, 'Full Name', 'text', 'generic', NULL, true, 'Enter your full name', 'Please provide your legal name as it appears on official documents', 5, NULL, 0, NOW()),
(gen_2, 'Email Address', 'text', 'generic', NULL, true, 'your.email@example.com', 'We will use this email for all communication', 5, NULL, 0, NOW()),
(gen_3, 'Phone Number', 'text', 'generic', NULL, true, '+1 234 567 8900', 'Include country code', 5, NULL, 0, NOW()),
(gen_4, 'Current Location', 'text', 'generic', NULL, true, 'City, State, Country', 'Where are you currently located?', 5, NULL, 0, NOW()),
(gen_5, 'LinkedIn Profile URL', 'text', 'generic', NULL, false, 'https://linkedin.com/in/yourprofile', 'Link to your LinkedIn profile', 5, NULL, 0, NOW()),
(gen_6, 'Portfolio URL', 'text', 'generic', NULL, false, 'https://yourportfolio.com', 'Link to your portfolio or website', 5, NULL, 0, NOW()),
(gen_7, 'GitHub Profile URL', 'text', 'generic', NULL, false, 'https://github.com/yourusername', 'Link to your GitHub profile', 5, NULL, 0, NOW()),

-- Textarea fields
(gen_8, 'Professional Summary', 'textarea', 'generic', NULL, false, 'Brief summary of your professional background', 'Tell us about yourself in 2-3 sentences', 5, NULL, 0, NOW()),
(gen_9, 'Why are you interested in this role?', 'textarea', 'generic', NULL, true, 'Explain your motivation', 'What excites you about this position?', 5, NULL, 0, NOW()),
(gen_10, 'Describe a challenging project you worked on', 'textarea', 'generic', NULL, false, 'Describe the project, your role, and the outcome', 'Share a specific example from your experience', 5, NULL, 0, NOW()),
(gen_11, 'What are your salary expectations?', 'textarea', 'generic', NULL, false, 'Provide your expected salary range', 'This helps us ensure alignment', 5, NULL, 0, NOW()),
(gen_12, 'When can you start?', 'textarea', 'generic', NULL, true, 'Provide your availability', 'Your earliest start date', 5, NULL, 0, NOW()),

-- Dropdown fields
(gen_13, 'Years of Experience', 'dropdown', 'generic', NULL, true, NULL, 'Total years of professional experience', 5, '[{"label": "0-1 years"}, {"label": "1-3 years"}, {"label": "3-5 years"}, {"label": "5-10 years"}, {"label": "10+ years"}]', 0, NOW()),
(gen_14, 'Employment Type Preference', 'dropdown', 'generic', NULL, true, NULL, 'What type of employment are you looking for?', 5, '[{"label": "Full-time"}, {"label": "Part-time"}, {"label": "Contract"}, {"label": "Freelance"}]', 0, NOW()),
(gen_15, 'Work Mode Preference', 'dropdown', 'generic', NULL, true, NULL, 'How would you prefer to work?', 5, '[{"label": "On-site"}, {"label": "Remote"}, {"label": "Hybrid"}]', 0, NOW()),
(gen_16, 'Highest Education Level', 'dropdown', 'generic', NULL, true, NULL, 'Select your highest completed education', 5, '[{"label": "High School"}, {"label": "Associate Degree"}, {"label": "Bachelor''s Degree"}, {"label": "Master''s Degree"}, {"label": "PhD"}, {"label": "Other"}]', 0, NOW()),
(gen_17, 'Notice Period', 'dropdown', 'generic', NULL, true, NULL, 'How much notice do you need to give your current employer?', 5, '[{"label": "Immediate"}, {"label": "1-2 weeks"}, {"label": "1 month"}, {"label": "2 months"}, {"label": "3+ months"}]', 0, NOW()),

-- Multi-select fields
(gen_18, 'Programming Languages', 'multi_select', 'generic', NULL, false, NULL, 'Select languages you are proficient in', 5, '[{"label": "JavaScript"}, {"label": "Python"}, {"label": "Java"}, {"label": "C++"}, {"label": "C#"}, {"label": "Go"}, {"label": "Ruby"}, {"label": "PHP"}, {"label": "Swift"}, {"label": "Kotlin"}]', 0, NOW()),
(gen_19, 'Frameworks & Libraries', 'multi_select', 'generic', NULL, false, NULL, 'Select frameworks you have experience with', 5, '[{"label": "React"}, {"label": "Angular"}, {"label": "Vue.js"}, {"label": "Node.js"}, {"label": "Django"}, {"label": "Spring Boot"}, {"label": ".NET"}, {"label": "Flutter"}, {"label": "React Native"}]', 0, NOW()),
(gen_20, 'Databases', 'multi_select', 'generic', NULL, false, NULL, 'Select databases you have worked with', 5, '[{"label": "PostgreSQL"}, {"label": "MySQL"}, {"label": "MongoDB"}, {"label": "Redis"}, {"label": "SQLite"}, {"label": "Oracle"}, {"label": "SQL Server"}]', 0, NOW()),
(gen_21, 'Cloud Platforms', 'multi_select', 'generic', NULL, false, NULL, 'Select cloud platforms you have experience with', 5, '[{"label": "AWS"}, {"label": "Google Cloud"}, {"label": "Azure"}, {"label": "Heroku"}, {"label": "DigitalOcean"}]', 0, NOW()),
(gen_22, 'Tools & Technologies', 'multi_select', 'generic', NULL, false, NULL, 'Select tools you are familiar with', 5, '[{"label": "Git"}, {"label": "Docker"}, {"label": "Kubernetes"}, {"label": "Jenkins"}, {"label": "CI/CD"}, {"label": "Linux"}, {"label": "Agile/Scrum"}]', 0, NOW()),

-- File upload
(gen_23, 'Resume/CV', 'file', 'generic', NULL, true, NULL, 'Upload your resume in PDF format', 'Max file size: 5MB', 5, NULL, 0, NOW()),
(gen_24, 'Cover Letter', 'file', 'generic', NULL, false, NULL, 'Upload your cover letter (optional)', 'Max file size: 5MB', 5, NULL, 0, NOW()),

-- Checkbox
(gen_25, 'I am willing to relocate', 'checkbox', 'generic', NULL, false, NULL, 'Check if you are open to relocating for this role', NULL, 5, NULL, 0, NOW()),
(gen_26, 'I require visa sponsorship', 'checkbox', 'generic', NULL, false, NULL, 'Check if you need visa sponsorship', NULL, 5, NULL, 0, NOW()),

-- Date
(gen_27, 'Date of Birth', 'date', 'generic', NULL, false, NULL, 'Your date of birth', 'For age verification purposes only', 5, NULL, 0, NOW()),
(gen_28, 'Expected Start Date', 'date', 'generic', NULL, true, NULL, 'When can you join?', NULL, 5, NULL, 0, NOW()),

-- Number
(gen_29, 'Current CTC (Annual)', 'number', 'generic', NULL, false, 'Enter amount in USD', 'Current annual compensation', 5, NULL, 0, NOW()),
(gen_30, 'Expected CTC (Annual)', 'number', 'generic', NULL, false, 'Enter amount in USD', 'Expected annual compensation', 5, NULL, 0, NOW()),

-- Rating
(gen_31, 'Rate your proficiency in [Skill]', 'rating', 'generic', NULL, false, NULL, '1 = Beginner, 5 = Expert', 5, NULL, 0, NOW()),

-- Yes/No
(gen_32, 'Do you have experience working in a similar industry?', 'yes_no', 'generic', NULL, false, NULL, 'Industry experience check', NULL, 5, NULL, 0, NOW()),
(gen_33, 'Are you available for overtime?', 'yes_no', 'generic', NULL, false, NULL, 'Overtime availability', NULL, 5, NULL, 0, NOW())
ON CONFLICT DO NOTHING;
