import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { EMPTY_MESSAGE } from '../../../utils';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.css'
})
export class AlertComponent implements OnChanges {
  @Input() message: { text: string, type: 'success' | 'error', timestamp: number } = EMPTY_MESSAGE

  ngOnChanges(changes: SimpleChanges) {
    console.log(this.message)
    if (changes['message']) {
      setTimeout(() => {
        this.message.text = ''
      }, 3000);
    }
  }

}
