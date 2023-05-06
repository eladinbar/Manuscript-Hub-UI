import {StatusEnum} from "../enums/StatusEnum";
import {PrivacyEnum} from "../enums/PrivacyEnum";

export class DocumentMetadataModel {
  public id?: string;
  public documentId?: string;
  public uid!: string;
  public title!: string;
  public author?: string = "";
  public publicationDate?: Date;
  public language?: string;
  public description?: string = "";
  public status?: string = StatusEnum.ENABLED;
  public privacy?: string = PrivacyEnum.Private;
  public tags?: string[] = [];
  public createdTime?: Date = new Date();
  public updatedTime?: Date = new Date();

  constructor(documentMetadataModel: DocumentMetadataModel) {
    Object.assign(this, documentMetadataModel, {});
  }
}
