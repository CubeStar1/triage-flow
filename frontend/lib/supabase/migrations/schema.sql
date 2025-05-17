-- Enable UUID generation if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA extensions;

-- Create ENUM types for controlled vocabularies

-- User Role ENUM
CREATE TYPE public.user_role_enum AS ENUM (
    'healthcare_worker',
    'patient'
);

-- User Roles Table
CREATE TABLE public.user_roles (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role public.user_role_enum NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- -- Enable RLS for user_roles
-- ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- -- User roles policies
-- CREATE POLICY "Users can view own role"
--     ON public.user_roles FOR SELECT
--     TO authenticated
--     USING (user_id = auth.uid());

-- CREATE POLICY "Users can update own role"
--     ON public.user_roles FOR UPDATE
--     TO authenticated
--     USING (user_id = auth.uid());

CREATE TRIGGER update_user_roles_updated_at
    BEFORE UPDATE ON public.user_roles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Patient Sex ENUM
CREATE TYPE public.patient_sex_enum AS ENUM (
    'Male',
    'Female',
    'Other',
    'Prefer not to say'
);

-- Recent Travel ENUM
CREATE TYPE public.recent_travel_enum AS ENUM (
    'yes',
    'no'
);

-- Recommendation Status ENUM (derived from severity)
CREATE TYPE public.recommendation_status_enum AS ENUM (
    'mild',
    'moderate',
    'severe',
    'critical'
);

-- assessments Table
CREATE TABLE public.assessments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    symptom_description TEXT NOT NULL,
    image_file_name TEXT,
    image_file_type TEXT,
    image_url TEXT,
    image_storage_path TEXT,
    patient_name TEXT,
    patient_age INTEGER CHECK (patient_age > 0),
    patient_sex public.patient_sex_enum,
    symptom_duration TEXT,
    pain_level TEXT,
    affected_body_parts TEXT,
    has_fever BOOLEAN DEFAULT false,
    temperature_celsius REAL CHECK (temperature_celsius >= 35.0 AND temperature_celsius <= 43.0),
    known_allergies TEXT,
    current_medications TEXT,
    recent_travel public.recent_travel_enum,
    pre_existing_conditions TEXT,
    predicted_injury_label TEXT,
    injury_description_summary TEXT,
    severity_score INTEGER CHECK (severity_score >= 1 AND severity_score <= 5),
    severity_reason TEXT,
    recommendation_status public.recommendation_status_enum,
    triage_recommendation TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    CONSTRAINT valid_fever_temp CHECK (
        (has_fever = false) OR 
        (has_fever = true AND temperature_celsius IS NOT NULL)
    )
);

-- possible_diagnoses Table
CREATE TABLE public.possible_diagnoses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    assessment_id UUID NOT NULL REFERENCES public.assessments(id) ON DELETE CASCADE,
    diagnosis_name TEXT NOT NULL,
    confidence_score REAL CHECK (confidence_score >= 0.0 AND confidence_score <= 1.0),
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Trigger to automatically update 'updated_at' timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_assessments_updated_at
    BEFORE UPDATE ON public.assessments
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.possible_diagnoses ENABLE ROW LEVEL SECURITY;

-- Assessment policies
CREATE POLICY "Users can view own assessments"
    ON public.assessments FOR SELECT
    TO authenticated
    USING (user_id = auth.uid());

CREATE POLICY "Users can create assessments"
    ON public.assessments FOR INSERT
    TO authenticated
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own assessments"
    ON public.assessments FOR UPDATE
    TO authenticated
    USING (user_id = auth.uid());

-- Possible diagnoses policies
CREATE POLICY "Users can view diagnoses for own assessments"
    ON public.possible_diagnoses FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.assessments a
            WHERE a.id = assessment_id
            AND a.user_id = auth.uid()
        )
    );

CREATE POLICY "System can create diagnoses"
    ON public.possible_diagnoses FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.assessments a
            WHERE a.id = assessment_id
            AND a.user_id = auth.uid()
        )
    );