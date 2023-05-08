import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
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

export class DocumentDetailsComponent implements OnInit, AfterViewInit {
  NIL: string = "00000000-0000-0000-0000-000000000000";

  uid!: string;
  documentId!: string;

  coordinates: AnnotationCoordinatesModel[] = [];
  annotations: AnnotationModel[] = [];

  image = new Image();

  @ViewChild('canvas', {static: true}) canvasRef?: ElementRef;
  canvas?: HTMLCanvasElement;
  context?: CanvasRenderingContext2D;

  @ViewChild('div', {static: true}) containerRef?: ElementRef;

  scaleFactor = 1.1;

  isDrawingMode: boolean = true;

  drawingMouseDownListener!: (event: MouseEvent) => void;
  drawingMouseMoveListener!: (event: MouseEvent) => void;
  drawingMouseUpListener!: (event: MouseEvent) => void;

  panningMouseDownListener!: (event: MouseEvent) => void;
  panningMouseMoveListener!: (event: MouseEvent) => void;
  panningMouseUpListener!: (event: MouseEvent) => void;

  constructor(private documentService: DocumentService, private annotationService: AnnotationService,
              private route: ActivatedRoute, private sanitizer: DomSanitizer, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.canvas = this.canvasRef?.nativeElement
    const routeParams = this.route.snapshot.paramMap;
    this.uid = localStorage.getItem("uid")!;
    this.documentId = routeParams.get(RouterEnum.DocumentId) as string;

    this.getAllAnnotations();
  }

  ngAfterViewInit() {
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
    this.documentService.getDocumentById(this.documentId).subscribe(async res => {
      this.image.src = URL.createObjectURL(res);
      this.loadImage();
    });
  }

  private setCanvasSize() {
    const canvas: HTMLCanvasElement = this.canvasRef?.nativeElement;
    const container: HTMLDivElement = this.containerRef?.nativeElement;

    // Set the container size to the canvas dimensions
    console.log(this.image.width)
    console.log(this.image.height)
    container.style.width = `${this.image.width}px`;
    container.style.height = `${this.image.height}px`;
  }

  loadImage() {
    this.image.onload = async () => {
      const canvas = this.canvasRef?.nativeElement;
      this.context = canvas.getContext('2d');
      canvas!.width = this.image.width;
      canvas!.height = this.image.height;

      this.setCanvasSize();

      this.context?.drawImage(this.image, 0, 0, this.image.width, this.image.height, 0, 0, canvas!.width, canvas!.height);
      this.drawAnnotations();

      // Set up event listeners
      // this.addEventListener();
      await this.setDrawingListeners();
      await this.setPanningListeners();
      console.log("Calling updateMouseEventListeners");
      this.updateMouseEventListeners(this.drawingMouseDownListener, this.drawingMouseMoveListener, this.drawingMouseUpListener);
    };
  }

  setDrawingListeners() {
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

    this.drawingMouseDownListener = (event: MouseEvent) => {
      startX = event.offsetX;
      startY = event.offsetY;
      prevX = startX;
      prevY = startY;

      for (const annotation of this.annotations) {
        const width: number = annotation.endX - annotation.startX;
        const height: number = annotation.endY - annotation.startY;
        this.context?.beginPath();
        this.context?.rect(annotation.startX, annotation.startY, width, height);
        if (this.context?.isPointInPath(startX, startY)) {
          selectedAnnotation = annotation;
          oldStartX = annotation.startX;
          oldStartY = annotation.startY;
          oldEndX = annotation.endX;
          oldEndY = annotation.endY;
          return;
        }
      }

      isDown = true;
    }

    this.drawingMouseMoveListener = (event: MouseEvent) => {
      currentX = event.offsetX;
      currentY = event.offsetY;

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

      const width = currentX - startX;
      const height = currentY - startY;

      // Redraw image to remove lingering boxes
      this.redrawImage();
      this.context!.strokeStyle = 'red';
      this.context?.strokeRect(startX, startY, width, height);
    }

    this.drawingMouseUpListener = (event: MouseEvent) => {
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
      this.handleNewManualAnnotation(dialogRef, annotationCoordinates);
    }

    console.log("Drawing listeners set up");
    console.log("Drawing Mouse Down ", this.drawingMouseDownListener);
  }

  setPanningListeners() {
    const canvas: HTMLCanvasElement = this.canvasRef?.nativeElement;

    let lastX: number;
    let lastY: number;

    let isDown: boolean = false;

    this.panningMouseDownListener = (event: MouseEvent) => {
      // handle mouse down for panning
      console.log("Pan start");
      lastX = event.clientX;
      lastY = event.clientY;

      isDown = true;
    };

    this.panningMouseMoveListener = (event: MouseEvent) => {
      // handle mouse move for panning
      if(isDown) {
        console.log("Panning");
        const deltaX = event.clientX - lastX;
        const deltaY = event.clientY - lastY;
        canvas.parentElement!.scrollLeft -= deltaX;
        canvas.parentElement!.scrollTop -= deltaY;
        lastX = event.clientX;
        lastY = event.clientY;
        this.drawAnnotations();
      }
    };

    this.panningMouseUpListener = (event: MouseEvent) => {
      // handle mouse up for panning
      console.log("Pan end");
      isDown = false;
    };

    // hide scroll bars
    canvas.style.overflow = "hidden";

    console.log("Panning listeners set up");
  }

  handleNewManualAnnotation(dialogRef: MatDialogRef<DialogComponent, any>, annotationCoordinates: AnnotationCoordinatesModel) {
    dialogRef.afterClosed().subscribe(content => {
      console.debug(`Dialog result: ${content}`);

      if (content) {
        this.addAnnotation(annotationCoordinates, content, this.NIL);
      } else {
        this.drawAnnotations();
      }
    });
  }

  openDialog(text: string = "") {
    return this.dialog.open(DialogComponent, {
      width: '250px',
      data: {text}
    });
  }

  addAnnotation(annotationCoordinates: AnnotationCoordinatesModel, content: string, algorithmId: string) {
    if (!this.coordinates.includes(annotationCoordinates)) {
      let annotation: AnnotationModel = {
        uid: this.uid,
        imageId: this.documentId,
        algorithmId: algorithmId,
        content: content,
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

  selectAnnotation(annotation: AnnotationModel, oldStartX: number, oldStartY: number, oldEndX: number, oldEndY: number) {
    console.debug("onSelect: " + annotation.content);
    this.context!.strokeStyle = 'blue';
    this.context?.strokeRect(annotation.startX, annotation.startY, annotation.endX - annotation.startX, annotation.endY - annotation.startY);

    let dialogRef = this.openDialog(annotation.content);
    dialogRef.afterClosed().subscribe(content => {
      console.debug(`Dialog result: ${content}`);

      if (content) {
        //TODO pass algorithmId?
        // OK
        this.updateAnnotation(annotation, content);
      } else if(content == 0) {
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

  drawAnnotations() {
    // Redraw image to remove lingering boxes
    this.redrawImage();

    for (let i = 0; i < this.annotations.length; i++) {
      const value = this.annotations[i].content;
      const coordinates: AnnotationCoordinatesModel = { startX: this.annotations[i].startX,  startY: this.annotations[i].startY,
        endX: this.annotations[i].endX, endY: this.annotations[i].endY };
      const { startX, startY, endX, endY} = coordinates;
      const width = endX - startX;
      const height = endY - startY;
      if (this.context) {
        this.context.strokeStyle = 'red';
        this.context?.strokeRect(startX, startY, width, height);
        // Add text
        const text = value;
        const textX = startX + width / 2;
        const textY = startY + height / 2 + 3.5;
        this.context.font = 'bold 14px Arial';
        this.context.fillStyle = 'red';
        this.context.textAlign = 'center';
        this.context.fillText(text, textX, textY);
      }
    }
  }

  redrawImage() {
    const canvas = this.canvasRef?.nativeElement;
    this.context?.drawImage(this.image, 0, 0, this.image.width, this.image.height, 0, 0, canvas!.width, canvas!.height);
  }

  zoomIn() {
    this.context?.scale(this.scaleFactor, this.scaleFactor);
    this.drawAnnotations();
  }

  zoomOut() {
    this.context?.scale(1 / this.scaleFactor, 1 / this.scaleFactor);
    this.drawAnnotations();
  }

  setDrawingMode(drawingMode: boolean) {
    if(drawingMode && !this.isDrawingMode) {
      this.updateMouseEventListeners(this.drawingMouseDownListener, this.drawingMouseMoveListener, this.drawingMouseUpListener,
                                     this.panningMouseDownListener, this.panningMouseMoveListener, this.panningMouseUpListener);
    } else if (!drawingMode && this.isDrawingMode) {
      this.updateMouseEventListeners(this.panningMouseDownListener, this.panningMouseMoveListener, this.panningMouseUpListener,
                                     this.drawingMouseDownListener, this.drawingMouseMoveListener, this.drawingMouseUpListener);
    }
    this.isDrawingMode = drawingMode;
  }

  updateMouseEventListeners(
    onMouseDownNew: (event: MouseEvent) => void, onMouseMoveNew: (event: MouseEvent) => void, onMouseUpNew: (event: MouseEvent) => void,
    onMouseDownOld?: (event: MouseEvent) => void, onMouseMoveOld?: (event: MouseEvent) => void, onMouseUpOld?: (event: MouseEvent) => void) {
    const canvas = this.canvasRef!.nativeElement;

    if(onMouseDownOld && onMouseMoveOld && onMouseUpOld) {
      canvas.removeEventListener('mousedown', onMouseDownOld);
      canvas.removeEventListener('mousemove', onMouseMoveOld);
      canvas.removeEventListener('mouseup', onMouseUpOld);
    }
    console.log("mouseUpNew " + onMouseUpNew);
    canvas.addEventListener('mousedown', onMouseDownNew);
    canvas.addEventListener('mousemove', onMouseMoveNew);
    canvas.addEventListener('mouseup', onMouseUpNew);
  }
}
