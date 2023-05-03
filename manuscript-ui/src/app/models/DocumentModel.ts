export class DocumentModel {
  public id?: string;
  public documentId?: string;
  public createdTime?: Date;
  public updatedTime?: Date;
  public fileName?: string;
  public status?: string;

  constructor(documentModel: DocumentModel) {
    Object.assign(this, documentModel, {});
  }
}
