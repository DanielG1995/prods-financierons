import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditProductComponent } from './edit-product.component';
import { ActivatedRoute, ParamMap, RouterModule } from '@angular/router';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from '../../../environments/environment';
import { Product } from '../../interfaces/IProduct';
import { ProductsService } from '../../services/products.service';
import { of } from 'rxjs';

describe('EditProductComponent', () => {
  let component: EditProductComponent;
  let fixture: ComponentFixture<EditProductComponent>;
  let httpMock: HttpTestingController;
  let productService: ProductsService
  const mockProduct: Product = {
    id: 'Uno',
    name: 'Test Product',
    description: 'Test Description',
    logo: 'test-logo.png',
    date_release: '2023-01-15',
    date_revision: '2024-01-15'
  };
  const mockActivatedRoute = {
    paramMap: of({
      get: (key: string) => 'uno'
    } as ParamMap)
  };
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditProductComponent, RouterModule.forRoot([]), HttpClientTestingModule],
      providers: [
        ProductsService,
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(EditProductComponent);
    productService = TestBed.inject(ProductsService);
    httpMock = TestBed.inject(HttpTestingController);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Deberia cargar producto por ID ', () => {
    fixture.detectChanges();
    const req = httpMock.expectOne(`${environment.apiUrl}bp/products/uno`);
    expect(req.request.method).toBe('GET');
    req.flush(mockProduct);

    expect(component.product).toEqual(mockProduct);
  });

  it('Deberia actualizar producto al hacer submit', () => {
    fixture.detectChanges();

    const req = httpMock.expectOne(`${environment.apiUrl}bp/products/uno`);
    req.flush(mockProduct);

    const updatedProduct = { ...mockProduct, name: 'Updated Product' };
    component.onSubmitUpdate({ name: updatedProduct.name, description: updatedProduct.description, logo: updatedProduct.logo, date_release: updatedProduct.date_release, date_revision: updatedProduct.date_revision });

    const reqUpdate = httpMock.expectOne(`${environment.apiUrl}bp/products/uno`);
    expect(reqUpdate.request.method).toBe('PUT');
    reqUpdate.flush({ message: 'Product updated successfully' });

    expect(component.message.text).toBe('Product updated successfully');
  });
});
