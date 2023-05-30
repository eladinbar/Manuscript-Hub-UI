import {Component, ElementRef, Input, OnInit, ViewChild, Inject} from '@angular/core';
import {DocumentService} from "../../../services/document.service";
import {ActivatedRoute} from "@angular/router";
import {DomSanitizer} from "@angular/platform-browser";
import {AnnotationModel} from "../../../models/AnnotationModel";
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import {AnnotationDialogComponent} from "../../dialogs/annotation-dialog/annotation-dialog.component";
import {AnnotationCoordinatesModel} from "../../../models/AnnotationCoordinatesModel";
import {AnnotationService} from "../../../services/annotation.service";
import {HttpResponse} from "@angular/common/http";
import {DocumentInfoModel} from "../../../models/DocumentInfoModel";
import {DocumentInfoDialogComponent} from "../../dialogs/document-info-dialog/document-info-dialog.component";

@Component({
  selector: 'app-document-details',
  templateUrl: './document-details.component.html',
  styleUrls: ['./document-details.component.css']
})

export class DocumentDetailsComponent implements OnInit {
  NIL: string = "00000000-0000-0000-0000-000000000000";

  @Input() uid = '';
  @Input() documentId = '';
  @Input() title = '';

  coordinates: AnnotationCoordinatesModel[] = [];
  annotations: AnnotationModel[] = [];

  image = new Image();

  @ViewChild('canvas', {static: true}) canvas?: ElementRef;
  ctx?: CanvasRenderingContext2D;
  annIsHovered: boolean = false;
  infoIsHovered: boolean = false;

  constructor(private documentService: DocumentService, private annotationService: AnnotationService,
              private route: ActivatedRoute, private sanitizer: DomSanitizer, private dialog: MatDialog) {
  }

  ngOnInit(): void {
    // const routeParams = this.route.snapshot.paramMap;
    // this.uid = localStorage.getItem("uid")!;
    // this.documentId = routeParams.get(RouterEnum.DocumentId) as string;

    this.getAllAnnotations();

    this.getDocumentById();
  }

  getAllAnnotations() {
    this.annotationService.getAllAnnotationsByDocumentDataId(this.documentId, this.uid).subscribe({
      next: (annotationModels: AnnotationModel[]) => {
        this.annotations = annotationModels;
        this.drawAnnotations();
      },
    });
  }

  getDocumentById() {
    this.documentService.getDocumentDataById(this.documentId, this.uid!).subscribe(res => {
      const url = URL.createObjectURL(res);
      this.loadImage();
      this.image.src = url;
    });
  }

  loadImage() {
    this.image.onload = () => {
      const canvas = this.canvas?.nativeElement;
      this.ctx = canvas.getContext('2d');
      canvas!.width = this.image.width;
      canvas!.height = this.image.height;
      this.ctx?.drawImage(this.image, 0, 0, this.image.width, this.image.height, 0, 0, canvas!.width, canvas!.height);
      this.drawAnnotations();
      this.addEventListener();
    };
  }

  addEventListener() {
    const canvas = this.canvas?.nativeElement;

    let startX: number;
    let startY: number;
    let currentX: number;
    let currentY: number;
    let prevX: number;
    let prevY: number;

    let isDown: boolean = false;

    let selectedAnnotation: AnnotationModel | undefined = undefined;
    let oldStartX: number;
    let oldStartY: number;
    let oldEndX: number;
    let oldEndY: number;

    canvas.addEventListener('mousedown', (e: any) => {
      startX = e.offsetX;
      startY = e.offsetY;
      prevX = startX;
      prevY = startY;

      for (const annotation of this.annotations) {
        const width: number = annotation.endX - annotation.startX;
        const height: number = annotation.endY - annotation.startY;
        this.ctx?.beginPath();
        this.ctx?.rect(annotation.startX, annotation.startY, width, height);
        if (this.ctx?.isPointInPath(startX, startY)) {
          selectedAnnotation = annotation;
          oldStartX = annotation.startX;
          oldStartY = annotation.startY;
          oldEndX = annotation.endX;
          oldEndY = annotation.endY;
          return;
        }
      }

      isDown = true;
    });

    canvas.addEventListener('mousemove', (e: any) => {
      currentX = e.offsetX;
      currentY = e.offsetY;

      if (selectedAnnotation) {
        const dx = currentX - prevX;
        const dy = currentY - prevY;
        // Move the selected annotation
        selectedAnnotation.startX += dx;
        selectedAnnotation.endX += dx;
        selectedAnnotation.startY += dy;
        selectedAnnotation.endY += dy;

        prevX = currentX;
        prevY = currentY;

        // Redraw the canvas with the updated annotation positions
        this.drawAnnotations();
        return;
      }

      if (!isDown) {
        return;
      }

      const width = currentX - startX;
      const height = currentY - startY;

      // Redraw image to remove lingering boxes
      this.clearCanvas();
      this.redrawImage();
      this.ctx!.strokeStyle = 'red';
      this.ctx?.strokeRect(startX, startY, width, height);
    });

    canvas.addEventListener('mouseup', () => {
      if (selectedAnnotation) {
        this.selectAnnotation(selectedAnnotation, oldStartX, oldStartY, oldEndX, oldEndY);
        selectedAnnotation = undefined;
        return;
      }

      if (!isDown) {
        return;
      }

      isDown = false;
      const annotationCoordinates: AnnotationCoordinatesModel = {
        startX: startX,
        startY: startY,
        endX: currentX,
        endY: currentY,
      }

      let dialogRef: MatDialogRef<AnnotationDialogComponent, any> = this.openDialog();
      this.handleNewManualAnnotation(dialogRef, annotationCoordinates);
    });
  }

  handleNewManualAnnotation(dialogRef: MatDialogRef<AnnotationDialogComponent, any>, annotationCoordinates: AnnotationCoordinatesModel) {
    dialogRef.afterClosed().subscribe(content => {
      if (content) {
        this.addAnnotation(annotationCoordinates, content, this.NIL);
      } else {
        this.drawAnnotations();
      }
    });
  }

  openDialog(text: string = "") {
    return this.dialog.open(AnnotationDialogComponent, {
      width: '250px',
      maxHeight: '80vh',
      data: {text}
    });
  }

  addAnnotation(annotationCoordinates: AnnotationCoordinatesModel, content: string, algorithmId: string) {
    if (!this.coordinates.includes(annotationCoordinates)) {
      let annotation: AnnotationModel = {
        uid: this.uid,
        imageDataId: this.documentId,
        algorithmId: algorithmId,
        content: content,
        startX: annotationCoordinates.startX,
        startY: annotationCoordinates.startY,
        endX: annotationCoordinates.endX,
        endY: annotationCoordinates.endY
      };

      this.annotationService.addAnnotation(annotation).subscribe({
        next: (annotationModel: AnnotationModel) => {
          annotation = annotationModel;
          this.coordinates.push(annotationCoordinates);
          this.annotations.push(annotation);
          this.drawAnnotations();
        },
      });
    }
  }

  selectAnnotation(annotation: AnnotationModel, oldStartX: number, oldStartY: number, oldEndX: number, oldEndY: number) {
    this.ctx!.strokeStyle = 'blue';
    this.ctx?.strokeRect(annotation.startX, annotation.startY, annotation.endX - annotation.startX, annotation.endY - annotation.startY);

    let dialogRef = this.openDialog(annotation.content);
    dialogRef.afterClosed().subscribe(content => {
      if (content && content != annotation.content) {
        //TODO pass algorithmId?
        // OK
        this.updateAnnotation(annotation, content);
      } else if (content == 0) {
        // Delete
        this.deleteAnnotation(annotation);
      } else {
        // Cancel
        // Restore annotation original position
        annotation.startX = oldStartX;
        annotation.startY = oldStartY;
        annotation.endX = oldEndX;
        annotation.endY = oldEndY;
        this.drawAnnotations();
      }
    });
  }

  updateAnnotation(annotation: AnnotationModel, newContent: string) {
    annotation.content = newContent;
    this.annotationService.updateAnnotation(annotation).subscribe();
    this.drawAnnotations();
  }

  deleteAnnotation(annotation: AnnotationModel) {
    this.annotationService.deleteAnnotation(annotation.id!).subscribe({
      next: (res) => {
        if (res) {
          this.annotations = this.annotations.filter(a => a.id !== annotation.id);
          this.drawAnnotations();
        }
      },
    });
  }

  drawAnnotations() {
    // Redraw image to remove lingering boxes
    this.clearCanvas();
    this.redrawImage();

    for (let i = 0; i < this.annotations.length; i++) {
      const value = this.annotations[i].content;
      const coordinates: AnnotationCoordinatesModel = {
        startX: this.annotations[i].startX, startY: this.annotations[i].startY,
        endX: this.annotations[i].endX, endY: this.annotations[i].endY
      };
      const {startX, startY, endX, endY} = coordinates;
      const width = endX - startX;
      const height = endY - startY;
      if (this.ctx) {
        this.ctx.strokeStyle = 'red';
        this.ctx?.strokeRect(startX, startY, width, height);
        // Add text
        const text = value;
        const textX = startX + width / 2;
        const textY = startY + height / 2 + 3.5;
        this.ctx.font = 'bold 14px Arial';
        this.ctx.fillStyle = 'red';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(text, textX, textY);
      }
    }
  }

  clearCanvas() {
    const canvas = this.canvas?.nativeElement;
    this.ctx?.clearRect(0, 0, canvas!.width, canvas!.height);
  }

  redrawImage() {
    const canvas = this.canvas?.nativeElement;
    this.ctx?.drawImage(this.image, 0, 0, this.image.width, this.image.height, 0, 0, canvas!.width, canvas!.height);
  }

  selectAlgorithm(algorithm: string) {
    // Perform any desired actions based on the selected algorithm
    console.log(`Selected algorithm: ${algorithm}`);
  }

  openDocumentInfoDialog() {
    this.documentService.getAllDocumentInfosByUid(this.uid).subscribe(
      (documentInfoModels: DocumentInfoModel[]) => {
        documentInfoModels.forEach((docInfo) => {
            if (docInfo.title == this.title) {
              console.log("tags: " , docInfo.tags);
              const dialogRef = this.dialog.open(DocumentInfoDialogComponent, {
                width: '400px',
                data: {
                  title: docInfo.title,
                  description: docInfo.description,
                  author: docInfo.author,
                  privacy: docInfo.privacy,
                  publicationDate: docInfo.publicationDate,
                  tags: docInfo.tags
                }
              });

              dialogRef.afterClosed().subscribe(result => {
                console.log('The dialog was closed');
                // Perform any necessary actions after the dialog is closed
              });            }
          },
          (err: any) => {
            console.error('HTTP GET Annotation retrieval request error: ', err);
          }
        );})

  }

}
