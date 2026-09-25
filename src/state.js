
export const state = {
  supabaseClient: null,
  currentAdminUser: null,
  appSections: [],
  appCandidates: [],
  appFeedbacks: [],
  isInPageEditActive: false,
  currentCandidateFilter: "all",
  appSiteContent: null
};
window.appState = state;
