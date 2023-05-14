import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {Router} from "@angular/router";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort, Sort} from "@angular/material/sort";
import {MatTableDataSource} from "@angular/material/table";
import {DocumentTableEnum} from "../../../enums/DocumentTableEnum";
import {DocumentDataModel} from "../../../models/DocumentDataModel";
import {DocumentService} from "../../../services/document.service";
import {SocketService} from "../../../services/socket.service";
import {TextService} from "../../../services/text.service";
import {DateService} from "../../../services/date.service";
import {RouterEnum} from "../../../enums/RouterEnum";
import {PrivacyEnum} from "../../../enums/PrivacyEnum";
import {DocumentInfoModel} from "../../../models/DocumentInfoModel";
import {MatDialog} from "@angular/material/dialog";
import {PrivacyDialogComponent} from "../../dialogs/privacy-dialog/privacy-dialog.component";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  documentInfoTableModels: Array<DocumentInfoModel> = [];
  displayedColumns: string[] = [DocumentTableEnum.Privacy, DocumentTableEnum.CreatedTime, DocumentTableEnum.Title, DocumentTableEnum.Actions];
  dataSource: MatTableDataSource<DocumentInfoModel> = new MatTableDataSource<DocumentInfoModel>([]);
  public formGroup: FormGroup;
  time: string = "Created Time";
  sort?: MatSort;
  uid?: string;
  @ViewChild('paginator') paginator?: MatPaginator;

  constructor(public textService: TextService, public dateService: DateService,
              public router: Router, private formBuilder: FormBuilder, private dialog: MatDialog,
              private socketService: SocketService, private documentService: DocumentService) {
    this.formGroup = this.formBuilder.group({
      selectedFile: null,
      uploadFile: null
    });
  }

  ngOnInit(): void {
    this.uid = localStorage.getItem("uid")!;
    this.documentService.getAllDocumentInfosByUid(this.uid!).subscribe(res => {
      this.setDataToTable(res);
      this.announceSortChange({active: this.time, direction: 'asc'})
    });
  }

  @ViewChild(MatSort) set x(mat: MatSort) {
    this.sort = mat;
  }

  private setDataToTable(res: any) {
    if (res) {
      this.documentInfoTableModels = res;
    }
    this.dataSource = new MatTableDataSource(this.documentInfoTableModels);
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
    this.announceSortChange({active: this.time, direction: 'asc'});
  }

  announceSortChange(sortState: Sort) {
    if (sortState.active === this.time) {
      this.sortByTime(sortState);
    } else {
      this.sortByPrivacy(sortState);
    }
  }

  private sortByTime(sortState: Sort) {
    let big = 1;
    let small = -1;
    if (sortState.direction === 'asc') {
      big = -1;
      small = 1;
    }
    this.dataSource.data = this.dataSource.data.sort((a, b) => {
      if (a.createdTime && b.createdTime) {
        if (a.createdTime > b.createdTime) {
          return big;
        } else {
          return small;
        }
      }
      return big;
    })
  }

  private sortByPrivacy(sortState: Sort) {
    let big = 1;
    let small = -1;
    if (sortState.direction === 'asc') {
      big = -1;
      small = 1;
    }
    this.dataSource.data = this.dataSource.data.sort((a, b) => {
      if (a.privacy && !b.privacy) {
        return big;
      } else if (a.privacy === b.privacy) {
        if (a.privacy == 'Private') {
          return -1;
        }
        return 1;
      }
      return small;
    });
  }

  onDocumentOpen(documentInfo: DocumentInfoModel) {
    if (documentInfo == null || documentInfo.id == undefined) return;
    this.documentService.getDocumentDatasByDocumentInfoId(documentInfo.id, this.uid!).subscribe((documents: DocumentDataModel[]) => {
      console.log(documents[0]);
      this.router.navigate(['/' + RouterEnum.DocumentDetail, documents[0].id]);
    });
  }

  onDocumentDelete(documentInfo: DocumentInfoModel) {
    this.documentService.deleteDocumentDataById(documentInfo.id!, this.uid!).subscribe();
  }

  onDocumentChangePrivacy(documentInfo: DocumentInfoModel) {
    const dialogRef = this.dialog.open(PrivacyDialogComponent, {
      data: { currentPrivacy: documentInfo.privacy },
      width: '350px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && Object.values(PrivacyEnum).includes(result)) {
        documentInfo.privacy = result;
        this.documentService.updateDocumentMetadata(documentInfo);
      }
    });
  }

  uploadFileService() {
    this.router.navigate(['/' + RouterEnum.DocumentUpload]);
  }
}
