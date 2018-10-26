import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PagesComponent } from './pages.component';
import { HomeComponent } from './home/home.component';
import { ActividadesComponent } from './actividades/actividades.component';
import { ProgramacionComponent } from '../shared/components/programacion/programacion.component';

const routes: Routes = [
    {
        path: '',
        component: PagesComponent,
        children: [
          {
            path: '',
            component: HomeComponent,
            data: { titulo: 'Home'}
          },
          {
            path: 'programas',
            component: ProgramacionComponent,
            data: { titulo: 'Programación'}
          },
          {
            path: 'actividades',
            component: ActividadesComponent,
            data: { titulo: 'Actividades'}
          },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PagesRoutingModule {}
