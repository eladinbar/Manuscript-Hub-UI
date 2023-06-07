import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import Swal from "sweetalert2";
import {MatTableDataSource} from "@angular/material/table";
import {MatSort} from "@angular/material/sort";
import {MatPaginator} from "@angular/material/paginator";
import {ActivatedRoute} from "@angular/router";
import {InvitationsService} from "../../../services/invitations.service";
import {InvitationRequestTable} from "../../../models/InvitationRequestTable";
import {InvitationEnum} from "../../../enums/InvitationEnum";

@Component({
  selector: 'app-invitations',
  templateUrl: './invitations.component.html',
  styleUrls: ['./invitations.component.css']
})
export class InvitationsComponent implements OnInit {
  tableElements?: Array<InvitationRequestTable> = [];
  dataSource: MatTableDataSource<InvitationRequestTable> = new MatTableDataSource<InvitationRequestTable>();
  @ViewChild(MatSort, {static: false}) sort!: MatSort;
  @ViewChild(MatPaginator, {static: false}) paginator!: MatPaginator;
  tableCols = ['email', 'name', 'role', 'invitationEnum', 'edit'];
  @ViewChild('assignStationModal') assignModal?: ElementRef;
  message = '';

  constructor(private route: ActivatedRoute, private invitationService: InvitationsService) { }

  ngOnInit(): void {
    this.fetchTableData();
  }

  fetchTableData(): void {
    this.invitationService.getAllInvitations().subscribe(res => {
        this.tableElements = res;
        this.initDataSource(res);
      });
  }

  private initDataSource(res: Array<InvitationRequestTable>): void {
    this.dataSource = new MatTableDataSource<InvitationRequestTable>(this.tableElements);
    this.dataSource.sort = this.sort!;
    this.dataSource.paginator = this.paginator;
  }

  approveRequest(invitationRequest: InvitationRequestTable): void {
    Swal.fire({
      title: 'Subscribe request',
      text: `The user will be approved`,
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Approve',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#051390'
    }).then((result) => {
      if (result.value) {
        this.invitationService.approveRequest(invitationRequest.email!).subscribe(res => {
            if (res) {
              this.tableElements = res;
              this.dataSource.data = res;
            }
          });
      } else {
      }
    });
  }

  denyRequest(invitationRequest: InvitationRequestTable): void {
    let newButtonText: string = 'Deny';

    if(invitationRequest.invitationEnum === InvitationEnum.Approved)
      newButtonText = "Ban";

    Swal.fire({
      title: 'Subscribe request',
      text: `The user will be disabled`,
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: newButtonText,
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#f44336'
    }).then((result) => {
      if (result.value) {
        this.invitationService.denyRequest(invitationRequest.email!).subscribe(res => {
            if (res) {
              this.tableElements = res;
              this.dataSource.data = res;
            }
          });
      } else {
      }
    });
  }
}
