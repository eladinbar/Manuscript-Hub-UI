import { Component, OnInit } from '@angular/core';
import {RouterEnum} from "../../../enums/RouterEnum";
import {ActivatedRoute} from "@angular/router";
import {DocumentService} from "../../../services/document.service";
import {AnnotationModel} from "../../../models/AnnotationModel";
import {DocumentInfoTableModel} from "../../../models/DocumentInfoTableModel";

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



  constructor(private route: ActivatedRoute, private docService: DocumentService) { }

  ngOnInit(): void {
    const routeParams = this.route.snapshot.paramMap;
    this.uid = localStorage.getItem("uid")!;
    this.documentId = routeParams.get(RouterEnum.DocumentId) as string;
    this.loadUploadedImageUrl(); // Call this function to load the uploaded image
    this.getAllDocIds();
  }

  // Add this method to load the uploaded image URL
  loadUploadedImageUrl(): void {
    // Retrieve the uploaded image URL from your data source and assign it to this.uploadedImageUrl
    // For demonstration purposes, we'll use the first image from the imagePool as the uploaded image
    this.uploadedImageUrl = this.documentId;

  }

  getAllDocIds() {
      this.docService.getAllDocumentsByUid(this.uid).subscribe({
        next: (documentTableModels: DocumentInfoTableModel[]) => {
          console.log('HTTP GET Annotation retrieval request successful: ', documentTableModels);
          documentTableModels.forEach((doc) => this.addedDocs.push(doc));
          documentTableModels.forEach((doc) => this.images.push(doc.fileName!));
          console.log('images: ', this.images);
        },
        error: (err: any) => {
          console.error('HTTP GET Annotation retrieval request error: ', err);
        },
      });
  }

  // Add this method to add the selected image to the grid layout
  addImage(index: number, nextDoc: DocumentInfoTableModel): void {
    this.addedDocIds.push(nextDoc.documentId!);
    // this.addedDocIds[index] = nextDoc;
  }
}
