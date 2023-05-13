import {StatusEnum} from "../enums/StatusEnum";
import {PrivacyEnum} from "../enums/PrivacyEnum";

export class DocumentMetadataModel {
  public id?: string;
  public uid!: string;
  public title!: string;
  public author?: string = "";
  public publicationDate?: Date;
  public description?: string = "";
  public tags?: string[] = [];
  public sharedUserIds?: string[] = [];
  public status?: string = StatusEnum.Enabled;
  public privacy?: string = PrivacyEnum.Private;
  public createdTime?: Date = new Date();
  public updatedTime?: Date = new Date();

  constructor(documentMetadataModel: DocumentMetadataModel) {
    Object.assign(this, documentMetadataModel, {});
  }
}
