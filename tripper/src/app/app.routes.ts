import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from "../components/home/home.component";
import {NgModule} from "@angular/core";
import {TripsComponent} from "../components/trips/trips.component";
export const routes: Routes = [
  {path: "", component: HomeComponent},
  {path: "trips", component: TripsComponent},
  {path: "**", redirectTo: "trips"}
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
