import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth-guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'tabs/home',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./authenticate-page/authenticate-page.component').then(
        (m) => m.AuthenticatePageComponent,
      ),
  },
  {
    path: 'create-trip',
    loadComponent: () =>
      import('./create-trip/create-trip.page').then((m) => m.CreateTripPage),
    canActivate: [AuthGuard],
  },

  // 2. HỆ THỐNG TABS CHÍNH
  {
    path: 'tabs',
    loadComponent: () => import('./tabs/tabs.page').then((m) => m.TabsPage),
    children: [
      {
        path: 'home',
        loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
      },
      {
        path: 'explore',
        loadComponent: () =>
          import('./explore/explore.page').then((m) => m.ExplorePage),
        canActivate: [AuthGuard],
      },
      {
        path: 'saved-trips',
        loadComponent: () =>
          import('./saved-trips/saved-trips.page').then(
            (m) => m.SavedTripsPage,
          ),
        canActivate: [AuthGuard],
      },
      {
        path: 'user-profile',
        loadComponent: () =>
          import('./user-profile/user-profile.page').then(
            (m) => m.UserProfilePage,
          ),
        canActivate: [AuthGuard],
      },
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: 'trip-detail/:id',
    loadComponent: () =>
      import('./trip-detail/trip-detail.page').then((m) => m.TripDetailPage),
  },
];
