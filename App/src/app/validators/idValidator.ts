import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { ProductsService } from '../services/products.service';
import { catchError, map, Observable, of } from 'rxjs';

export function idValidator(productService: ProductsService): AsyncValidatorFn {
    return (formGroup: AbstractControl): Observable<ValidationErrors | null> => {
        return productService.validateId(formGroup.value).pipe(
            map(response => response ? { duplicatedId: true } : null),
            catchError(() => of(null))
        )

    };
}