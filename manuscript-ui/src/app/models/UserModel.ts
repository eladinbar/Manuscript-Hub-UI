import {StatusEnum} from "../enums/StatusEnum";
import {RoleEnum} from "../enums/RoleEnum";

export class UserModel {
  public id?: string;
  public uid!: string;
  public email!: string;
  public name!: string;
  public phoneNumber?: string;
  public role!: RoleEnum;
  public status?: StatusEnum = StatusEnum.Enabled;
  public createdTime?: Date;
  public updatedTime?: Date;


  constructor(userModel: UserModel) {
    Object.assign(this, userModel, {});
  }
}
