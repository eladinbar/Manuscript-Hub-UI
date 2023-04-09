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

  documentId!: string;
  image?: any;
  imageAnnotationsList: AnnotationModel[] = [];
  sanitizedUrl?: any;
  uid!: string;
  value!: string;
  @ViewChild('canvas', {static: true}) canvas?: ElementRef;
  img = new Image();
  annotations: AnnotationCoordinatesModel[] = [];
  ctx?: CanvasRenderingContext2D;

  constructor(private documentService: DocumentService, private annotationService: AnnotationService,
              private route: ActivatedRoute, private sanitizer: DomSanitizer, private dialog: MatDialog) {}

  ngOnInit(): void {
    const routeParams = this.route.snapshot.paramMap;
    this.documentId = routeParams.get(RouterEnum.DocumentId) as string;
    //
    // this.documentService.getDocumentById(this.documentId).subscribe(res => {
    //
    //   this.sanitizedUrl = URL.createObjectURL(res)
    //   this.image = this.sanitizer.bypassSecurityTrustUrl(this.sanitizedUrl);
    this.uid = localStorage.getItem("uid")!;
    this.image = "assets/hebrew-alphabet.jpg";
    this.loadImage();

    // });
  }

  loadImage() {
    this.img.onload = () => {
      this.ctx = this.canvas?.nativeElement.getContext('2d');
      this.ctx?.drawImage(this.img, 0, 0);
      this.addEventListener();
    };
    this.img.src = this.image;
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
      ctx.drawImage(this.img, 0, 0);
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
      this.openDialog(annotationCoordinates);
    });
  }

  pushDataToList(annotationCoordinates: AnnotationCoordinatesModel) {
    if (!this.annotations.includes(annotationCoordinates)) {
      const annotation: AnnotationModel = {
        annotationCoordinates: annotationCoordinates,
        uid: this.uid,
        documentId: this.documentId,
        value: this.value
      }

      this.annotationService.addAnnotation(annotation);

      this.annotations.push(annotationCoordinates);
      this.imageAnnotationsList.push(annotation);
      this.drawAnnotations();
    }

  }

  drawAnnotations() {
    for (let i = 0; i < this.imageAnnotationsList.length; i++) {
      const value = this.imageAnnotationsList[i].value;
      const annotation: AnnotationCoordinatesModel = this.imageAnnotationsList[i].annotationCoordinates;
      const {startX, startY, endX, endY} = annotation;
      const width = endX - startX;
      const height = endY - startY;
      if (this.ctx) {
        this.ctx?.strokeRect(startX, startY, width, height);
        // Add text
        const text = value;
        const textX = startX / 1.5 + width / 2;
        const textY = startY / 1.5 + height / 2;
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

  openDialog(annotation: AnnotationCoordinatesModel) {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '250px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);

      this.value = result;
      if (result) {
        this.pushDataToList(annotation);
      } else {
        this.drawAnnotations();
      }

    });
  }
}
