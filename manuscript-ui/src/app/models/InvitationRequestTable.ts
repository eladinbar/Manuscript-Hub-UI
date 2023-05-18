import {InvitationEnum} from "../enums/InvitationEnum";
import {Role} from "./Role";

export class InvitationRequestTable {
  public email?: string;
  public name?: string;
  public role?: Role;
  public invitationEnum!: InvitationEnum;

  constructor(requestModel: InvitationRequestTable) {
    Object.assign(this, requestModel, {});
  }
}
