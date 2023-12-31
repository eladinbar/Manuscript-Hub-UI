import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import Swal from 'sweetalert2';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';
import {AlgorithmRequestTable} from "../../../../models/AlgorithmRequestTable";
import {AlgorithmService} from "../../../../services/algorithm.service";
import {AccountService} from "../../../../services/auth/account.service";
import {AlgorithmModel} from "../../../../models/AlgorithmModel";
import {UserModel} from "../../../../models/UserModel";
import {AlgorithmStatusEnum} from "../../../../enums/AlgorithmStatusEnum";
import {CryptoService} from "../../../../services/crypto.service";


@Component({
  selector: 'app-algorithm-requests',
  templateUrl: './algorithm-requests.component.html',
  styleUrls: ['./algorithm-requests.component.css']
})
export class AlgorithmRequestsComponent implements OnInit {
  tableAlgorithmRequests: AlgorithmRequestTable[] = [];
  algorithmModels: AlgorithmModel[] = [];
  dataSource: MatTableDataSource<AlgorithmRequestTable> = new MatTableDataSource<AlgorithmRequestTable>();
  @ViewChild(MatSort, {static: false}) sort!: MatSort;
  @ViewChild(MatPaginator, {static: false}) paginator!: MatPaginator;
  tableCols: string[] = ['loading', 'email', 'title', 'description', 'modelType', 'repository', 'status', 'edit'];
  @ViewChild('assignAlgorithmModal') assignModal?: ElementRef;
  message: string = '';
  uid!: string;
  role!: string;

  constructor(private algorithmService: AlgorithmService, private accountService: AccountService, public cryptoService: CryptoService) {
  }

  ngOnInit(): void {
    this.uid = localStorage.getItem('uid')!;
    this.role = this.cryptoService.decrypt(localStorage.getItem('role')!)!;
    this.fetchTableData();
  }

  fetchTableData(): void {
    if(this.role == 'Admin') {
      this.algorithmService.getAllAlgorithms(this.uid).subscribe((algorithms: AlgorithmModel[]) => {
        this.callServices(algorithms);
      });
    } else if(this.role == 'Developer') {
      this.algorithmService.getAllAlgorithmsByUid(this.uid).subscribe((algorithms: AlgorithmModel[]) => {
        this.callServices(algorithms);
      });
    }
  }

  private callServices(algorithms: AlgorithmModel[]) {
    this.algorithmModels = algorithms;
    for (let algorithmRequest of this.algorithmModels) {
      this.accountService.getUserByUid(algorithmRequest.uid).subscribe((user: UserModel) => {
        this.tableAlgorithmRequests.push({
          email: user.email,
          title: algorithmRequest.title,
          description: algorithmRequest.description,
          modelType: algorithmRequest.modelType,
          repository: algorithmRequest.url,
          status: algorithmRequest.status!,
        });
        this.initDataSource();
      });
    }
  }

  private initDataSource(): void {
    this.dataSource = new MatTableDataSource<AlgorithmRequestTable>(this.tableAlgorithmRequests);
    this.dataSource.sort = this.sort!;
    this.dataSource.paginator = this.paginator;
  }

  approveRequest(algorithmRequest: AlgorithmRequestTable): void {
    let newStatus: AlgorithmStatusEnum;
    let newButtonText: string;
    let newText: string;
    const promptTextTemplate: string = "The algorithm request status will be set to ";

    switch (algorithmRequest.status) {
      case AlgorithmStatusEnum.Declined:
      case AlgorithmStatusEnum.Pending:
        newStatus = AlgorithmStatusEnum.Approved;
        newButtonText = 'Approve';
        newText = promptTextTemplate + "Approved.";
        break;
      case AlgorithmStatusEnum.Approved:
        newStatus = AlgorithmStatusEnum.CloudStaging;
        newButtonText = 'Cloud Staging';
        newText = promptTextTemplate + "Cloud Staging.\nAlgorithms in Cloud Staging will be dockerized in preparation for use within the system.";
        break;
      case AlgorithmStatusEnum.CloudStaging:
        newStatus = AlgorithmStatusEnum.Trial;
        newButtonText = 'Trial';
        newText = promptTextTemplate + "Trial.\nAlgorithms in Trial will be available for use to admins and the owning developer.";
        break;
      case AlgorithmStatusEnum.Trial:
      case AlgorithmStatusEnum.Inactive:
        newStatus = AlgorithmStatusEnum.Production;
        newButtonText = 'Production';
        newText = promptTextTemplate + "Production.\nAlgorithms in Production will be available to all users using the system.";
        break;
      default:
        return;
    }

    Swal.fire({
      title: 'Accept Algorithm Request',
      text: newText,
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: newButtonText,
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#051390'
    }).then((result) => {
      if (result.value) {
        const algorithm: AlgorithmModel = {
          uid: this.uid,
          title: algorithmRequest.title,
          description: algorithmRequest.description,
          modelType: algorithmRequest.modelType,
          url: algorithmRequest.repository,
          status: newStatus,
        };
        algorithmRequest.isLoading = true;
        this.algorithmService.updateAlgorithm(algorithm).subscribe((algorithm: AlgorithmModel) => {
          if(algorithm.status && Object.values(AlgorithmStatusEnum).includes(algorithm.status) && algorithm.status === newStatus)
            algorithmRequest.status = newStatus;
          algorithmRequest.isLoading = false;
        });
      }
    });
  }


  declineRequest(algorithmRequest: AlgorithmRequestTable): void {
    Swal.fire({
      title: 'Deny Algorithm Request',
      text: `The algorithm request status will be set to Declined.`,
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Decline',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#f44336'
    }).then((result) => {
      if (result.value) {
        const algorithm: AlgorithmModel = {
          uid: this.uid,
          title: algorithmRequest.title,
          description: algorithmRequest.description,
          modelType: algorithmRequest.modelType,
          url: algorithmRequest.repository,
          status: AlgorithmStatusEnum.Declined,
        }
        algorithmRequest.isLoading = true;
        this.algorithmService.updateAlgorithm(algorithm).subscribe((): void => {
          if(algorithm.status && Object.values(AlgorithmStatusEnum).includes(algorithm.status) && algorithm.status === AlgorithmStatusEnum.Declined)
            algorithmRequest.status = AlgorithmStatusEnum.Declined;
          algorithmRequest.isLoading = false;
        });
      }
    });
  }

  disableAlgorithm(algorithmRequest: AlgorithmRequestTable): void {
    Swal.fire({
      title: 'Disable Algorithm Request',
      text: `The algorithm request status will be set to Inactive.`,
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Disable',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#e1622e'
    }).then((result) => {
      if (result.value) {
        const algorithm: AlgorithmModel = {
          uid: this.uid,
          title: algorithmRequest.title,
          description: algorithmRequest.description,
          modelType: algorithmRequest.modelType,
          url: algorithmRequest.repository,
          status: AlgorithmStatusEnum.Inactive,
        }
        algorithmRequest.isLoading = true;
        this.algorithmService.updateAlgorithm(algorithm).subscribe((): void => {
          if(algorithm.status && Object.values(AlgorithmStatusEnum).includes(algorithm.status) && algorithm.status === AlgorithmStatusEnum.Inactive)
            algorithmRequest.status = AlgorithmStatusEnum.Inactive;
          algorithmRequest.isLoading = false;
        });
      }
    });
  }
}
