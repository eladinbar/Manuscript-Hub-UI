import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import Swal from "sweetalert2";
import {MatTableDataSource} from "@angular/material/table";
import {MatSort} from "@angular/material/sort";
import {MatPaginator} from "@angular/material/paginator";
import {FormBuilder, FormGroup} from "@angular/forms";
import {ActivatedRoute} from "@angular/router";
import {InvitationsService} from "../../services/invitations.service";
import {InvitationRequestTable} from "../../models/InvitationRequestTable";

@Component({
  selector: 'app-invitations',
  templateUrl: './invitations.component.html',
  styleUrls: ['./invitations.component.css']
})
export class InvitationsComponent implements OnInit {

  data = {
    id: 0
  };
  tableElements?: Array<InvitationRequestTable> = [];
  dataSource: MatTableDataSource<InvitationRequestTable> = new MatTableDataSource<InvitationRequestTable>();
  @ViewChild(MatSort, {static: false}) sort!: MatSort;
  @ViewChild(MatPaginator, {static: false}) paginator!: MatPaginator;
  tableCols = ['email', 'name', 'role', 'invitationEnum', 'edit'];
  @ViewChild('assignStationModal') assignModal?: ElementRef;
  form!: FormGroup;
  message = '';
  assignValid = true;

  constructor(private route: ActivatedRoute, private fb: FormBuilder, private invitationService: InvitationsService
    ,) {

    // this.form = this.fb.group({
    //   requestType: [''],
    //   endDate: '',
    //   id: [''],
    //   userId: ''
    // });

  }

  ngOnInit(): void {
    this.fetchTableData();
  }

  fetchTableData(): void {
    this.invitationService
      .getAllInvitations()
      .subscribe(res => {
        this.tableElements = res;
        this.initDataSource(res);
      });
  }

  private initDataSource(res: Array<InvitationRequestTable>): void {
    this.dataSource = new MatTableDataSource<InvitationRequestTable>(this.tableElements);
    this.dataSource.sort = this.sort!;
    this.dataSource.paginator = this.paginator;
  }

  denyRequest(element: any): void {
    Swal.fire({
      title: 'Subscribe request',
      text: `The request will be permanently deleted`,
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#ff4500'
    }).then((result) => {
      if (result.value) {
        this.invitationService
          .denyRequest(element.email)
          .subscribe(res => {
            if (res) {
              this.tableElements = res;
              this.dataSource.data = res;
            }
          });
      } else {
      }
    });
  }

  acceptRequest(element: any): void {
    Swal.fire({
      title: 'Subscribe request',
      text: `The request will be accepted`,
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#ff4500'
    }).then((result) => {
      if (result.value) {
        this.invitationService
          .acceptRequest(element.email)
          .subscribe(res => {
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
