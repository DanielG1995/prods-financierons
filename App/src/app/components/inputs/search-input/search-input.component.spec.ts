import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchInputComponent } from './search-input.component';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { ProductsService } from '../../../services/products.service';

describe('SearchInputComponent', () => {
  let component: SearchInputComponent;
  let fixture: ComponentFixture<SearchInputComponent>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockActivatedRoute: any;
  let mockProductsService: jasmine.SpyObj<ProductsService>;
  let queryParamsSubject = new Subject<any>();

  beforeEach(async () => {
    mockActivatedRoute = {
      queryParams: queryParamsSubject.asObservable()
    };

    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    mockProductsService = jasmine.createSpyObj('ProductsService', ['filterProducts']);

    await TestBed.configureTestingModule({
      imports: [FormsModule, RouterModule],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: Router, useValue: mockRouter },
        { provide: ProductsService, useValue: mockProductsService }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); 
  });

  afterEach(() => {
    component.ngOnDestroy();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería inicializar textValue desde queryParams', () => {
    queryParamsSubject.next({ q: 'test-query' });
    fixture.detectChanges();
    expect(component.textValue).toBe('test-query');
  });

  it('debería llamar a filterProducts con el valor después del debounce', (done) => {
    component.onTextChange('new-query');
    fixture.detectChanges();

    setTimeout(() => {
      expect(mockProductsService.filterProducts).toHaveBeenCalledWith('new-query');
      done();
    }, 300);
  });

  it('debería navegar con los queryParams correctos al cambiar el texto', () => {
    component.onTextChange('new-query');
    fixture.detectChanges();

    expect(mockRouter.navigate).toHaveBeenCalledWith([], {
      relativeTo: mockActivatedRoute,
      queryParams: { q: 'new-query' },
      replaceUrl: true
    });
  });

  it('debería eliminar queryParams cuando el texto se borra', () => {
    component.onTextChange('');
    fixture.detectChanges();

    expect(mockRouter.navigate).toHaveBeenCalledWith([], {
      relativeTo: mockActivatedRoute,
      queryParams: {},
      replaceUrl: true
    });
  });

  it('debería eliminar la subscripcion al destruirse el componente', () => {
    const spy = spyOn(component['debounceSubscription'], 'unsubscribe');
    component.ngOnDestroy();
    expect(spy).toHaveBeenCalled();
  });

  it('debería actualizar textValue y emitir debounceSubject al cambiar el texto', () => {
    const subjectSpy = spyOn(component['debounceSubject'], 'next');
    component.onTextChange('test');
    expect(component.textValue).toBe('test');
    expect(subjectSpy).toHaveBeenCalledWith('test');
  });
});
