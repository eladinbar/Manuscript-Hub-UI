export class DocumentModel {
  public documentId?: string;
  public documentMetadataId?: string;
  public userId?: string;
  public fileName?: string;
  public status?: string;
  public createdTime?: Date;
  public updatedTime?: Date;
  public data!: File;

  constructor(documentModel: DocumentModel) {
    Object.assign(this, documentModel, {});
  }
}
