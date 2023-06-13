import {Component, OnInit, ViewChild} from '@angular/core';
import {RouterEnum} from "../../../../enums/RouterEnum";
import {ActivatedRoute} from "@angular/router";
import {DocumentService} from "../../../../services/document.service";
import {TownCrierService} from "../../../../services/town-crier.service";
import {MatMenuTrigger} from '@angular/material/menu';
import {DocumentInfoModel} from "../../../../models/DocumentInfoModel";
import {DocumentDataModel} from "../../../../models/DocumentDataModel";


@Component({
  selector: 'app-layout-documents',
  templateUrl: './layout-documents.component.html',
  styleUrls: ['./layout-documents.component.css']
})
export class LayoutDocumentsComponent implements OnInit {
  uid!: string;
  documentId!: string;
  uploadedImageUrl!: string;
  firstTitle: string = '';
  photosCounter: number = 0;
  imageCount: number = 1;
  addedDocTitles: string[] = []
  addedDocIds: string[] = []
  addedDocsData: DocumentDataModel[] = []
  addedDocsInfo: DocumentInfoModel[] = []
  isHovered: boolean[] = [];
  filteredDocsData: Array<DocumentDataModel> = [];

  @ViewChild('showMenu') showMenuTrigger!: MatMenuTrigger;

  constructor(private route: ActivatedRoute, private documentService: DocumentService, public townCrier: TownCrierService) {
  }

  ngOnInit(): void {
    const routeParams = this.route.snapshot.paramMap;
    this.uid = localStorage.getItem("uid")!;
    this.documentId = routeParams.get(RouterEnum.DocumentId) as string;
    this.loadUploadedImageUrl(); // Call this function to load the uploaded image
    this.getAllDocIds();
  }

  loadUploadedImageUrl(): void {
    this.townCrier.info('Loading document...');
    this.uploadedImageUrl = this.documentId;
    this.photosCounter = 1;
  }

  getAllDocIds() {
    this.documentService.getAllDocumentInfosByUid(this.uid).subscribe({
      next: (documentInfoModels: DocumentInfoModel[]): void => {
        let privateDocuments: Array<DocumentInfoModel> = documentInfoModels;
        this.documentService.getAllSharedImageInfosByUid(this.uid).subscribe((docs: Array<DocumentInfoModel>): void => {
          let sharedDocuments: Array<DocumentInfoModel> = docs.filter((doc: DocumentInfoModel): boolean => doc.uid !== this.uid);
          this.documentService.getAllPublicDocumentInfos().subscribe((docs: Array<DocumentInfoModel>): void => {
            let publicDocuments: Array<DocumentInfoModel> = docs.filter((doc: DocumentInfoModel): boolean => doc.uid !== this.uid);
            let allDocuments: Array<DocumentInfoModel> = privateDocuments.concat(publicDocuments).concat(sharedDocuments);
            // building the lists without the opened image, so user cant open it twice
            allDocuments.forEach((docInfo: DocumentInfoModel): void => {
              this.documentService.getDocumentDatasByDocumentInfoId(docInfo.id!, this.uid).subscribe((docData: DocumentDataModel[]) => {
                if (docInfo.id == docData[0].infoId) {
                  if (this.documentId != docData[0].id) {
                    this.addedDocsData.push(docData[0]);
                    this.addedDocsInfo.push(docInfo);
                  } else {
                    this.firstTitle = docInfo.title!;
                  }
                }
                this.filteredDocsData = this.addedDocsData;
              });
            });
          });
        });
      }
    });
  }

  addImage(index: number, nextDoc: DocumentDataModel): void {
    if (this.photosCounter < 4) {
      this.townCrier.info('Loading document...');
      this.addedDocIds.push(nextDoc.id!);
      // Remove newly added image from search options
      this.filteredDocsData = this.filteredDocsData.filter((doc: DocumentDataModel): boolean => doc.infoId !== nextDoc.infoId);

      this.documentService.getAllDocumentInfosByUid(this.uid).subscribe((documentInfoModels: Array<DocumentInfoModel>): void => {
        let privateDocuments: Array<DocumentInfoModel> = documentInfoModels;
        this.documentService.getAllPublicDocumentInfos().subscribe((docs: Array<DocumentInfoModel>): void => {
          let publicDocuments: Array<DocumentInfoModel> = docs.filter((doc: DocumentInfoModel): boolean => doc.uid !== this.uid);
          let allDocuments: Array<DocumentInfoModel> = privateDocuments.concat(publicDocuments);
          allDocuments.forEach((docInfo: DocumentInfoModel): void => {
            if (docInfo.id == nextDoc.infoId) {
              // Add the title to the list of added document titles
              this.addedDocTitles.push(docInfo.title);
            }
          });
        });
      });

      this.photosCounter += 1;
      this.imageCount = Math.min(this.photosCounter, 4);
    } else {
      this.townCrier.info('Can not open more than 4 photos at once.');
    }
  }

  checkIdMatch(infoId: string): boolean {
    return this.addedDocsData.some((addedDoc: DocumentDataModel): boolean => addedDoc.infoId === infoId);
  }

  handleSearch(event: any): void {
    const searchTerm: string = event.target.value.toLowerCase().trim();

    this.filteredDocsData = this.addedDocsData.filter((docData: DocumentDataModel): boolean => {
      const docInfo: DocumentInfoModel | undefined = this.addedDocsInfo.find((info: DocumentInfoModel): boolean => info.id === docData.infoId);
      if (docInfo) {
        const title: string = docInfo.title.toLowerCase();
        const includes: boolean = title.includes(searchTerm);
        const starts: boolean = title.startsWith(searchTerm);
        return includes || starts;
      }
      return false;
    });
  }

  getFilteredDocTitles(): string[] {
    const filteredTitles: string[] = [];

    for (const docData of this.filteredDocsData) {
      const matchingInfo: DocumentInfoModel | undefined = this.addedDocsInfo.find(info => info.id === docData.infoId);
      if (matchingInfo) {
        filteredTitles.push(matchingInfo.title);
      }
    }

    return filteredTitles;
  }

  openSearch() {

  }
}
