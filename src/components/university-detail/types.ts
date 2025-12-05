export interface UniversityDetail {
    id: string;
    name: string;
    city: string;
    address: string;
    website: string;
    tuition_range: string;
    ranking: number;
    programs: string[];
    disciplines: string[];
    contact_email: string;
    contact_phone: string;
    description: string;
    apply_link: string;
    images?: string[];
    icon_url?: string;
    size?: string;
    credit_hours?: number;
    starting_date?: string;
    available_seats?: number;
    admission_requirements?: string;
    application_deadline?: string;
    study_mode?: string;
}
