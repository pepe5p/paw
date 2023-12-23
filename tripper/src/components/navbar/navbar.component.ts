import { Component } from '@angular/core';
import {RouterLink, RouterLinkActive, RouterOutlet} from "@angular/router";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  providers: [RouterLink, RouterLinkActive],
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {}
