import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from "../components/home/home.component";
import {NgModule} from "@angular/core";
import {TripListComponent} from "../components/trip-list/trip-list.component";
import {CreateTripComponent} from "../components/create-trip/create-trip.component";
import {BasketComponent} from "../components/basket/basket.component";
import {AngularFireModule} from "@angular/fire/compat";
import {environment} from '../environments/environment';
import {HistoryComponent} from "../components/history/history.component";
import {TripDetailComponent} from "../components/trip-detail/trip-detail.component";

export const routes: Routes = [
  {path: "", component: HomeComponent},
  {path: "trips", component: TripListComponent},
  {path: "trips/:id", component: TripDetailComponent},
  {path: "create-trip", component: CreateTripComponent},
  {path: "basket", component: BasketComponent},
  {path: "history", component: HistoryComponent},
  {path: "**", redirectTo: ""}
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    AngularFireModule.initializeApp(environment.firebaseConfig),
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
