import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {DocumentService} from "../../../services/document.service";
import {ActivatedRoute} from "@angular/router";
import {DomSanitizer} from "@angular/platform-browser";
import {AnnotationModel} from "../../../models/AnnotationModel";
import {RouterEnum} from "../../../enums/RouterEnum";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {DialogComponent} from "../../dialog/dialog.component";
import {AnnotationCoordinatesModel} from "../../../models/AnnotationCoordinatesModel";
import {AnnotationService} from "../../../services/annotation.service";

@Component({
  selector: 'app-document-details',
  templateUrl: './document-details.component.html',
  styleUrls: ['./document-details.component.css']
})

export class DocumentDetailsComponent implements OnInit {
  NIL: string = "00000000-0000-0000-0000-000000000000";

  uid!: string;
  documentId!: string;

  coordinates: AnnotationCoordinatesModel[] = [];
  value!: string;
  annotations: AnnotationModel[] = [];

  image = new Image();

  @ViewChild('canvas', {static: true}) canvas?: ElementRef;
  ctx?: CanvasRenderingContext2D;

  constructor(private documentService: DocumentService, private annotationService: AnnotationService,
              private route: ActivatedRoute, private sanitizer: DomSanitizer, private dialog: MatDialog) {}

  ngOnInit(): void {
    const routeParams = this.route.snapshot.paramMap;
    this.uid = localStorage.getItem("uid")!;
    this.documentId = routeParams.get(RouterEnum.DocumentId) as string;

    this.getAllAnnotations();

    this.getDocumentById();
  }

  getAllAnnotations() {
    this.annotationService.getAnnotationsByDocumentId(this.documentId, this.uid).subscribe({
      next: (annotationModels: AnnotationModel[]) => {
        console.log('HTTP GET Annotation retrieval request successful: ', annotationModels);
        this.annotations = annotationModels;
        this.drawAnnotations();
      },
      error: (err: any) => {
        console.error('HTTP GET Annotation retrieval request error: ', err);
      },
    });
  }

  getDocumentById() {
    this.documentService.getDocumentById(this.documentId).subscribe(res => {
      const url = URL.createObjectURL(res);
      this.loadImage();
      this.image.src = url;
    });
  }

  selectAnnotation(annotation: AnnotationModel, oldStartX: number, oldStartY: number, oldEndX: number, oldEndY: number) {
    console.log("onSelect: " + annotation.content);
    this.ctx!.strokeStyle = 'blue';
    this.ctx?.strokeRect(annotation.startX, annotation.startY, annotation.endX - annotation.startX, annotation.endY - annotation.startY);

    let dialogRef = this.openDialog(annotation.content);
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);

      this.value = result;
      if (result) {
        //TODO pass algorithmId?
        this.updateAnnotation(annotation, result);
      } else if(result == 0) {
        this.deleteAnnotation(annotation);
      } else {
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
    this.annotationService.updateAnnotation(annotation);
    this.drawAnnotations();
  }

  deleteAnnotation(annotation: AnnotationModel) {
    this.annotationService.deleteAnnotation(annotation.id!, annotation.imageId, annotation.uid).subscribe({
      next: () => {
        console.log('HTTP DELETE request successful: ', annotation);
        this.annotations = this.annotations.filter(a => a.id !== annotation.id);
        this.drawAnnotations();
      },
      error: (err: any) => {
        console.error('HTTP DELETE request error: ', err);
      },
    });
  }

  loadImage() {
    this.image.onload = () => {
      const canvas = this.canvas?.nativeElement;
      this.ctx = canvas.getContext('2d');
      canvas!.width = this.image.width;
      canvas!.height = this.image.height;
      this.ctx?.drawImage(this.image, 0, 0, this.image.width, this.image.height, 0, 0, canvas!.width, canvas!.height);
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
      const width = currentX - startX;
      const height = currentY - startY;

      if(selectedAnnotation) {
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

      // Redraw image to remove lingering boxes
      this.redrawImage();
      this.ctx!.strokeStyle = 'red';
      this.ctx?.strokeRect(startX, startY, width, height);
    });

    canvas.addEventListener('mouseup', () => {
      if(selectedAnnotation) {
        this.selectAnnotation(selectedAnnotation, oldStartX, oldStartY, oldEndX, oldEndY);
        selectedAnnotation = undefined;
        return;
      }

      if(!isDown) {
        return;
      }

      isDown = false;
      const annotationCoordinates: AnnotationCoordinatesModel = {
        startX: startX,
        startY: startY,
        endX: currentX,
        endY: currentY,
      }

      let dialogRef: MatDialogRef<DialogComponent, any> = this.openDialog();
      this.handleNewAnnotation(dialogRef, annotationCoordinates);
    });
  }

  handleNewAnnotation(dialogRef: MatDialogRef<DialogComponent, any>, annotationCoordinates: AnnotationCoordinatesModel) {
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);

      this.value = result;
      if (result) {
        this.addAnnotation(annotationCoordinates, this.NIL);
      } else {
        this.drawAnnotations();
      }

    });
  }

  addAnnotation(annotationCoordinates: AnnotationCoordinatesModel, algorithmId: string) {
    if (!this.coordinates.includes(annotationCoordinates)) {
      let annotation: AnnotationModel = {
        uid: this.uid,
        imageId: this.documentId,
        algorithmId: algorithmId,
        content: this.value,
        startX: annotationCoordinates.startX,
        startY: annotationCoordinates.startY,
        endX: annotationCoordinates.endX,
        endY: annotationCoordinates.endY
      };

      this.annotationService.addAnnotation(annotation).subscribe({
        next: (annotationModel: AnnotationModel) => {
          console.log('HTTP POST request successful: ', annotationModel);
          annotation = annotationModel;
          this.coordinates.push(annotationCoordinates);
          this.annotations.push(annotation);
          this.drawAnnotations();
        },
        error: (err: any) => {
          console.error('HTTP POST request error: ', err);
        },
      });
    }

  }

  drawAnnotations() {
    // Redraw image to remove lingering boxes
    this.redrawImage();

    for (let i = 0; i < this.annotations.length; i++) {
      const value = this.annotations[i].content;
      const annotation: AnnotationCoordinatesModel = { startX: this.annotations[i].startX,  startY: this.annotations[i].startY, endX: this.annotations[i].endX, endY: this.annotations[i].endY };
      const {startX, startY, endX, endY} = annotation;
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

  openDialog(text: string = "") {
    return this.dialog.open(DialogComponent, {
      width: '250px',
      data: {text}
    });
  }

  redrawImage() {
    const canvas = this.canvas?.nativeElement;
    this.ctx?.drawImage(this.image, 0, 0, this.image.width, this.image.height, 0, 0, canvas!.width, canvas!.height);
  }
}
