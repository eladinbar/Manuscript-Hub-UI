import {Component, OnInit, ViewChild} from '@angular/core';
import {RouterEnum} from "../../../enums/RouterEnum";
import {ActivatedRoute} from "@angular/router";
import {DocumentService} from "../../../services/document.service";
import {DocumentInfoModel} from "../../../models/DocumentInfoModel";
import {TownCrierService} from "../../../services/town-crier.service";
import { MatMenuTrigger } from '@angular/material/menu';


@Component({
  selector: 'app-layout-documents',
  templateUrl: './layout-documents.component.html',
  styleUrls: ['./layout-documents.component.css']
})
export class LayoutDocumentsComponent implements OnInit {

  uid!: string;
  documentId!: string;
  uploadedImageUrl!: string;
  addedDocIds: string[] = []
  firstTitle: string = '';
  addedDocs: DocumentInfoModel[] = []
  photosCounter: number = 0;
  imageCount: number = 1;
  documentTitles: string[] = [];
  curTitle: string | undefined = '';
  addedDocTitles: string[] = []
  // Access the MatMenuTrigger using ViewChild




  constructor(private route: ActivatedRoute, private docService: DocumentService, public townCrier: TownCrierService) { }

  ngOnInit(): void {
    const routeParams = this.route.snapshot.paramMap;
    this.uid = localStorage.getItem("uid")!;
    this.documentId = routeParams.get(RouterEnum.DocumentId) as string;
    this.loadUploadedImageUrl(); // Call this function to load the uploaded image
    this.getAllDocIds();
  }

  @ViewChild('showMenu') showMenuTrigger!: MatMenuTrigger;




  loadUploadedImageUrl(): void {
    this.townCrier.info('Loading image...');
    this.uploadedImageUrl = this.documentId;
    this.photosCounter = 1;
  }

  getAllDocIds() {
      this.docService.getAllDocumentInfosByUid(this.uid).subscribe({
        next: (documentTableModels: DocumentInfoModel[]) => {
          console.log('HTTP GET Annotation retrieval request successful: ', documentTableModels);
          // building the lists without the opened image, so user cant open it twice
          documentTableModels.forEach((doc) => {if (this.documentId != doc.id) this.addedDocs.push(doc);else {this.firstTitle = doc.title!}});
        },
        error: (err: any) => {
          console.error('HTTP GET Annotation retrieval request error: ', err);
        },
      });
  }

  addImage(index: number, nextDoc: DocumentInfoModel): void {
    if (this.photosCounter < 4) {
      this.townCrier.info('Loading image...');
      this.addedDocIds.push(nextDoc.id!);
      // Update the title for this document only
      this.curTitle = nextDoc.title!;
      // Add the title to the list of added document titles
      this.addedDocTitles.push(this.curTitle);
      this.photosCounter += 1;
      this.imageCount = Math.min(this.photosCounter, 4);
      this.showMenuTrigger.closeMenu();
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
