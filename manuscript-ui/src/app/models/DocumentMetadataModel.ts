export class DocumentMetadataModel {
  public id?: string;
  public documentId!: string;
  public uid!: string;
  public fileName!: string;
  public author!: string;
  public publicationDate?: Date;
  public language!: string;
  public description!: string;
  public status!: string;
  public privacy!: string;
  public createdTime!: Date;
  public updatedTime!: Date;

  constructor(documentMetadataModel: DocumentMetadataModel) {
    Object.assign(this, documentMetadataModel, {});
  }
}
