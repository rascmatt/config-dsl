import { Component } from '@angular/core';
import {CdsIcon, detailsIcon} from "@cds/core/icon";

CdsIcon.bind(detailsIcon);

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Config DSL';
}
