import { Component, EventEmitter, Input, Output, inject } from "@angular/core";
import { RouterLink } from "@angular/router";
import {Actor} from "./model";

@Component({
  selector: "actor",
  templateUrl: "./actor.component.html",
  imports: [RouterLink],
  standalone: true,
})
export class ArticleCommentComponent {
  @Input() actor!: Actor;
  firstName: string = this.actor.firstName;
  lastName: string = this.actor.lastName;
  bestFilm: string = this.actor.bestFilm;
}
