import { Routes } from '@angular/router';
import { NewProductComponent } from './pages/new-product/new-product.component';
import { EditProductComponent } from './pages/edit-product/edit-product.component';
import { ProductsComponent } from './pages/products/products.component';

export const routes: Routes = [
    { path: 'products', component: ProductsComponent, pathMatch: 'full' },
    { path: 'new-product', component: NewProductComponent, pathMatch: 'full' },
    { path: 'edit-product/:id', component: EditProductComponent, pathMatch: 'full' }
    , {
        path: '**', redirectTo: 'products', pathMatch: 'full'
    }
];
