import { Component, OnInit } from '@angular/core';
import {RouterEnum} from "../../../enums/RouterEnum";
import {ActivatedRoute} from "@angular/router";
import {DocumentService} from "../../../services/document.service";
import {AnnotationModel} from "../../../models/AnnotationModel";
import {DocumentInfoTableModel} from "../../../models/DocumentInfoTableModel";
import {TownCrierService} from "../../../services/town-crier.service";

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
  showMenu: boolean = false;
  images: string[] = []
  addedDocs: DocumentInfoTableModel[] = []
  photosCounter: number = 0;
  imageCount: number = 1;




  constructor(private route: ActivatedRoute, private docService: DocumentService, public townCrier: TownCrierService) { }

  ngOnInit(): void {
    const routeParams = this.route.snapshot.paramMap;
    this.uid = localStorage.getItem("uid")!;
    this.documentId = routeParams.get(RouterEnum.DocumentId) as string;
    this.loadUploadedImageUrl(); // Call this function to load the uploaded image
    this.getAllDocIds();
  }

  loadUploadedImageUrl(): void {
    this.townCrier.info('Loading image...');
    this.uploadedImageUrl = this.documentId;
    this.photosCounter = 1;
  }

  getAllDocIds() {
      this.docService.getAllDocumentsByUid(this.uid).subscribe({
        next: (documentTableModels: DocumentInfoTableModel[]) => {
          console.log('HTTP GET Annotation retrieval request successful: ', documentTableModels);
          // building the lists without the opened image, so user cant open it twice
          documentTableModels.forEach((doc) => {if (this.documentId != doc.documentId) this.addedDocs.push(doc)});
          documentTableModels.forEach((doc) => {if (this.documentId != doc.fileName) this.images.push(doc.fileName!)});
          console.log('images: ', this.images);
        },
        error: (err: any) => {
          console.error('HTTP GET Annotation retrieval request error: ', err);
        },
      });
  }

  addImage(index: number, nextDoc: DocumentInfoTableModel): void {
    if (this.photosCounter < 4) {
      this.townCrier.info('Loading image...');
      this.addedDocIds.push(nextDoc.documentId!);
      this.photosCounter += 1;
      this.imageCount = Math.min(this.photosCounter, 4);
    } else {
      this.townCrier.info('Can not open more than 4 photos');
    }
  }

}
