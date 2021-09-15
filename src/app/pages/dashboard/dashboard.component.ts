import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Label, Color, SingleDataSet } from 'ng2-charts';
import { ToastrService } from 'ngx-toastr';
import { HttpmethodsService } from 'src/app/services/httpmethods.service';
import { EmployeeClass } from '../pagesModel';
import { deleteEmployeeURL, getAllEmployee, getEmployeeByIdURL, postEmployee, putEmployee } from '../pagesURL';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {


  // == Pie Chart ==
  public pieChartOptions: ChartOptions = {
    responsive: true,
  };
  public pieChartLabels: Label[] = [['SciFi'], ['Drama'], 'Comedy'];
  public pieChartData: SingleDataSet = [30, 50, 20];
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartPlugins = [];

  // == Bar Chart ==
  barChartOptions: ChartOptions = {
    responsive: true,
  };
  barChartLabels: Label[] = ['Apple', 'Banana', 'Kiwifruit', 'Blueberry', 'Orange', 'Grapes'];
  barChartType: ChartType = 'bar';
  barChartLegend = true;
  barChartPlugins = [];

  barChartData: ChartDataSets[] = [
    { data: [45, 37, 60, 70, 46, 33], label: 'Best Fruits' }
  ];

  // ====

  employeeForm: FormGroup;
  employeeModel = new EmployeeClass();

  closeResult: string = '';
  submitted = false;
  getAllEmployeeList: any[];
  isEdit: boolean = true;

  constructor(private formBuilder: FormBuilder, private router: Router, private httpService: HttpmethodsService, public toastr: ToastrService, private modalService: NgbModal) { }

  ngOnInit(): void {
    this.employeeForm = this.formBuilder.group({
      employeeFName: new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z ]*')]),
      employeeLName: new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z ]*')]),
      employeeAddress: new FormControl('', [Validators.required]),
      employeeDOB: new FormControl('', [Validators.required]),
      employeeContactNo: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]),
      employeeCity: new FormControl('', [Validators.required]),
    });
    this.getAll();
  }

  get f() { return this.employeeForm.controls; }

  onSubmit() {
    this.submitted = true;
    if (this.employeeForm.invalid) {
      return;
    }
    if (this.isEdit) {
      this.httpService.postRequest(postEmployee, this.employeeModel).subscribe((data: any) => {
        this.toastr.success('Succesfully Registered', 'Registration Success');
        this.getAll();
        this.isEdit = true;
      },
        error => {
          this.toastr.error('Please check again!', 'Registration Falied');
        });
    }
    else {
      this.httpService.putRequest(putEmployee, this.employeeModel).subscribe((data: any) => {
        this.toastr.success('Succesfully Updated', 'Registration Update');
        this.getAll();
        this.isEdit = true;
      },
        error => {
          this.toastr.error('Please check again!', 'Registration Falied');
        });
    }


  }

  getAll() {
    this.httpService.getRequest(getAllEmployee).subscribe((data: any) => {
      this.getAllEmployeeList = data;
    });
  }

  getById(id: number) {
    this.httpService.getRequest(getAllEmployee + "/" + id).subscribe((data: any) => {
      this.employeeModel = data;
      this.isEdit = false;
    });
  }

  deleteEmployee(id: number) {
    this.httpService.deleteRequest(deleteEmployeeURL + "/" + id).subscribe((data: any) => {
      this.getAll();
    });
  }

  open(content: any) {

    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: 'lg' },).result.then((result) => {

      this.closeResult = `Closed with: ${result}`;

    }, (reason) => {

      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;

    });

  }

  private getDismissReason(reason: any): string {

    if (reason === ModalDismissReasons.ESC) {

      return 'by pressing ESC';

    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {

      return 'by clicking on a backdrop';

    } else {

      return `with: ${reason}`;

    }

  }

}
