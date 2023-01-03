// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  baseUrl: 'http://localhost:8080',
  RESOURCE_UPLOAD_FILE: "/api/document/uploadInputDocument",
  RESOURCE_GET_VIDEO_INFO_STATISTIC: "/api/video/getVideoInfo/",
  RESOURCE_GET_DOCUMENT_BY_ID: "/api/document/getDocumentById/",
  RESOURCE_GET_All_DOCUMENTS: "/api/document/getAllDocuments/",
  SOCKET:"/ads-socket",
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
