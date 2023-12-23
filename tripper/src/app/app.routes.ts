import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from "../components/home/home.component";
import {TripsComponent} from "../components/trips/trips.component";
import {CreateTripComponent} from "../components/create-trip/create-trip.component";
import {BasketComponent} from "../components/basket/basket.component";
import {NgModule} from "@angular/core";
import {AngularFireModule} from "@angular/fire/compat";
import {environment} from "../environments/environment";
import {AngularFirestoreModule} from "@angular/fire/compat/firestore";
import {NavbarComponent} from "../components/navbar/navbar.component";
import {StarRatingComponent} from "../components/star-rating/star-rating.component";
import {NgClass, NgForOf, NgIf, NgOptimizedImage, UpperCasePipe} from "@angular/common";
import {CurrencyConversionPipe} from "../pipes/currency-conversion.pipe";
import {TripsFiltersComponent} from "../components/trips-filters/trips-filters.component";
import {SearchPipe} from "../pipes/search.pipe";
import {ReactiveFormsModule} from "@angular/forms";

export const routes: Routes = [
  {path: "", component: HomeComponent},
  {path: "trips", component: TripsComponent},
  {path: "create-trip", component: CreateTripComponent},
  {path: "basket", component: BasketComponent},
  {path: "**", redirectTo: "trips"}
];

@NgModule({
  imports: [
    RouterModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    UpperCasePipe,
    NgClass,
    NgOptimizedImage,
    NgForOf,
    NgIf,
    ReactiveFormsModule,
  ],
  declarations: [
    CurrencyConversionPipe,
    SearchPipe,
    NavbarComponent,
    TripsComponent,
    CreateTripComponent,
    BasketComponent,
    HomeComponent,
    StarRatingComponent,
    TripsFiltersComponent,
    SearchPipe,
    CurrencyConversionPipe,
  ],
  exports: [
    NavbarComponent
  ]
})
export class AppRoutingModule { }
