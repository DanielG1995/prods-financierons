import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';  // Mejor opción para pruebas de enrutamiento

import { ProductsComponent } from './products.component';
import { RouterModule } from '@angular/router';
import { ProductsService } from '../../services/products.service';
import { Product } from '../../interfaces/IProduct';
import { of } from 'rxjs';

describe('ProductsComponent', () => {
  let component: ProductsComponent;
  let fixture: ComponentFixture<ProductsComponent>;
  let productsService: ProductsService

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ProductsComponent,
        RouterModule.forRoot([]),
        HttpClientTestingModule
      ]
    })
      .compileComponents();
    productsService = TestBed.inject(ProductsService);
    fixture = TestBed.createComponent(ProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Deberia mostrar cargando al mostrar componente', () => {
    productsService.isLoading.set(true);
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('app-table-skeleton')).toBeTruthy();
  });

  it('Deberia mostrar productos al dejar de cargar', () => {

    productsService.isLoading.set(false);
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('app-table')).toBeTruthy();
  });

  it('Deberia ejecutar onDeleteProduct mandando el id al dar click en eliminar', () => {

    productsService.isLoading.set(false);
    spyOn(productsService, 'deleteProduct').and.returnValue(of({ message: 'Product deleted', data: [], type: 'success' }));

    fixture.detectChanges();
    component.onDeleteProduct('tres');
    expect(productsService.deleteProduct).toHaveBeenCalledWith('tres');
  });
});