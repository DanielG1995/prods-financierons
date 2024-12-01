import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { debounceTime, Subject, Subscription } from 'rxjs';
import { ProductsService } from '../../../services/products.service';

@Component({
  selector: 'app-search-input',
  standalone: true,
  imports: [FormsModule, RouterModule],
  templateUrl: './search-input.component.html',
  styleUrl: './search-input.component.css'
})
export class SearchInputComponent {
  textValue: string = ''
  private route = inject(ActivatedRoute)
  private router = inject(Router)
  private productService = inject(ProductsService)
  private debounceSubject = new Subject<string>();
  private debounceSubscription: Subscription = new Subscription();
  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.textValue = params['q'] || '';
    });
    this.debounceSubscription = this.debounceSubject.pipe(
      debounceTime(300)).subscribe((q: string) => {
        this.productService.filterProducts(q);
      });
  }
  ngOnDestroy() {
    this.debounceSubscription.unsubscribe();
  }

  onTextChange(q: string) {
    this.textValue = q;
    this.debounceSubject.next(q);
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: q.trim() !== '' ? { q } : {},
      replaceUrl: true
    });


  }

}
