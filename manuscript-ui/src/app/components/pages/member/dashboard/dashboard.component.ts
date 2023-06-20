import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {Router} from "@angular/router";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort, Sort} from "@angular/material/sort";
import {MatTableDataSource} from "@angular/material/table";
import {DocumentTableEnum} from "../../../../enums/DocumentTableEnum";
import {DocumentDataModel} from "../../../../models/DocumentDataModel";
import {DocumentService} from "../../../../services/document.service";
import {TextService} from "../../../../services/text.service";
import {DateService} from "../../../../services/date.service";
import {RouterEnum} from "../../../../enums/RouterEnum";
import {PrivacyEnum} from "../../../../enums/PrivacyEnum";
import {DocumentInfoModel} from "../../../../models/DocumentInfoModel";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {PrivacyDialogComponent} from "../../../dialogs/privacy-dialog/privacy-dialog.component";
import {ConfirmationDialogComponent} from "../../../dialogs/confirmation-dialog/confirmation-dialog.component";
import {DocumentInfoDialogComponent} from "../../../dialogs/document-info-dialog/document-info-dialog.component";
import {ShareDocumentDialogComponent} from "../../../dialogs/share-document-dialog/share-document-dialog.component";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  documentInfoTableModels: Array<DocumentInfoModel> = [];
  title: string = 'Title';
  displayedColumns: string[] = [DocumentTableEnum.Privacy, DocumentTableEnum.CreatedTime, DocumentTableEnum.UpdatedTime, this.title, DocumentTableEnum.Actions];
  dataSource: MatTableDataSource<DocumentInfoModel> = new MatTableDataSource<DocumentInfoModel>([]);
  public formGroup: FormGroup;
  time: string = "Created Time";

  sort?: MatSort;
  uid?: string;
  @ViewChild('paginator') paginator?: MatPaginator;

  constructor(public textService: TextService, public dateService: DateService,
              public router: Router, private formBuilder: FormBuilder, private dialog: MatDialog,
              private documentService: DocumentService) {
    this.formGroup = this.formBuilder.group({
      selectedFile: null,
      uploadFile: null
    });
  }

  @ViewChild(MatSort) set x(mat: MatSort) {
    this.sort = mat;
  }

  ngOnInit(): void {
    this.uid = localStorage.getItem("uid")!;
    this.fetchTableData();
  }

  fetchTableData(): void {
    this.documentService.getAllDocumentInfosByUid(this.uid!).subscribe((docs: Array<DocumentInfoModel>) => {
      let privateDocuments: Array<DocumentInfoModel> = docs.map(doc => {
        doc.createdTime = new Date(doc.createdTime!);
        doc.updatedTime = new Date(doc.updatedTime!);
        doc.publicationDate = doc.publicationDate ? new Date(doc.publicationDate) : undefined;
        return doc;
      });

      this.documentService.getAllSharedImageInfosByUid(this.uid!).subscribe((docs: Array<DocumentInfoModel>) => {
        let sharedDocuments: Array<DocumentInfoModel> = docs.filter(doc => doc.uid !== this.uid);

        sharedDocuments.forEach(doc => {
          doc.createdTime = new Date(doc.createdTime!);
          doc.updatedTime = new Date(doc.updatedTime!);
          doc.publicationDate = doc.publicationDate ? new Date(doc.publicationDate) : undefined;
        });

        this.documentService.getAllPublicDocumentInfos().subscribe((docs: Array<DocumentInfoModel>) => {
          let publicDocuments: Array<DocumentInfoModel> = docs.filter(doc => doc.uid !== this.uid);

          publicDocuments.forEach(doc => {
            doc.createdTime = new Date(doc.createdTime!);
            doc.updatedTime = new Date(doc.updatedTime!);
            doc.publicationDate = doc.publicationDate ? new Date(doc.publicationDate) : undefined;
          });

          this.setDataToTable(privateDocuments.concat(publicDocuments).concat(sharedDocuments));
        });
      });
    });
  }

  private setDataToTable(documentInfoModels: Array<DocumentInfoModel>): void {
    if (documentInfoModels) {
      this.documentInfoTableModels = documentInfoModels;
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
    } else if (sortState.active === this.title) { // Handle sorting for the Title column
      this.sortByTitle(sortState);
    } else {
      this.sortByPrivacy(sortState);
    }
  }

  onDocumentOpen(documentInfo: DocumentInfoModel) {
    if (documentInfo == null || documentInfo.id == undefined) return;
    this.documentService.getDocumentDatasByDocumentInfoId(documentInfo.id, this.uid!).subscribe((documents: DocumentDataModel[]) => {
      this.router.navigate(['/' + RouterEnum.DocumentDetail, documents[0].id]);
    });
  }

  onDocumentDelete(documentInfo: DocumentInfoModel) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: { title: "Delete Confirmation", message: "Are you sure you want to delete this document?"},
      width: "350px",
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.deleteDocument(documentInfo);
      }
    });
  }

  private deleteDocument(documentInfo: DocumentInfoModel) {
    this.documentService.deleteDocumentInfoById(documentInfo.id!, this.uid!).subscribe({
        next: (res) => {
          if (res) {
            this.documentInfoTableModels = this.documentInfoTableModels.filter(doc => doc.id !== documentInfo.id);
            this.dataSource.data = this.documentInfoTableModels; // Update the data source
          }
        }
      });
  }

  onDocumentChangePrivacy(documentInfo: DocumentInfoModel) {
    const dialogRef: MatDialogRef<PrivacyDialogComponent> = this.dialog.open(PrivacyDialogComponent, {
      data: {currentPrivacy: documentInfo.privacy},
      width: '350px',
    });

    let updatedDocumentInfo: DocumentInfoModel = new DocumentInfoModel(documentInfo);
    updatedDocumentInfo.uid = this.uid!;

    dialogRef.afterClosed().subscribe((newPrivacy: PrivacyEnum): void => {
      if (newPrivacy && Object.values(PrivacyEnum).includes(newPrivacy)) {
        if (newPrivacy === PrivacyEnum.Shared) {
          this.shareDocument(documentInfo, updatedDocumentInfo);
        } else {
          this.updateDocumentPrivacy(documentInfo, updatedDocumentInfo, newPrivacy);
        }
      }
    });
  }

  shareDocument(documentInfo: DocumentInfoModel, updatedDocumentInfo: DocumentInfoModel) {
    let sharedEmails: Array<string> = [];
    this.documentService.getSharedEmailsByDocumentInfoId(documentInfo.id!, this.uid!).subscribe((emails: Array<string>) => {
      sharedEmails = emails;

      const shareDialogRef: MatDialogRef<ShareDocumentDialogComponent> = this.dialog.open(ShareDocumentDialogComponent, {
        width: '500px',
        data: sharedEmails
      });

      const sharedUserEmails: Array<string> = [];

      shareDialogRef.afterClosed().subscribe((emailsToShare: string[]): void => {
        if (emailsToShare) {
          updatedDocumentInfo.privacy = PrivacyEnum.Shared;
          for (let email of emailsToShare)
            sharedUserEmails.push(email);
          this.documentService.shareDocument(updatedDocumentInfo, sharedUserEmails).subscribe((updatedDocumentInfo: DocumentInfoModel): void => {
            if (updatedDocumentInfo.privacy)
              documentInfo.privacy = updatedDocumentInfo.privacy;
          });
        }
      });
    });
  }

  updateDocumentPrivacy(documentInfo: DocumentInfoModel, updatedDocumentInfo: DocumentInfoModel, newPrivacy: PrivacyEnum): void {
    updatedDocumentInfo.privacy = newPrivacy;
    this.documentService.updateDocumentInfo(updatedDocumentInfo).subscribe((updatedDocumentInfo: DocumentInfoModel): void => {
      if (updatedDocumentInfo.privacy)
        documentInfo.privacy = updatedDocumentInfo.privacy;
    });
  }

  uploadFileService() {
    this.router.navigate(['/' + RouterEnum.DocumentUpload]);
  }

  openDocumentInfoDialog(documentInfo: DocumentInfoModel) {
    const dialogRef = this.dialog.open(DocumentInfoDialogComponent, {
      width: '350px',
      data: {
        title: documentInfo.title,
        description: documentInfo.description,
        author: documentInfo.author,
        privacy: documentInfo.privacy,
        publicationDate: documentInfo.publicationDate,
        tags: documentInfo.tags
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
    });
  }

  applyFilter(event: any) {
    const searchTerm = event.target.value.toLowerCase().trim();

    // Show only the rows that match the filter criteria
    this.dataSource.filterPredicate = (data: DocumentInfoModel, filter: string) => {
      const title: string = data.title.toLowerCase();
      const author: string = data.author ? data.author.toLowerCase() : "";
      const description: string = data.description ? data.description.toLowerCase() : "";
      const tags: string = data.tags ? data.tags.join(',').toLowerCase() : ""; // Convert tags array to a string
      const privacy: string = data.privacy ? data.privacy.toLowerCase() : "";
      const publicationDate: string = data.publicationDate ? data.publicationDate.toISOString().toLowerCase() : ""; // Convert Date to string representation

      // Check if any of the fields include or start with the search term
      return (
        title.includes(searchTerm) || title.startsWith(searchTerm) ||
        author.includes(searchTerm) || author.startsWith(searchTerm) ||
        description.includes(searchTerm) || description.startsWith(searchTerm) ||
        tags.includes(searchTerm) || tags.startsWith(searchTerm) ||
        privacy.includes(searchTerm) || privacy.startsWith(searchTerm) ||
        publicationDate.includes(searchTerm) || publicationDate.startsWith(searchTerm)
      );
    }

    // Filter the data source based on the search term
    this.dataSource.filter = searchTerm;
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
    const sortDirection = sortState.direction === 'asc' ? 1 : -1;

    const privacyOrder = ['Public', 'Shared', 'Private'];

    this.dataSource.data = this.dataSource.data.sort((a, b) => {
      const aIndex = privacyOrder.indexOf(a.privacy!);
      const bIndex = privacyOrder.indexOf(b.privacy!);

      return (aIndex - bIndex) * sortDirection;
    });
  }

  sortByTitle(sortState: Sort) {
    const sortDirection = sortState.direction === 'asc' ? 1 : -1;

    this.dataSource.data = this.dataSource.data.sort((a, b) => {
      const titleA = a.title.toLowerCase();
      const titleB = b.title.toLowerCase();

      if (titleA < titleB) {
        return -1 * sortDirection;
      } else if (titleA > titleB) {
        return 1 * sortDirection;
      } else {
        return 0;
      }
    });
  }
}
