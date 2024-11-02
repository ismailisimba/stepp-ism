interface ApplicantFormFields {
  first_name: string;
  last_name: string;
  phone_number: string;
  email: string;
  password: string | null;
  confirm_password: string | null;
  terms: boolean | null;
}

interface ProgramFormFields {
  id: string | null;
  name: string;
  start_date: Date | null;
  end_date: Date | null;
  total_funding_usd: number | null;
  description: string;
  locations: Array<String> | null;
  fileInput: Array<any> | null;
  status: string;
}

interface ProjectFormFields {
  name: string;
  startDate: Date | null;
  endDate: Date | null;
  budget: number | null;
  description: string;
  reportingSchedule: string | null;
  status: string | null;
  activities: Array<any>;
}

interface SearchFormFields {
  search: string;
  start_date_from: Date | null;
  start_date_to: Date | null;
  end_date_from: Date | null;
  end_date_to: Date | null;
  maxFunding: number | null;
  minFunding: number | null;
  maxFundingPerProject: number | null;
  minFundingPerProject: number | null;
  minTotalBudget: number | null;
  maxTotalBudget: number | null;
  status: Array<string> | null;
  locations: Array<string> | null;
}

interface ReportFormFields {
  description: string;
  documents: string | null;
}

interface ActivityFormFields {
  name: string;
  startDate: Date | null;
  endDate: Date | null;
  description: string;
  associatedResults: string;
  associatedOutcomes: string;
}

interface SolicitationFormFields {
  id: string | null;
  name: string;
  program_id: any | null;
  start_date: Date | null;
  end_date: Date | null;
  funding_per_project_usd: number | null;
  status: string;
  description: string;
  locations: Array<String> | null;
  solicitation_questions: Array<String> | null;
  fileInput: Array<any> | null;
}

interface ProfileFormFields {
  first_name: string | null;
  last_name: string;
  email: string | null;
  photo: any | null;
}

interface PasswordResetFormFields {
  current_password: string | null;
  new_password: string | null;
  confirm_password: string | null;
}

interface SupportFormFields {
  message: string;
}
