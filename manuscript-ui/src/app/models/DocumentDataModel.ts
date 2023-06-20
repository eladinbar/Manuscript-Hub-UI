export class DocumentDataModel {
  public id?: string;
  public infoId!: string;
  public fileName!: string;
  public data!: File;
  public index!: number;

  constructor(documentModel: DocumentDataModel) {
    Object.assign(this, documentModel, {});
  }
}
