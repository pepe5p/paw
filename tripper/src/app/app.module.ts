import {NgModule} from "@angular/core";
import {AngularFireModule} from "@angular/fire/compat";
import {environment} from "../environments/environment";
import {AngularFirestoreModule} from "@angular/fire/compat/firestore";
import {CurrencyConversionPipe} from "../pipes/currency-conversion.pipe";
import {SearchPipe} from "../pipes/search.pipe";
import {NavbarComponent} from "../components/navbar/navbar.component";
import {TripsComponent} from "../components/trips/trips.component";
import {CreateTripComponent} from "../components/create-trip/create-trip.component";
import {BasketComponent} from "../components/basket/basket.component";
import {HomeComponent} from "../components/home/home.component";
import {StarRatingComponent} from "../components/star-rating/star-rating.component";
import {TripsFiltersComponent} from "../components/trips-filters/trips-filters.component";
import {BrowserModule} from "@angular/platform-browser";
import {AppRoutingModule} from "./app.routes";
import {AppComponent} from "./app.component";


@NgModule({
  declarations: [
    AppComponent,
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
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }
