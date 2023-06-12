import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {DocumentService} from "../../services/document.service";
import {ActivatedRoute} from "@angular/router";
import {DomSanitizer} from "@angular/platform-browser";
import {AnnotationModel} from "../../models/AnnotationModel";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {AnnotationDialogComponent} from "../dialogs/annotation-dialog/annotation-dialog.component";
import {AnnotationCoordinatesModel} from "../../models/AnnotationCoordinatesModel";
import {AnnotationService} from "../../services/annotation.service";
import {DocumentInfoModel} from "../../models/DocumentInfoModel";
import {DocumentInfoDialogComponent} from "../dialogs/document-info-dialog/document-info-dialog.component";
import {Observable} from "rxjs";
import {AlgorithmModel} from "../../models/AlgorithmModel";
import {AlgorithmService} from "../../services/algorithm.service";

@Component({
  selector: 'app-document-details',
  templateUrl: './document-details.component.html',
  styleUrls: ['./document-details.component.css']
})

export class DocumentDetailsComponent implements OnInit {
  NIL: string = "00000000-0000-0000-0000-000000000000";
  algorithms: Array<AlgorithmModel> = [];

  @Input() uid: string = '';
  @Input() documentId: string = '';
  @Input() title: string = '';

  coordinates: AnnotationCoordinatesModel[] = [];
  annotations: AnnotationModel[] = [];

  image = new Image();

  @ViewChild('canvas', {static: true}) canvas?: ElementRef;
  ctx?: CanvasRenderingContext2D;
  annIsHovered: boolean = false;
  infoIsHovered: boolean = false;

  constructor(private documentService: DocumentService, private annotationService: AnnotationService, private algorithmService: AlgorithmService,
              private route: ActivatedRoute, private sanitizer: DomSanitizer, private dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.getAllAnnotations();

    this.getAllAlgorithms();

    this.getDocumentById();
  }

  getAllAnnotations(): void {
    this.annotationService.getAllAnnotationsByDocumentDataId(this.documentId, this.uid).subscribe({
      next: (annotationModels: AnnotationModel[]) => {
        this.annotations = annotationModels;
        this.drawAnnotations();
      },
    });
  }

  getAllAlgorithms(): void {
    this.algorithmService.getAllRunnableAlgorithms(this.uid).subscribe({
      next: (algorithmModels: AlgorithmModel[]) => {
        this.algorithms = algorithmModels;
      }
    });
  }

  getDocumentById(): void {
    this.documentService.getDocumentDataById(this.documentId, this.uid!).subscribe(res => {
      const url: string = URL.createObjectURL(res);
      this.loadImage();
      this.image.src = url;
    });
  }

  loadImage(): void {
    this.image.onload = (): void => {
      const canvas = this.canvas?.nativeElement;
      this.ctx = canvas.getContext('2d');
      canvas!.width = this.image.width;
      canvas!.height = this.image.height;
      this.ctx?.drawImage(this.image, 0, 0, this.image.width, this.image.height, 0, 0, canvas!.width, canvas!.height);
      this.drawAnnotations();
      this.addEventListener();
    };
  }

  addEventListener(): void {
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

    canvas.addEventListener('mousedown', (e: any): void => {
      if (e.button !== 0) {
        return;
      }

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

    canvas.addEventListener('mousemove', (e: any): void => {
      currentX = e.offsetX;
      currentY = e.offsetY;

      if (selectedAnnotation) {
        const dx: number = currentX - prevX;
        const dy: number = currentY - prevY;
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

      const width: number = currentX - startX;
      const height: number = currentY - startY;

      // Redraw image to remove lingering boxes
      this.clearCanvas();
      this.redrawImage();
      this.ctx!.strokeStyle = 'red';
      this.ctx?.strokeRect(startX, startY, width, height);
    });

    canvas.addEventListener('mouseup', (): void => {
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

  openDialog(text: string = ""): MatDialogRef<AnnotationDialogComponent> {
    return this.dialog.open(AnnotationDialogComponent, {
      width: '250px',
      maxHeight: '80vh',
      data: {text}
    });
  }

  addAnnotation(annotationCoordinates: AnnotationCoordinatesModel, content: string, algorithmId: string): void {
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

      this.algorithmService.addManualAnnotation(annotation).subscribe({
        next: (annotationModel: AnnotationModel): void => {
          annotation = annotationModel;
          this.coordinates.push(annotationCoordinates);
          this.annotations.push(annotation);
          this.drawAnnotations();
        },
      });
    }
  }

  selectAnnotation(annotation: AnnotationModel, oldStartX: number, oldStartY: number, oldEndX: number, oldEndY: number): void {
    this.ctx!.strokeStyle = 'blue';
    this.ctx?.strokeRect(annotation.startX, annotation.startY, annotation.endX - annotation.startX, annotation.endY - annotation.startY);

    let dialogRef: MatDialogRef<AnnotationDialogComponent> = this.openDialog(annotation.content);
    dialogRef.afterClosed().subscribe(content => {
      if (content) {
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

  updateAnnotation(annotation: AnnotationModel, newContent: string): void {
    annotation.content = newContent;
    this.algorithmService.updateAnnotation(annotation).subscribe();
    this.drawAnnotations();
  }

  deleteAnnotation(annotation: AnnotationModel): void {
    this.algorithmService.deleteAnnotation(annotation.id!).subscribe({
      next: (res: boolean | Observable<boolean>): void => {
        if (res) {
          this.annotations = this.annotations.filter((a: AnnotationModel): boolean => a.id !== annotation.id);
          this.drawAnnotations();
        }
      },
    });
  }

  drawAnnotations(): void {
    // Redraw image to remove lingering boxes
    this.clearCanvas();
    this.redrawImage();

    for (let i = 0; i < this.annotations.length; i++) {
      const value: string = this.annotations[i].content;
      const coordinates: AnnotationCoordinatesModel = {
        startX: this.annotations[i].startX, startY: this.annotations[i].startY,
        endX: this.annotations[i].endX, endY: this.annotations[i].endY
      };
      const {startX, startY, endX, endY} = coordinates;
      const width: number = endX - startX;
      const height: number = endY - startY;
      if (this.ctx) {
        this.ctx.strokeStyle = 'red';
        this.ctx?.strokeRect(startX, startY, width, height);
        // Add text
        const text: string = value;
        const textX: number = startX + width / 2;
        // Modify according to font size (calibrated to 14px)
        let textY: number = startY + height / 2 + 3.5;
        this.ctx.font = 'bold 14px Arial';
        this.ctx.fillStyle = 'red';
        this.ctx.textAlign = 'center';

        // Modify according to font size (calibrated to 14px)
        let wrappedText = this.wrapText(this.ctx, text, textX, textY, Math.abs(width), 20);
        // If text has multiple lines, start filling text from top of box rather than center and recalculate wrapped text
        if (wrappedText.length > 1) {
          // Modify according to font size (calibrated to 14px)
          textY = Math.min(startY, endY) + 14;
        }
        // Modify according to font size (calibrated to 14px)
        wrappedText = this.wrapText(this.ctx, text, textX, textY, Math.abs(width), 20);
        wrappedText.forEach((item) => {
          // @ts-ignore
          this.ctx!.fillText(item[0], item[1], item[2]);
        });
      }
    }
  }

  // @description: wrapText wraps HTML canvas text onto a canvas of fixed width
  // @param ctx - the context for the canvas we want to wrap text on
  // @param text - the text we want to wrap.
  // @param x - the X starting point of the text on the canvas.
  // @param y - the Y starting point of the text on the canvas.
  // @param maxWidth - the width at which we want line breaks to begin - i.e. the maximum width of the canvas.
  // @param lineHeight - the height of each line, so we can space them below each other.
  // @returns an array of [ lineText, x, y ] for all lines
  wrapText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) {
    // First, start by splitting all of our text into words, but splitting it into an array split by spaces
    let words: string[] = text.split(' ');
    let line: string = ''; // This will store the text of the current line
    let testLine: string = ''; // This will store the text when we add a word, to test if it's too long
    let lineArray = []; // This is an array of lines, which the function will return

    // Let's iterate over each word
    for (let n = 0; n < words.length; n++) {
      // Create a test line, and measure it..
      testLine += `${words[n]} `;
      let metrics: TextMetrics = ctx.measureText(testLine);
      let testWidth: number = metrics.width;
      // If the width of this test line is more than the max width
      if (testWidth > maxWidth && n > 0) {
        // Then the line is finished, push the current line into "lineArray"
        lineArray.push([line, x, y]);
        // Increase the line height, so a new line is started
        y += lineHeight;
        // Update line and test line to use this word as the first word on the next line
        line = `${words[n]} `;
        testLine = `${words[n]} `;
      } else {
        // If the test line is still less than the max width, then add the word to the current line
        line += `${words[n]} `;
      }
      // If we never reach the full max width, then there is only one line... so push it into the lineArray, so we return something
      if (n === words.length - 1) {
        lineArray.push([line, x, y]);
      }
    }
    // Return the line array
    return lineArray;
  }

  clearCanvas(): void {
    const canvas = this.canvas?.nativeElement;
    this.ctx?.clearRect(0, 0, canvas!.width, canvas!.height);
  }

  redrawImage(): void {
    const canvas = this.canvas?.nativeElement;
    this.ctx?.drawImage(this.image, 0, 0, this.image.width, this.image.height, 0, 0, canvas!.width, canvas!.height);
  }

  selectAlgorithm(algorithm: AlgorithmModel): void {
    algorithm.imageDataId = this.documentId;
    this.algorithmService.runAlgorithm(algorithm).subscribe();
  }

  openDocumentInfoDialog(): void {
    this.documentService.getAllDocumentInfosByUid(this.uid).subscribe(
      (documentInfoModels: DocumentInfoModel[]): void => {
        documentInfoModels.forEach((docInfo: DocumentInfoModel): void => {
            if (docInfo.title == this.title) {
              console.log("tags: ", docInfo.tags);
              const dialogRef: MatDialogRef<DocumentInfoDialogComponent> = this.dialog.open(DocumentInfoDialogComponent, {
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
                // Perform any necessary actions after the dialog is closed
              });
            }
          }
        );
      });
  }
}
