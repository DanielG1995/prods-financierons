import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Product } from '../../../interfaces/IProduct';
import { DATE_FORMAT, EMPTY_PRODUCT } from '../../../utils';
import { dateComparisonValidator } from '../../../validators/dateComparisonValidator';
import { ProductsService } from '../../../services/products.service';
import { idValidator } from '../../../validators/idValidator';
import { dateValidatorToday } from '../../../validators/dateValidatorToday';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.css'
})
export class ProductFormComponent implements OnChanges {
  @Input() product: Product = EMPTY_PRODUCT;
  @Input() disabledInputs?: string[]
  @Output() submitEvent = new EventEmitter<any>();
  productForm: FormGroup = this.fb.group({});
  minDate = new Date().toLocaleDateString('en-CA')
  productService = inject(ProductsService)
  constructor(private fb: FormBuilder) {

    this.productForm = this.fb.group({
      id: ['', {
        validators: [Validators.required, Validators.minLength(3), Validators.maxLength(10)],
        asyncValidators: [],
        updateOn: 'blur'
      }],
      name: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
      logo: ['', Validators.required],
      date_release: [undefined, [Validators.required]],
      date_revision: [undefined, Validators.required],
    });

  }

  addAsyncValidators() {
    const asyncFieldControl = this.productForm.get('id');
    if (asyncFieldControl) {
      asyncFieldControl.setAsyncValidators([idValidator(this.productService)]);
      asyncFieldControl.updateValueAndValidity();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['product'] && changes['product'].currentValue) {
      this.updateForm(changes['product'].currentValue);
    }

    if (changes['disabledInputs']) {
      this.disabledInputs?.forEach(input => {
        this.productForm.get(input)?.disable();
      })
    }
  }

  updateForm(product: Product) {
    this.productForm.patchValue({
      id: product.id,
      name: product.name,
      description: product.description,
      logo: product.logo,
      date_release: product.date_release ? new Date(product.date_release!).toLocaleDateString(DATE_FORMAT) : null,
      date_revision: product.date_revision ? new Date(product.date_revision!).toLocaleDateString(DATE_FORMAT) : null,
    });
    this.productForm.addValidators(dateComparisonValidator())
    if (!this.disabledInputs || this.disabledInputs?.length === 0) {
      this.addAsyncValidators()
    }

  }


  onSubmit() {
    if (this.productForm.valid) {
      this.submitEvent.emit(this.productForm.value);
    } else {
      this.productForm.markAllAsTouched();
    }
  }

  isFieldInvalid(fieldName: string): boolean | undefined {
    const field = this.productForm.get(fieldName);
    return field?.invalid && (field?.dirty || field?.touched);
  }

  isDisabled(name: string) {
    return this.disabledInputs?.includes(name) || false
  }

  getFieldError(field?: string): string | null {
    if (!field) {
      return this.productForm.status === "INVALID" && this.productForm.touched ? '1' : null
    }

    if (!this.productForm.controls[field]) return null;

    const errors = this.productForm.controls[field].errors || {};

    for (const key of Object.keys(errors)) {
      switch (key) {
        case 'required':
          return 'Este campo es requerido';
        case 'minlength':
          return `Mínimo ${errors['minlength'].requiredLength} caracteres.`;
        case 'maxlength':
          return `Máximo ${errors['maxlength'].requiredLength} caracteres.`;
        case 'duplicatedId':
          return `ID no válido!`;
        case 'dateInvalidToday':
          return `La fecha debe ser igual o mayor a la fecha actual`;
        default:
          break;
      }
    }
    if (this.productForm.errors?.['dateInvalidToday']) {
      return this.productForm.errors['dateInvalidToday'];
    }

    if (this.productForm.errors?.['dateComparison']) {
      return this.productForm.errors['dateComparison'];
    }

    return null;
  }

  resetForm() {
    const defaultValues: Record<string, any> = {}
    this.disabledInputs?.forEach(input => {
      defaultValues[input] = this.product.id
    })
    this.productForm.reset(defaultValues)
  }

  updateDate(name: string, nameToUpdate: string) {
    //Valida modificacion de la fecha
    if (this.disabledInputs && this.disabledInputs?.length > 0) {
      this.checkDateField()
    }


    const inputDate = new Date(this.productForm.get(name)?.value + 'T00:00:00Z');
    const utcYear = inputDate.getUTCFullYear();
    const utcMonth = inputDate.getUTCMonth();
    const utcDate = inputDate.getUTCDate();
    const newDate = new Date(Date.UTC(utcYear + 1, utcMonth, utcDate));
    const year = newDate.getUTCFullYear();
    const month = ('0' + (newDate.getUTCMonth() + 1)).slice(-2);
    const day = ('0' + newDate.getUTCDate()).slice(-2);
    const formattedDate = `${year}-${month}-${day}`;
    this.productForm.get(nameToUpdate)?.setValue(formattedDate);
  }

  checkDateField = () => {
    this.productForm.get('date_release')?.addValidators(dateValidatorToday);
    this.productForm.get('date_release')?.updateValueAndValidity();
  }
}
