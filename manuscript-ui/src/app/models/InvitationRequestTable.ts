import {InvitationEnum} from "../enums/InvitationEnum";
import {RoleEnum} from "../enums/RoleEnum";

export class InvitationRequestTable {
  public email?: string;
  public name?: string;
  public role?: RoleEnum;
  public invitationEnum!: InvitationEnum;
  public isLoading?: boolean = false;

  constructor(requestModel: InvitationRequestTable) {
    Object.assign(this, requestModel, {});
  }
}
