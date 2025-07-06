
// New filtered CA result interface
export interface FilteredCaResult {
  form_data: {
    firm_name?: string;
    phone?: string;
  };
  plan_and_expertise: {
    industry: string;
    basic_services: string[];
    advanced_services?: string[];
  };
}

export interface SanitizedCa {
  _id: string;
  email: string;
  type: string;
  form_data: Record<string, any>;
  plan_and_expertise: Record<string, any>;
  frn_number?: string;
  cop_number?: string;
  documents?: string[];
  gallery?: string[];
  role: string;
  isApproved: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

