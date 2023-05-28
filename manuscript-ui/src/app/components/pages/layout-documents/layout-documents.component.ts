import {Component, OnInit, ViewChild} from '@angular/core';
import {RouterEnum} from "../../../enums/RouterEnum";
import {ActivatedRoute} from "@angular/router";
import {DocumentService} from "../../../services/document.service";
import {TownCrierService} from "../../../services/town-crier.service";
import {MatMenuTrigger} from '@angular/material/menu';
import {DocumentInfoModel} from "../../../models/DocumentInfoModel";
import {DocumentDataModel} from "../../../models/DocumentDataModel";


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
  @ViewChild('showMenu') showMenuTrigger!: MatMenuTrigger;

  constructor(private route: ActivatedRoute, private docService: DocumentService, public townCrier: TownCrierService) { }

  ngOnInit(): void {
    const routeParams = this.route.snapshot.paramMap;
    this.uid = localStorage.getItem("uid")!;
    this.documentId = routeParams.get(RouterEnum.DocumentId) as string;
    this.getAllDocIds();
    this.loadUploadedImageUrl(); // Call this function to load the uploaded image
  }

  loadUploadedImageUrl(): void {
    this.townCrier.info('Loading document...');
    this.uploadedImageUrl = this.documentId;
    this.photosCounter = 1;
  }

  getAllDocIds() {
    this.docService.getAllDocumentInfosByUid(this.uid).subscribe({
      next: (documentInfoModels: DocumentInfoModel[]) => {
        console.log('HTTP GET Annotation retrieval request successful: ', documentInfoModels);
        // building the lists without the opened image, so user cant open it twice
        documentInfoModels.forEach((docInfo) => {
          this.docService.getDocumentDatasByDocumentInfoId(docInfo.id!, this.uid).subscribe((docData: DocumentDataModel[]) => {
            if (docInfo.id == docData[0].infoId) {
              if (this.documentId != docData[0].id) {
                this.addedDocsData.push(docData[0]);
                this.addedDocsInfo.push(docInfo);
              } else {
                this.firstTitle = docInfo.title!;
                console.log("else Title = ", docInfo.title);
              }
            }
          })
        });
      }, error: (err: any) => {
        console.error('HTTP GET Annotation retrieval request error: ', err);
      },
    });
  }

  addImage(index: number, nextDoc: DocumentDataModel): void {
    if (this.photosCounter < 4) {
      this.townCrier.info('Loading document...');
      this.addedDocIds.push(nextDoc.id!);
      this.docService.getAllDocumentInfosByUid(this.uid).subscribe(
        (documentInfoModels: DocumentInfoModel[]) => {
          documentInfoModels.forEach((docInfo) => {
              if (docInfo.id == nextDoc.infoId) {
                // Add the title to the list of added document titles
                this.addedDocTitles.push(docInfo.title);
              }
            },
            (err: any) => {
              console.error('HTTP GET Annotation retrieval request error: ', err);
            }
          );
        })
      this.photosCounter += 1;
      this.imageCount = Math.min(this.photosCounter, 4);
    } else {
      this.townCrier.info('Can not open more than 4 photos');
    }
  }

  public openSearch() {
  }

  handleSearch(event: Event) {
    const inputValue = (event.target as HTMLInputElement).value;
    // Handle the search input value
    console.log('Search Text:', inputValue);
  }
}
