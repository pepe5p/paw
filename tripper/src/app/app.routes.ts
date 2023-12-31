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
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {MatNativeDateModule} from "@angular/material/core";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatButtonModule} from "@angular/material/button";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatMomentDateModule} from "@angular/material-moment-adapter";

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
    BrowserAnimationsModule,
    MatDatepickerModule,
    MatButtonModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatMomentDateModule,
    RouterModule.forRoot(routes),
    AngularFireModule.initializeApp(environment.firebaseConfig),
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
