import {Status} from "../enums/Status";
import {RoleEnum} from "../enums/RoleEnum";

export class UserModel {
  public id?: string;
  public uid?: string;
  public createdTime?: Date;
  public updatedTime?: Date;
  public email!: string;
  public name?: string;
  public Role?: RoleEnum;
  public Status?: Status;


  constructor(userModel: UserModel) {
    Object.assign(this, userModel, {});
  }
}
