import { Component, inject, Input } from '@angular/core';
import { ProductsService } from '../../services/products.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.css'
})
export class PaginationComponent {
  @Input() totalItems = 0
  pages: number[] = []
  currentPage: number = 1
  productService = inject(ProductsService)
  constructor() {
    this.pages = Array.from({ length: this.productService.getPagination().totalPages }, (_, i) => i + 1);

  }
  onClickPage(num: number) {
    this.currentPage = num
    this.productService.loadProducts(this.totalItems, num)
  }



}
