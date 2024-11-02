interface ApiEndpoints {
  locations: string;
  schema: string;
  programs: string;
  programsApplicant: string;
  programsStore: string;
  programsUpdate: string;
  programDelete: string;
  programGet: string;
  programUpdateStatus: string;

  solicitations: string;
  solicitationsApplicant: string;
  solicitationsStore: string;
  solicitationsUpdate: string;
  solicitationsDelete: string;
  solicitationsGet: string;
  solicitationQuestionsUpdate: string;
  solicitationUpdateStatus: string;
  solicitationsRank: string;
  solicitationsShortlist: string;
  solicitationsAward: string;

  solicitationQuestionsGet: string;
  solicitationQuestionsGetApplicant: string;
  solicitationQuestionsGetSavedAnswers: string;
  solicitationQuestionsSaveAnswers: string;
  solicitationQuestionsSubmitAnswers: string;

  login: string;
  signUpApplicant: string;
  signUpDonor: string;
  signUpwithGoogleApplicant: string;
  signUpwithGoogleDonor: string;
  loginWithGoogle: string;
  resetPassword: string;
  completePasswordReset: string;
  logout: string;
  updateProfile: string;
  checkUserStatus: string;
  getAuthUser: string;

  fileGet: string;
  fileInfo: string;

  applicationsDonor: string;
  applicationsApplicant: string;
  applicationGet: string;
  applicationSaveMarks: string;
  applicationSubmitMarks: string;
  applicationDelete: string;

  projectsDonor: string;
  projectsApplicant: string;
  projectGet: string;
  projectAdd: string;
  projectUpdate: string;
  projectDelete: string;
  projectUpdateStatus: string;

  reportsDonor: string;
  reportsApplicant: string;
  reportGet: string;
  reportUpdate: string;
  reportDelete: string;
  reportUpdateStatus: string;

  supportSendMessage: string;

  publicFiles: string;

  homeGraphsDonor: string;
  programGraphsDonor: string;
  solicitationGraphsDonor: string;
  applicationGraphsDonor: string;
  projectGraphsDonor: string;
  reportGraphsDonor: string;
  homeGraphsApplicant: string;
  programGraphsApplicant: string;
  solicitationGraphsApplicant: string;
  applicationGraphsApplicant: string;
  projectGraphsApplicant: string;
  reportGraphsApplicant: string;

  searchDonor: string;
  searchApplicant: string;
}

const apiEndpoints: ApiEndpoints = {
  //Auth
  login: "login-a-user",
  signUpApplicant: "sign-up-as-applicant",
  signUpDonor: "sign-up-as-donor",
  signUpwithGoogleApplicant: "signupwithgoogle-applicant",
  signUpwithGoogleDonor: "signupwithgoogle-donor",
  loginWithGoogle: "loginwithgoogle",
  resetPassword: "reset-password",
  completePasswordReset: "complete-password-reset",
  logout: "logout",
  updateProfile: "updateuserinfo",
  checkUserStatus: "checkloginstatus",
  getAuthUser: "getuserinfo",

  //Schema
  schema: "libraries/program_data_schema.json",

  //Location
  locations: "libraries/program_data_schema.json",

  // Program
  programs: "paginate/program",
  programsApplicant: "paginate_applicant/program",
  programsStore: "update-a-table/program/add",
  programsUpdate: "update-a-table/program/update",
  programDelete: "update-a-table/program/delete",
  programGet: "get-item-or-row/program",
  programUpdateStatus: "table-action/program",

  // Solicitation
  solicitations: "paginate/solicitation",
  solicitationsApplicant: "paginate_applicant/solicitation",
  solicitationsStore: "update-a-table/solicitation/add",
  solicitationsUpdate: "update-a-table/solicitation/update",
  solicitationsDelete: "update-a-table/solicitation/delete",
  solicitationsGet: "get-item-or-row/solicitation",
  solicitationsRank: "/rank-applications",
  solicitationsShortlist: "shortlist-applications",
  solicitationsAward: "award-applications",
  solicitationQuestionsUpdate:
    "update-table-cell/solicitation/update-questions-json",

  solicitationQuestionsGet: "public_files",
  solicitationQuestionsGetApplicant: "public_questions",
  solicitationQuestionsGetSavedAnswers: "update-answers-json",
  solicitationQuestionsSaveAnswers: "update-answers-json",
  solicitationQuestionsSubmitAnswers: "update-answers-json",
  solicitationUpdateStatus: "table-action/solicitation",

  //File
  fileGet: "public_files",
  fileInfo: "public_files_meta",
  publicFiles: "public_files",

  // Applications
  applicationsDonor: "paginate/application",
  applicationsApplicant: "paginate_applicant/application",
  applicationGet: "get-item-or-row/application",
  applicationSaveMarks: "update-answers-json",
  applicationSubmitMarks: "update-answers-json",
  applicationDelete: "update-a-table/appication/delete",

  //Projects
  projectsDonor: "paginate/project",
  projectsApplicant: "paginate_applicant/project",
  projectGet: "get-item-or-row/project",
  projectAdd: "update-a-table/project/add",
  projectUpdate: "update-a-table/project/update",
  projectDelete: "update-a-table/project/delete",
  projectUpdateStatus: "table-action/project",

  //Reports
  reportsDonor: "paginate/reports",
  reportsApplicant: "paginate_applicant/reports",
  reportGet: "get-item-or-row/reports",
  reportUpdate: "update-a-table/reports/update",
  reportDelete: "update-a-table/reports/delete",
  reportUpdateStatus: "table-action/reports",

  //Support
  supportSendMessage: "submitissue",

  //Graph
  homeGraphsDonor: "dashboard-data/status",
  programGraphsDonor: "program-dashboard-data",
  solicitationGraphsDonor: "solicitation-dashboard-data",
  applicationGraphsDonor: "solicitation-dashboard-data",
  projectGraphsDonor: "project-dashboard-data",
  reportGraphsDonor: "project-dashboard-data",
  homeGraphsApplicant: "dashboard-data-applicant/status",
  programGraphsApplicant: "",
  solicitationGraphsApplicant: "",
  applicationGraphsApplicant: "",
  projectGraphsApplicant: "",
  reportGraphsApplicant: "",

  //Search
  searchDonor: "search",
  searchApplicant: "search_applicant",
};

export default apiEndpoints;
