export const environment = {
  production: true,
  baseUrl: 'http://localhost:8080',

  // Document
  RESOURCE_UPLOAD_FILE: "/api/document/uploadInputDocument",
  RESOURCE_GET_DOCUMENT_BY_ID: "/api/document/getDocumentById/",
  RESOURCE_GET_All_DOCUMENTS_BY_UID: "/api/document/getAllDocumentsByUid/",

  // Algorithm
  RESOURCE_SUBMIT_ALGORITHM: "/api/algorithm/uploadAlgorithm",
  RESOURCE_UPDATE_ALGORITHM: "/api/algorithm/updateAlgorithm",
  RESOURCE_GET_ALGORITHM_BY_ID: "/api/algorithm/getAlgorithmById",
  RESOURCE_GET_ALGORITHM_BY_URL: "/api/algorithm/getAlgorithmByUrl",
  RESOURCE_GET_ALL_ALGORITHMS: "/api/algorithm/getAllAlgorithms",
  RESOURCE_DELETE_ALGORITHM_BY_ID: "/api/algorithm/deleteAlgorithmById",
  RESOURCE_DELETE_ALGORITHM_BY_URL: "/api/algorithm/deleteAlgorithmByUrl",

  // Invitation Request
  RESOURCE_APPROVE_INVITATION_REQUEST: "/api/invitation/approveInvitationRequest/",
  RESOURCE_DENY_INVITATION_REQUEST: "/api/invitation/denyInvitationRequest/",
  RESOURCE_GET_ALL_INVITATIONS: "/api/invitation/getAllInvitations/",

  SOCKET: "/ads-socket",
  firebase: {
    apiKey: "AIzaSyAabED_QgmCVo72G8PV3vPgDVBboIX2uSg",
    authDomain: "manuscripthub-df862.firebaseapp.com",
    projectId: "manuscripthub-df862",
    storageBucket: "manuscripthub-df862.appspot.com",
    messagingSenderId: "857544964572",
    appId: "1:857544964572:web:e9c09aaaff190f9d587719",
    measurementId: "G-6RB7E1JCF9"
  }
};
