import { AbstractControl, ValidatorFn } from '@angular/forms';

export function dateComparisonValidator(): ValidatorFn {
  return (formGroup: AbstractControl): { [key: string]: any } | null => {
    const dateRelease = formGroup.get('date_release')?.value;
    const dateRevision = formGroup.get('date_revision')?.value;
    if (dateRelease && dateRevision && new Date(dateRelease) > new Date(dateRevision)) {
      return { 'dateComparison': 'La fecha de revisión no puede ser menor a la fecha de liberación' };
    }
    return null;
  };
}