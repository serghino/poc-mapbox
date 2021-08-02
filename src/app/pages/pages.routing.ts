import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { NavigationComponent } from './navigation/navigation.component';

const routes: Routes = [
    { 
        path: 'dashboard', 
        component: NavigationComponent,
        // canActivate: [ AuthGuard ],
        // CanLoad it's necessary when I use loadChildren.
        // canLoad: [ AuthGuard ],
        loadChildren: () => import('./child-routes.module').then( m => m.ChildRoutesModule )
    },
];

@NgModule({
    imports: [ RouterModule.forChild(routes) ],
    exports: [ RouterModule ]
})
export class PagesRoutingModule {}


