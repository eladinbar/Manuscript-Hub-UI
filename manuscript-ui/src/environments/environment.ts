// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  baseUrl: 'http://localhost:8080',

  RESOURCE_UPLOAD_DOCUMENT_DATA: "/api/document/uploadDocumentData",
  RESOURCE_UPDATE_DOCUMENT_DATA: "/api/document/updateDocumentData",
  RESOURCE_GET_DOCUMENT_DATA_BY_ID: "/api/document/getDocumentDataById",
  RESOURCE_DELETE_DOCUMENT_DATA_BY_ID: "/api/document/deleteDocumentDataById",

  RESOURCE_UPLOAD_DOCUMENT_METADATA: "/api/document/uploadDocumentMetadata",
  RESOURCE_UPDATE_DOCUMENT_METADATA: "/api/document/updateDocumentMetadata",
  RESOURCE_GET_DOCUMENT_METADATA_BY_ID: "/api/document/getDocumentMetadataById",
  RESOURCE_GET_ALL_DOCUMENTS_METADATA_BY_UID: "/api/document/getAllDocumentsMetadataByUid",
  RESOURCE_GET_ALL_PUBLIC_DOCUMENTS_METADATA: "/api/document/getAllPublicDocumentsMetadata",
  RESOURCE_GET_ALL_SHARED_DOCUMENTS_METADATA_BY_UID: "/api/document/getAllSharedDocumentsMetadataByUid",
  RESOURCE_DELETE_DOCUMENT_METADATA_BY_ID: "/api/document/deleteDocumentMetadataById",

  SOCKET:"/ads-socket",
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

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
