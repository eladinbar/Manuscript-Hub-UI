import {InvitationEnum} from "../enums/InvitationEnum";
import {UserModel} from "./UserModel";

export class InvitationRequestModel {
  public id?: string;
  public updatedTime?: Date;
  public createdTime?: Date;
  public userModel!: UserModel;
  public InvitationEnum!: InvitationEnum;


  constructor(requestModel: InvitationRequestModel) {
    Object.assign(this, requestModel, {});
  }
}
