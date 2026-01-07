export type FeatureItem = {
  id: string
  label: string
}

export type FeatureGroup = {
  id: string
  label: string
  children: FeatureItem[]
}

export const featureGroups: FeatureGroup[] = [
  {
    id: 'profiles',
    label: 'Maintain profiles',
    children: [
      { id: 'profiles.register', label: 'Register profile' },
      { id: 'profiles.change', label: 'Change profile data' },
      { id: 'profiles.list', label: 'List profiles' },
      { id: 'profiles.access_view', label: 'Access profile display' },
      { id: 'profiles.delete', label: 'Delete profile' },
      { id: 'profiles.view', label: 'View profile' },
    ],
  },
  {
    id: 'functionalities',
    label: 'Maintain functionalities',
    children: [
      { id: 'functionalities.register', label: 'Register functionality' },
      { id: 'functionalities.delete', label: 'Delete functionality' },
      { id: 'functionalities.list', label: 'List functionality' },
      { id: 'functionalities.add_to_profile', label: 'Add functionality to profile' },
      { id: 'functionalities.delete_from_profile', label: 'Delete functionality from profile' },
    ],
  },
  {
    id: 'users',
    label: 'Maintain users',
    children: [
      { id: 'users.register', label: 'Register new user' },
      { id: 'users.list', label: 'List users' },
      { id: 'users.delete', label: 'Delete user' },
      { id: 'users.view_profile', label: 'View profile' },
      { id: 'users.change_data', label: 'Change user data' },
      { id: 'users.change_password', label: 'Change password' },
      { id: 'users.remember_password', label: "Remember password" },
      { id: 'users.login', label: 'Log in to the system' },
      { id: 'users.logout', label: 'Log out of the system' },
    ],
  },
  {
    id: 'projects',
    label: 'Maintain projects',
    children: [
      { id: 'projects.register', label: 'Register new project' },
      { id: 'projects.list', label: 'List projects' },
      { id: 'projects.search', label: 'Search projects' },
      { id: 'projects.view', label: 'View project' },
      { id: 'projects.change', label: 'Change project data' },
      { id: 'projects.delete', label: 'Delete project' },
    ],
  },
  {
    id: 'questionnaires',
    label: 'Maintain questionnaires',
    children: [
      { id: 'questionnaires.register', label: 'Register questionnaire' },
      { id: 'questionnaires.list', label: 'List questionnaires' },
      { id: 'questionnaires.search', label: 'Search questionnaires' },
      { id: 'questionnaires.view', label: 'View questionnaire' },
      { id: 'questionnaires.change', label: 'Change questionnaire data' },
      { id: 'questionnaires.delete', label: 'Delete questionnaire' },
    ],
  },
  {
    id: 'questions',
    label: 'Maintain questions',
    children: [
      { id: 'questions.register', label: 'Register question' },
      { id: 'questions.list', label: 'List questions' },
      { id: 'questions.search', label: 'Search question' },
      { id: 'questions.view', label: 'View question' },
      { id: 'questions.change', label: 'Change question' },
      { id: 'questions.delete', label: 'Delete question' },
    ],
  },
  {
    id: 'answers',
    label: 'Maintain question answers',
    children: [
      { id: 'answers.register', label: 'Register question answer' },
      { id: 'answers.list', label: 'List question answers' },
      { id: 'answers.search', label: 'Search question answers' },
      { id: 'answers.view', label: 'View question answer' },
      { id: 'answers.change', label: 'Change question answer' },
      { id: 'answers.delete', label: 'Delete question answer' },
    ],
  },
  {
    id: 'notifications',
    label: 'Keep notifications',
    children: [
      { id: 'notifications.create', label: 'Create new notification' },
      { id: 'notifications.list', label: 'List notifications' },
      { id: 'notifications.delete', label: 'Delete notification' },
      { id: 'notifications.search', label: 'Search notification' },
      { id: 'notifications.view', label: 'View notification' },
    ],
  },
  {
    id: 'liabilities',
    label: 'Keep liabilities',
    children: [
      { id: 'liabilities.create', label: 'Create new liability' },
      { id: 'liabilities.change', label: 'Change liability' },
      { id: 'liabilities.list', label: 'List liabilities' },
      { id: 'liabilities.view', label: 'View liability' },
      { id: 'liabilities.consult', label: 'Consult liability' },
      { id: 'liabilities.delete', label: 'Delete liability' },
      { id: 'liabilities.export.csv', label: 'Export to CSV' },
      { id: 'liabilities.export.excel', label: 'Export to Excel' },
      { id: 'liabilities.export.kmz', label: 'Export to KMZ' },
      { id: 'liabilities.export.kml', label: 'Export to KML' },
    ],
  },
  {
    id: 'reports',
    label: 'Reports',
    children: [
      { id: 'reports.data_collection_researcher', label: 'Data collection by researcher' },
      { id: 'reports.by_questionnaire', label: 'Data collection by questionnaire' },
      { id: 'reports.view_responses_map', label: 'View responses on map' },
    ],
  },
  {
    id: 'other',
    label: 'Other',
    children: [
      { id: 'other.draw_polygon', label: 'Draw response polygon' },
      { id: 'other.capture_image', label: 'Capture image' },
      { id: 'other.capture_audio', label: 'Capture audio' },
      { id: 'other.capture_video', label: 'Capture video' },
      { id: 'other.capture_location', label: 'Capture location' },
      { id: 'other.store_offline', label: 'Store content/media offline' },
      { id: 'other.send_to_server', label: 'Send to server' },
      { id: 'other.receive_from_server', label: 'Receive from server' },
      { id: 'other.transcribe_audio', label: 'Transcribe audio' },
      { id: 'other.send_message', label: 'Send message to collector' },
      { id: 'other.reply_message', label: 'Reply' },
      { id: 'other.list_messages', label: 'List messages' },
      { id: 'other.read_message', label: 'Read message' },
    ],
  },
]
