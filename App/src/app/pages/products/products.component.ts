import { Component, computed, inject } from '@angular/core';
import { SearchInputComponent } from "../../components/inputs/search-input/search-input.component";
import { TableComponent } from "../../components/table/table.component";
import { ModalComponent } from "../../components/modal/modal.component";
import { ProductFormComponent } from "../../components/forms/product-form/product-form.component";
import { Header } from '../../interfaces/IHeader';
import { ProductsService } from '../../services/products.service';
import { Product } from '../../interfaces/IProduct';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AlertComponent } from "../../components/alert/alert/alert.component";
import { TableSkeletonComponent } from "../../components/skeletons/table-skeleton/table-skeleton.component";
import { EMPTY_MESSAGE } from '../../utils';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    RouterOutlet,
    TableComponent,
    ModalComponent,
    ProductFormComponent,
    SearchInputComponent,
    RouterLink,
    RouterLinkActive,
    AlertComponent,
    TableSkeletonComponent
  ],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent {
  productsService = inject(ProductsService)

  headers: Header[] = [
    { label: 'Logo', key: 'logo', type: 'img' },
    { label: 'Nombre del producto', key: 'name' },
    { label: 'Descripcion', key: 'description' },
    { label: 'Fecha de liberacion', key: 'date_release', type: 'date' },
    { label: 'Fecha de reestructuracion', key: 'date_revision', type: 'date' },
    { label: '', key: 'id', type: 'options' },
  ]

  isLoading = computed(() => this.productsService.isLoading())
  messageAlert = EMPTY_MESSAGE
  onDeleteProduct(id: string) {
    this.productsService.deleteProduct(id).subscribe(resp => {
      this.messageAlert.text = resp.message
      this.messageAlert.type = resp.type || 'succes'
      this.messageAlert.timestamp = new Date().getTime()
    })
  }

}
