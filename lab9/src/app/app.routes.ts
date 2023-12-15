import {RouterModule, Routes} from '@angular/router';
import {PhotosComponent} from "../components/photos/photos.component";
import {HomeComponent} from "../components/home/home.component";
import {WpisyComponent} from "../components/wpisy/wpisy.component";
import {SinglePhotoComponent} from "../components/single-photo/single-photo.component";
import {NgModule} from "@angular/core";
export const routes: Routes = [
  {path: "", component: HomeComponent},
  {path: "photos", component: PhotosComponent},
  {path: "photos/:id", component: SinglePhotoComponent},
  {path: "wpisy", component: WpisyComponent}
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
