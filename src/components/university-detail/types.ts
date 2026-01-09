export interface Program {
    name: string;
    url: string;
}

export interface UniversityDetail {
    id: string;
    name: string;
    city: string;
    address: string;
    website: string;
    tuition_range: string;
    ranking: number;
    programs: Program[];
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
    admission_requirements?: string;
    application_deadline?: string;
    study_mode?: string;
    hec_recognized?: boolean;
    scimago_ranking?: string;
    qs_ranking?: string;
}
