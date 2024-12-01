import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TableComponent } from './table.component';
import { DatePipe } from '@angular/common';
import { By } from '@angular/platform-browser';
import { ComponentRef, DebugElement } from '@angular/core';
import { Product } from '../../interfaces/IProduct';
import { Header } from '../../interfaces/IHeader';
import { RouterModule } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('TableComponent', () => {
  let component: TableComponent;
  let fixture: ComponentFixture<TableComponent>;
  let componentRef: ComponentRef<TableComponent>
  let debugElement: DebugElement;

  const mockHeaders: Header[] = [
    { label: 'Logo', key: 'logo', type: 'img' },
    { label: 'Nombre del producto', key: 'name' },
    { label: 'Descripcion', key: 'description' },
    { label: 'Fecha de liberacion', key: 'date_release', type: 'date' },
    { label: 'Fecha de reestructuracion', key: 'date_revision', type: 'date' },
    { label: ' ', key: 'id', type: 'options' },
  ];

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

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DatePipe],
      imports: [RouterModule.forRoot([]), HttpClientTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(TableComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    component = fixture.componentInstance
    componentRef = fixture.componentRef
    componentRef.setInput('headers', mockHeaders)
    componentRef.setInput('items', mockProducts)

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Deberia renderizar las cabeceras', () => {
    const headers = debugElement.queryAll(By.css('th'));
    expect(headers.length).toBe(mockHeaders.length);
    headers.forEach((header, index) => {
      expect(header.nativeElement.textContent).toContain(mockHeaders[index].label);
    });
  });

  it('should render product items', () => {
    const rows = debugElement.queryAll(By.css('tbody tr'));
    expect(rows.length).toBe(mockProducts.length);
    rows.forEach((row, index) => {
      const cells = row.queryAll(By.css('td'));
      expect(cells[1].nativeElement.textContent).toContain(mockProducts[index].name);
      expect(cells[2].nativeElement.textContent).toContain(mockProducts[index].description);
      expect(cells[3].nativeElement.textContent).toContain(new DatePipe('en-US').transform(mockProducts[index].date_release, 'shortDate'));
      expect(cells[4].nativeElement.textContent).toContain(new DatePipe('en-US').transform(mockProducts[index].date_revision, 'shortDate'));
    });
  });

  it('Deberia actualizar la paginacion', () => {
    const select = debugElement.query(By.css('select')).nativeElement;
    select.value = '10';
    select.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    expect(component.paginateCount()).toBe(10);
  });

  it('Deberia a abrir o cerrar el modal para el producto seleccionado', () => {
    component.toggleMenu('uno');
    fixture.detectChanges();
    expect(component.currentId).toBe('uno');
    component.toggleMenu('');
    fixture.detectChanges();
    expect(component.currentId).toBe('');
  });

  it('Deberia mostrar modal y almacenar producto', () => {
    component.showModal(mockProducts[0]);
    fixture.detectChanges();
    expect(component.isModalVisible).toBe(true);
    expect(component.currentProduct).toEqual(mockProducts[0]);
  });

  it('Deberia emitir evento de confirmacion', () => {
    spyOn(component.confirm, 'emit');
    component.showModal(mockProducts[0]);
    fixture.detectChanges();
    component.onClickConfirm();
    fixture.detectChanges();
    expect(component.confirm.emit).toHaveBeenCalledWith(mockProducts[0].id);
  });

  it('Deberia cerrar modal al cancelar', () => {
    component.showModal(mockProducts[0]);
    fixture.detectChanges();
    component.showModal();
    fixture.detectChanges();
    expect(component.isModalVisible).toBe(false);
  });
});
