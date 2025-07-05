export interface Expert {
    name: string;
    description: string;
    rating: number;
    buttons: {
        profile: string;
        contact: string;
    };
}

export interface BlogInput {
    title: string;
    dateCreated: string;
    experts: Expert[];
}