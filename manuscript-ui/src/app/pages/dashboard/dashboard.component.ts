import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {Router} from "@angular/router";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort, Sort} from "@angular/material/sort";
import {Subscription} from "rxjs";
import {MatTableDataSource} from "@angular/material/table";
import {VideoTableEnum} from "../../enums/VideoTableEnum";
import {VideoInfoTableModel} from "../../models/VideoInfoTableModel";
import {InfoVideoModel} from "../../models/VideoInfoModel";
import {StatusEnum} from "../../enums/StatusEnum";
import {VideoUploadEnum} from "../../enums/VideoUploadEnum";
import {DocumentService} from "../../services/document.service";
import {SocketService} from "../../services/socket.service";
import {TextService} from "../../services/text.service";
import {DateService} from "../../services/date.service";
import {Client} from "@stomp/stompjs";
import {RouterEnum} from "../../enums/RouterEnum";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  VideoInfoTableModels: Array<VideoInfoTableModel> = [];
  videoInfoVideos: Array<InfoVideoModel> = [];
  displayedColumns: string[] = [VideoTableEnum.Video_Key, VideoTableEnum.Status,
    VideoTableEnum.CreatedTime, VideoTableEnum.Step, VideoTableEnum.Step_Progress, VideoTableEnum.Description, VideoTableEnum.Progress, VideoTableEnum.Actions];
  dataSource: MatTableDataSource<VideoInfoTableModel> = new MatTableDataSource<VideoInfoTableModel>([]);
  isStatusFinished = false;
  status = StatusEnum;
  private subscribe?: Subscription;
  public formGroup: FormGroup;
  fileStatus: string = VideoUploadEnum.NoFileChosen;
  fileToUpload!: File | null;
  isStart = true;
  time = "Created Time";
  isRetry = false;
  private stompClient: Client | null = null;
  sort: MatSort | null = null

  isCancelled = false;
  @ViewChild('paginator') paginator?: MatPaginator;


  constructor(public textService: TextService,
              public dateService: DateService,
              public router: Router,
              private formBuilder: FormBuilder,
              private socketService: SocketService
    , private documentService: DocumentService,
  ) {
    this.formGroup = this.formBuilder.group({
      selectedFile: null,
      uploadFile: null
    });
  }

  ngOnInit(): void {

    this.documentService.getAllDocuments().subscribe(res => {
      this.connectToSocket();
      this.setDataToTable(res);
      this.announceSortChange({active: this.time, direction: 'asc'})

    });

  }

  @ViewChild(MatSort) set x(mat: MatSort) {
    this.sort = mat
  };

  announceSortChange(sortState: Sort) {
    if (sortState.active === this.time) {
      this.sortByTime(sortState)
    } else {
      this.sortSBytatus(sortState);
    }
  }

  private sortByTime(sortState: Sort) {
    let big = 1
    let small = -1
    if (sortState.direction === 'asc') {
      big = -1
      small = 1
    }
    this.dataSource.data = this.dataSource.data.sort((a, b) => {
      if (a.createdTime && b.createdTime) {
        if (a.createdTime > b.createdTime) {
          return big
        } else {
          return small
        }
      }
      return big
    })
  }

  ask(msg: string): boolean {
    return confirm(`Are you sure that you want to ${msg} the video`)
  }



  connectToSocket() {
    this.stompClient = this.socketService.initSocket()
    if (this.stompClient != null) {
      // @ts-ignore
      this.socketService.subscription(this.stompClient, "/topic/videoList", this.onNotify)
    }
  }

  clickedRow(row: VideoInfoTableModel) {
    if (row == null || row.id == undefined) return;
    this.router.navigate(['/' + RouterEnum.VideoDetail, row.video_id]);
  }


  uploadFileService(event: any) {

    const file: File = event.target.files[0];

    const element = event.currentTarget as HTMLInputElement;
    let fileList: FileList | null = element.files;
    if (fileList) {

      this.fileStatus = fileList.item(0)?.name || this.fileStatus;
      this.fileToUpload = fileList.item(0);
      this.formGroup.controls[VideoUploadEnum.SelectedFile].setValue(fileList.item(0)?.name);
      const formData: FormData = new FormData();

      formData.append('data', file);
      if (this.fileToUpload) {
        formData.append('file', this.fileToUpload);
        this.subscribe = this.documentService.uploadDocument(formData)
          .subscribe(res => {
            this.setDataToTable(res);
            this.formGroup.reset();
          });
      }
    }
  }


  private setDataToTable(res: any) {
    if (res) {
      this.VideoInfoTableModels = res;
    }
    this.dataSource = new MatTableDataSource(this.VideoInfoTableModels);
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
    this.announceSortChange({active: this.time, direction: 'asc'})


  }

  ngOnDestroy() {
    this.subscribe?.unsubscribe();
    if (this.stompClient != null) {
      this.stompClient.disconnect();
    }
  }

  onNotify = (msg: any) => {
    const result = JSON.parse(msg.body)
    this.setDataToTable(result)
  };


  private sortSBytatus(sortState: Sort) {
    let big = 1
    let small = -1
    if (sortState.direction === 'asc') {
      big = -1
      small = 1
    }
    this.dataSource.data = this.dataSource.data.sort((a, b) => {
      if (a.status && !b.status) {
        return big
      } else if (a.status === b.status) {
        if (a.status == 'Ready') {
          return -1
        }
        return 1
      }
      return small
    })
  }


}
