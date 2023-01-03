import { Component, OnInit } from '@angular/core';
import {DocumentService} from "../../services/document.service";
import {ActivatedRoute} from "@angular/router";
import {RouterEnum} from "../../enums/RouterEnum";
import {DomSanitizer} from "@angular/platform-browser";

@Component({
  selector: 'app-document-details',
  templateUrl: './document-details.component.html',
  styleUrls: ['./document-details.component.css']
})
export class DocumentDetailsComponent implements OnInit {

  documentId?: string;
  image?: any;
  sanitizedUrl?: any;
  constructor(private documentService: DocumentService, private route: ActivatedRoute, private sanitizer:DomSanitizer) { }

  ngOnInit(): void {
    const routeParams = this.route.snapshot.paramMap;
    this.documentId = routeParams.get(RouterEnum.DocumentId) as string;

    this.documentService.getDocumentById(this.documentId).subscribe(res => {

      this.sanitizedUrl = URL.createObjectURL(res)
      this.image = this.sanitizer.bypassSecurityTrustUrl(this.sanitizedUrl);


    });
  }

}
