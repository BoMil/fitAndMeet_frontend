import { Component, Input } from '@angular/core';
import { Company } from 'src/app/_models/company';

@Component({
  selector: 'app-company-info-box',
  templateUrl: './company-info-box.component.html',
  styleUrls: ['./company-info-box.component.scss']
})
export class CompanyInfoBoxComponent {
    @Input() company!: Company;

}
