// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  baseUrl: 'http://localhost:8080',

  RESOURCE_UPLOAD_DOCUMENT_DATA: "/api/document/uploadDocumentData",
  RESOURCE_UPDATE_DOCUMENT_DATA: "/api/document/updateDocumentData",
  RESOURCE_GET_DOCUMENT_DATA_BY_ID: "/api/document/getDocumentDataById",
  RESOURCE_GET_DOCUMENT_DATAS_BY_DOCUMENT_INFO_ID: "/api/document/getDocumentDatasByDocumentInfoId",
  RESOURCE_DELETE_DOCUMENT_DATA_BY_ID: "/api/document/deleteDocumentDataById",

  RESOURCE_UPLOAD_DOCUMENT_INFO: "/api/document/uploadDocumentInfo",
  RESOURCE_UPDATE_DOCUMENT_INFO: "/api/document/updateDocumentInfo",
  RESOURCE_GET_DOCUMENT_INFO_BY_ID: "/api/document/getDocumentInfoById",
  RESOURCE_GET_ALL_DOCUMENT_INFOS_BY_UID: "/api/document/getAllDocumentInfosByUid",
  RESOURCE_GET_ALL_PUBLIC_DOCUMENT_INFOS: "/api/document/getAllPublicDocumentInfos",
  RESOURCE_GET_ALL_SHARED_DOCUMENT_INFOS_BY_UID: "/api/document/getAllSharedDocumentInfosByUid",
  RESOURCE_DELETE_DOCUMENT_INFO_BY_ID: "/api/document/deleteDocumentInfoById",

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
