export const environment = {
  production: true,
  baseUrl: 'http://localhost:8080',

  RESOURCE_UPLOAD_FILE: "/api/document/uploadInputDocument",
  RESOURCE_GET_DOCUMENT_BY_ID: "/api/document/getDocumentById/",
  RESOURCE_GET_All_DOCUMENTS_BY_UID: "/api/document/getAllDocumentsByUid/",
  RESOURCE_SUBMIT_ALGORITHM: "/api/algorithm/uploadAlgorithm/",
  RESOURCE_GET_ALL_INVITATIONS: "/api/invitation/getAllInvitations/",
  RESOURCE_ACCEPT_REQUEST_INVITATIONS: "/api/invitation/acceptRequest/",
  RESOURCE_DENY_REQUEST_INVITATIONS: "/api/invitation/denyRequest/",

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
