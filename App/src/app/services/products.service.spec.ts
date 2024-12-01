import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProductsService } from './products.service';
import { environment } from '../../environments/environment';
import { Product } from '../interfaces/IProduct';
import { Response } from '../interfaces/IResponse';

const mockProducts: Product[] = [
  {
    id: 'uno',
    name: 'Investment Fund',
    description: 'A diversified investment fund',
    logo: 'fund_logo.png',
    date_release: '2023-01-15',
    date_revision: '2024-01-15'
  },
  {
    id: 'dos',
    name: 'Savings Bond',
    description: 'A government-backed savings bond',
    logo: 'bond_logo.png',
    date_release: '2022-05-20',
    date_revision: '2023-05-20'
  }
];


describe('ProductsService', () => {
  let service: ProductsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductsService]
    });

    service = TestBed.inject(ProductsService);
    httpMock = TestBed.inject(HttpTestingController);

    const req = httpMock.expectOne((request)=>request.url.includes(`${environment.apiUrl}bp/products`));
    expect(req.request.method).toBe('GET');
    req.flush({ data: [...mockProducts] });
  });

  afterEach(() => {
    httpMock.verify();

  });

  it('Debe cargar los datos', () => {

    expect(service.currentProducts()).toEqual(mockProducts);
  });

  it('Debe crear un producto', () => {
    const newProduct: Product = { id: 'tres', name: 'Prestamos', description: 'Prestamos inmediatos', logo: 'logo3.png', date_release: '2024-07-31', date_revision: '2024-08-01' };
    const mockResponse: Response = { data: newProduct as Product, message: 'Product added succesfully', type: 'success' };

    service.createProduct(newProduct).subscribe(response => {
      expect(response).toEqual(mockResponse);
      expect(service.currentProducts()).toContain(newProduct);
    });

    const req = httpMock.expectOne((request)=>request.url.includes(`${environment.apiUrl}bp/products`));

    expect(req?.request.method).toBe('POST');
    req.flush(mockResponse);

  });

  it('Deberia actualizar un producto', () => {
    const updatedProduct: Product = { id: 'dos', name: 'Savings updated', description: 'Prestamos inmediatos', logo: 'logo3.png', date_release: '2024-07-31', date_revision: '2024-08-01' };
    service.updateProduct(updatedProduct).subscribe(() => {
      expect(service.currentProducts().find(p => p.id === updatedProduct.id)?.name).toEqual(updatedProduct.name);
    });

    const req = httpMock.expectOne((request)=>request.url.includes(`${environment.apiUrl}bp/products/${updatedProduct.id}`));
    expect(req.request.method).toBe('PUT');
    req.flush({});
  });

  it('Deberia borrar un producto', () => {
    const id = 'tres';

    service.deleteProduct(id).subscribe(() => {
      expect(service.currentProducts()).toEqual(mockProducts.filter(p => p.id !== id));
    });

    const req = httpMock.expectOne((request)=>request.url.includes(`${environment.apiUrl}bp/products/${id}`));
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });




});
