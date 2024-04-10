import { Component, Input } from '@angular/core';
import { Company } from 'src/app/_models/company';

@Component({
  selector: 'app-company-info-box',
  templateUrl: './company-info-box.component.html',
  styleUrls: ['./company-info-box.component.scss', '../../../styles/_cards.scss']
})
export class CompanyInfoBoxComponent {
    @Input() company!: Company;
    @Input() defaultImage: string | null = '../../../assets/photo_placeholder.jpg';
    reviewScore: number = 4; // TODO: Add real review property
    isLiked: boolean = true; // TODO: Add real property
}
