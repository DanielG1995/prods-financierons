import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

const timezoneOffset = 5;

export function dateValidatorToday(control: AbstractControl): ValidationErrors | null {
    if (!control?.value) {
        return null
    }
    const selectedDate = new Date(control.value)
    const inputDate = new Date(selectedDate.getTime() + timezoneOffset * 60 * 60 * 1000);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    console.log({ today, inputDate })
    if (inputDate < today) {
        return { dateInvalidToday: true };
    }
    return null;
}
