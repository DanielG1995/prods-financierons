import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AlertComponent } from './alert.component';
import { EMPTY_MESSAGE } from '../../../utils';
import { SimpleChanges } from '@angular/core';

describe('AlertComponent', () => {
  let component: AlertComponent;
  let fixture: ComponentFixture<AlertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería inicializar el mensaje con EMPTY_MESSAGE por defecto', () => {
    expect(component.message).toEqual(EMPTY_MESSAGE);
  });

  it('debería actualizar el mensaje cuando se recibe un nuevo input', () => {
    const newMessage = {
      text: '¡Éxito!',
      type: 'success' as 'success' | 'error',
      timestamp: Date.now()
    };

    component.message = newMessage;
    component.ngOnChanges({
      message: {
        currentValue: newMessage,
        previousValue: EMPTY_MESSAGE,
        firstChange: false,
        isFirstChange: () => false
      }
    } as SimpleChanges);

    expect(component.message.text).toBe('¡Éxito!');
    expect(component.message.type).toBe('success');
  });

  it('debería limpiar el texto del mensaje después de 3 segundos', (done) => {
    const newMessage = {
      text: 'Error en el servidor',
      type: 'error' as 'success' | 'error',
      timestamp: Date.now()
    };

    component.message = newMessage;
    component.ngOnChanges({
      message: {
        currentValue: newMessage,
        previousValue: EMPTY_MESSAGE,
        firstChange: false,
        isFirstChange: () => false
      }
    } as SimpleChanges);

    expect(component.message.text).toBe('Error en el servidor');

    setTimeout(() => {
      expect(component.message.text).toBe('');
      done();
    }, 3000);
  });

  it('no debería limpiar el mensaje antes de los 3 segundos', (done) => {
    const newMessage = {
      text: 'Procesando...',
      type: 'success' as 'success' | 'error',
      timestamp: Date.now()
    };

    component.message = newMessage;
    component.ngOnChanges({
      message: {
        currentValue: newMessage,
        previousValue: EMPTY_MESSAGE,
        firstChange: false,
        isFirstChange: () => false
      }
    } as SimpleChanges);

    setTimeout(() => {
      expect(component.message.text).toBe('Procesando...');
      done();
    }, 1000); // Verifica después de 1 segundo
  });
});
