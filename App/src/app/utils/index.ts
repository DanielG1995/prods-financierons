import { timestamp } from "rxjs"

export const EMPTY_PRODUCT = {
    id: '',
    name: '',
    description: '',
    logo: '',
    date_revision: undefined,
    date_release: undefined,
}

export const EMPTY_MESSAGE = {
    text: '',
    type: 'success' as 'success' | 'error',
    timestamp: 0
}

export const DATE_FORMAT = 'en-CA'