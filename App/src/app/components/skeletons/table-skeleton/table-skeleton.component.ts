import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Header } from '../../../interfaces/IHeader';

@Component({
  selector: 'app-table-skeleton',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './table-skeleton.component.html',
  styleUrl: './table-skeleton.component.css'
})
export class TableSkeletonComponent {
  @Input() headers: Header[] = [];
  @Input() rows: number = 5;
}
