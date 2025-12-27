export interface Profile {
    full_name: string;
    email: string;
    city: string;
    date_of_birth: string;
    gender: string;
    nationality: string;
    phone: string;
    state: string;
    zip_code: string;
    address: string;
    preferred_discipline: string;
    preferred_location?: string;
    preferred_fee?: string;
    profilepic: string | null;
}

export interface University {
    id: string;
    name: string;
    city: string;
    tuition_range?: string;
    study_mode?: string;
    application_deadline?: string;
    disciplines?: string[];
    images?: string[];
    icon_url?: string;
    hec_recognized?: boolean;
    scimago_ranking?: string;
    qs_ranking?: string;
}

export interface Favorite {
    id: string;
    item_type: string;
    item_id: string;
    item_name: string;
}
