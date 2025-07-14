import { BlogDocument } from "../schemas/blog.schema";

export interface Expert {
    name: string;
    description: string;
    rating: number;
    buttons: {
        profile: string;
        contact: string;
    };
}
export type BlogType = Omit<BlogDocument, 'save' | '__v'> & { _id: string }; // or simplify it as needed

export interface BlogInput {
    title: string;
    dateCreated: string;
    experts: Expert[];
}