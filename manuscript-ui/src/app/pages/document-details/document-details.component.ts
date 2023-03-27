import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {DocumentService} from "../../services/document.service";
import {ActivatedRoute} from "@angular/router";
import {DomSanitizer} from "@angular/platform-browser";
import {ImageAnnotationsModel} from "../../models/ImageAnnotationsModel";
import {RouterEnum} from "../../enums/RouterEnum";
import {MatDialog} from "@angular/material/dialog";
import {DialogComponent} from "../../dialog/dialog.component";
import {AnnotationsModel} from "../../models/AnnotationsModel";

@Component({
  selector: 'app-document-details',
  templateUrl: './document-details.component.html',
  styleUrls: ['./document-details.component.css']
})
export class DocumentDetailsComponent implements OnInit {

  documentId?: string;
  image?: any;
  imageAnnotationsList: ImageAnnotationsModel[] = [];
  sanitizedUrl?: any;
  uid?: string;
  value?: string;
  @ViewChild('canvas', {static: true}) canvas?: ElementRef;
  img = new Image();
  annotations: AnnotationsModel[] = [];
  ctx?: CanvasRenderingContext2D;

  constructor(private documentService: DocumentService, private route: ActivatedRoute, private sanitizer: DomSanitizer, private dialog: MatDialog) {
  }

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
    let currentX: number
    let currentY: number
    let isDown = false;
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
      const annotation = {
        startX: startX,
        startY: startY,
        endX: currentX,
        endY: currentY,
      }
      this.openDialog(annotation);
      // // Display text as a hint
      // const { width, height } = canvas.getBoundingClientRect();
      // const tooltipX = (startX + currentX) / 2;
      // const tooltipY = (startY + currentY) / 2;
      // const tooltipWidth = 200;
      // const tooltipHeight = 50;
      // const tooltipText = this.value;
      // const tooltipPadding = 10;
      // const tooltipXOffset = tooltipX + tooltipWidth + tooltipPadding > width ? -tooltipWidth - tooltipPadding : tooltipPadding;
      // const tooltipYOffset = tooltipY + tooltipHeight + tooltipPadding > height ? -tooltipHeight - tooltipPadding : tooltipPadding;
      // const tooltipBoxX = tooltipX + tooltipXOffset;
      // const tooltipBoxY = tooltipY + tooltipYOffset;
      // const tooltipBoxWidth = tooltipWidth;
      // const tooltipBoxHeight = tooltipHeight;
      //
      // ctx.fillStyle = 'black';
      // ctx.fillRect(tooltipBoxX, tooltipBoxY, tooltipBoxWidth, tooltipBoxHeight);
      //
      // ctx.font = '14px Arial';
      // ctx.fillStyle = 'white';
      // ctx.textAlign = 'center';
      // ctx.fillText(tooltipText, tooltipX + tooltipXOffset + tooltipWidth / 2, tooltipY + tooltipYOffset + tooltipHeight / 2);
      //

    });
  }

  pushDataToList(annotation: AnnotationsModel) {
    if (!this.annotations.includes(annotation)) {
      this.annotations.push(annotation);
      this.imageAnnotationsList.push(
        {
          annotation: annotation,
          uid: this.uid,
          documentId: this.documentId,
          value: this.value
        }
      )
      this.drawAnnotations(this.imageAnnotationsList);
    }

  }


  drawAnnotations(annotations: any[]) {
    for (let i = 0; i < annotations.length; i++) {
      const value = annotations[i].value;
      const annotation = annotations[i].annotation;
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

  openDialog(annotation: AnnotationsModel) {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '250px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);

      this.value = result;
      if (result) {
        this.pushDataToList(annotation);
      }else{
        this.drawAnnotations(this.annotations);
      }

    });
  }


}
