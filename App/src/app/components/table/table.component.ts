import { Component, computed, EventEmitter, inject, Input, input, Output, signal } from '@angular/core';
import { Product } from '../../interfaces/IProduct';
import { Header } from '../../interfaces/IHeader';
import { DatePipe } from '@angular/common';
import { ModalComponent } from "../modal/modal.component";
import { RouterLink } from '@angular/router';
import { PaginationComponent } from "../pagination/pagination.component";
import { ProductsService } from '../../services/products.service';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [DatePipe, ModalComponent, RouterLink, PaginationComponent],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css'
})
export class TableComponent {
  @Output() confirm = new EventEmitter<any>();
  headers = input<Header[]>()
  items = input<Product[]>([])
  count = computed(() => this.items().slice(0, this.paginateCount()).length)
  paginateCount = signal(5);
  currentId = ''
  currentProduct: Product | null = null
  isModalVisible = false
  productService = inject(ProductsService)

  onChangePagination(num: number) {
    this.productService.loadProducts(num);
    this.paginateCount.set(num)
  }

  toggleMenu(id: string) {
    this.currentId = id
  }

  onClickConfirm() {
    this.confirm.emit(this.currentProduct?.id)
    this.showModal()
  }

  showModal(product?: Product) {
    this.isModalVisible = !this.isModalVisible;
    this.currentProduct = product || null
    this.currentId = ''
  }

}
