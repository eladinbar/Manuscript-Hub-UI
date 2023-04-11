import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {DocumentService} from "../../services/document.service";
import {ActivatedRoute} from "@angular/router";
import {DomSanitizer} from "@angular/platform-browser";
import {AnnotationModel} from "../../models/AnnotationModel";
import {RouterEnum} from "../../enums/RouterEnum";
import {MatDialog} from "@angular/material/dialog";
import {DialogComponent} from "../../dialog/dialog.component";
import {AnnotationCoordinatesModel} from "../../models/AnnotationCoordinatesModel";
import {AnnotationService} from "../../services/annotation.service";

@Component({
  selector: 'app-document-details',
  templateUrl: './document-details.component.html',
  styleUrls: ['./document-details.component.css']
})

export class DocumentDetailsComponent implements OnInit {
  NIL: string = "00000000-0000-0000-0000-000000000000";

  uid!: string;
  imageId!: string;

  annotations: AnnotationCoordinatesModel[] = [];
  value!: string;
  imageAnnotationsList: AnnotationModel[] = [];

  image?: any;
  img= new Image();

  sanitizedUrl?: any;
  @ViewChild('canvas', {static: true}) canvas?: ElementRef;
  ctx?: CanvasRenderingContext2D;

  constructor(private documentService: DocumentService, private annotationService: AnnotationService,
              private route: ActivatedRoute, private sanitizer: DomSanitizer, private dialog: MatDialog) {}

  // ngOnInit(): void {
  //   const routeParams = this.route.snapshot.paramMap;
  //   this.imageId = routeParams.get(RouterEnum.DocumentId) as string;
  //
  //   // this.documentService.getDocumentById(this.imageId).subscribe(res => {
  //   //
  //   //   this.sanitizedUrl = URL.createObjectURL(res)
  //   //   this.image = this.sanitizer.bypassSecurityTrustUrl(this.sanitizedUrl);
  //   this.uid = localStorage.getItem("uid")!;
  //   this.image = "assets/hebrew-alphabet.jpg";
  //   this.loadImage();
  //
  //   // });
  // }

  ngOnInit(): void {
    const routeParams = this.route.snapshot.paramMap;
    this.imageId = routeParams.get(RouterEnum.DocumentId) as string;

    this.documentService.getDocumentById(this.imageId).subscribe(res => {
      const url = URL.createObjectURL(res);
      this.loadImage();
      this.img.src = url;
      this.uid = localStorage.getItem("uid")!;
    });
  }

  loadImage() {
      this.img.onload = () => {
        const canvas = this.canvas?.nativeElement;
        this.ctx = canvas.getContext('2d');
        canvas!.width = this.img.width;
        canvas!.height = this.img.height;
        // this.ctx?.drawImage(this.img, 0, 0, this.img.width, this.img.height, 0, 0, this.img.width, this.img.height);
        this.ctx?.drawImage(this.img, 0, 0, this.img.width, this.img.height, 0, 0, canvas!.width, canvas!.height);
        this.addEventListener();
      };
  }

  addEventListener() {
    const canvas = this.canvas?.nativeElement;
    const ctx = canvas.getContext('2d');
    let startX: number;
    let startY: number;
    let currentX: number;
    let currentY: number;
    let isDown: boolean = false;

    canvas.addEventListener('mousedown', (e: any) => {
      startX = e.offsetX;
      startY = e.offsetY;

      isDown = true;
    });

    canvas.addEventListener('mousemove', (e: any) => {
      if (!isDown) {
        return;
      }
      currentX = e.offsetX;
      currentY = e.offsetY;
      const width = currentX - startX;
      const height = currentY - startY;
      // ctx.clearRect(0, 0, canvas.width, canvas.height);
      // this.ctx?.drawImage(this.img, 0, 0, this.img.width, this.img.height, 0, 0, this.img.width, this.img.height);
      this.ctx?.drawImage(this.img, 0, 0, this.img.width, this.img.height, 0, 0, canvas!.width, canvas!.height);
      ctx.strokeStyle = 'red';
      ctx.strokeRect(startX, startY, width, height);
    });

    canvas.addEventListener('mouseup', () => {
      isDown = false;
      const annotationCoordinates: AnnotationCoordinatesModel = {
        startX: startX,
        startY: startY,
        endX: currentX,
        endY: currentY,
      }
      this.openDialog(annotationCoordinates, this.NIL);
    });
  }

  pushDataToList(annotationCoordinates: AnnotationCoordinatesModel, algorithmId: string) {
    if (!this.annotations.includes(annotationCoordinates)) {
      const annotation: AnnotationModel = {
        userId: this.uid,
        imageId: this.imageId,
        algorithmId: algorithmId,
        content: this.value,
        startX: annotationCoordinates.startX,
        startY: annotationCoordinates.startY,
        endX: annotationCoordinates.endX,
        endY: annotationCoordinates.endY
      }

      this.annotationService.addAnnotation(annotation);

      this.annotations.push(annotationCoordinates);
      this.imageAnnotationsList.push(annotation);
      this.drawAnnotations();
    }

  }

  drawAnnotations() {
    for (let i = 0; i < this.imageAnnotationsList.length; i++) {
      const value = this.imageAnnotationsList[i].content;
      const annotation: AnnotationCoordinatesModel = { startX: this.imageAnnotationsList[i].startX,  startY: this.imageAnnotationsList[i].startY, endX: this.imageAnnotationsList[i].endX, endY: this.imageAnnotationsList[i].endY };
      const {startX, startY, endX, endY} = annotation;
      const width = endX - startX;
      const height = endY - startY;
      if (this.ctx) {
        this.ctx?.strokeRect(startX, startY, width, height);
        // Add text
        const text = value;
        const textX = startX + width;
        const textY = startY + height;
        this.ctx.font = '14px Arial';
        this.ctx.fillStyle = 'red';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(text, textX, textY);
      }
    }
  }

  showAnnotations() {
    console.log(this.imageAnnotationsList);
  }

  openDialog(annotation: AnnotationCoordinatesModel, algorithmId: string) {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '250px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);

      this.value = result;
      if (result) {
        this.pushDataToList(annotation, algorithmId);
      } else {
        this.drawAnnotations();
      }

    });
  }
}
