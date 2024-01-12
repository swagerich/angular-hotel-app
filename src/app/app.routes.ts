import { Routes } from '@angular/router';

export const routes: Routes = [

    {
        path:'admin',
        children:[
            {
                path:'admin-home',
                loadComponent:() => import('./hotel/pages/admin/admin-home/admin-home.component').then(m => m.AdminHomeComponent),
                
            },
        ]
    },
    {
        path:'user',
        children:[  
            {
                path:'user-home',
                loadComponent:() => import('./hotel/pages/user/user-home/user-home.component')
            },
            {
                path:'list-client',
                loadComponent:() => import('./hotel/pages/user/clients/list-client/list-client.component')
            }, 
            {
                path:'list-room-type',
                loadComponent:() => import('./hotel/pages/user/rooms-type/list-rooms-type/list-rooms-type.component')
            },
            {
                path:'list-rooms',
                loadComponent:() => import('./hotel/pages/user/rooms/list-rooms/list-rooms.component')
            },
            {
                path:'list-bookings',
                loadComponent:() => import('./hotel/pages/user/bookings/list-bookings/list-bookings.component')
            },
        ]
    },
    {
        path:'**',
        redirectTo:'user/list-client',
        pathMatch: 'full',
    }
   
];
