import {RouterModule, Routes} from '@angular/router';
import {GalleryComponent} from "../components/gallery/gallery.component";
import {HomeComponent} from "../components/home/home.component";
import {PostsComponent} from "../components/posts/posts.component";
import {PhotoComponent} from "../components/photo/photo.component";
import {NgModule} from "@angular/core";
export const routes: Routes = [
  {path: "", redirectTo: "home", pathMatch: "full"},
  {path: "home", component: HomeComponent},
  {path: "gallery", component: GalleryComponent},
  {path: "gallery/:id", component: PhotoComponent},
  {path: "posts", component: PostsComponent},
  {path: "**", redirectTo: "home"}
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
