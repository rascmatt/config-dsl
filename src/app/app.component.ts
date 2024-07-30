import {Component} from '@angular/core';
import {ClarityIcons, detailsIcon} from "@cds/core/icon";

ClarityIcons.addIcons(detailsIcon);

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Config DSL';

  compiled = '';

  onInputChanged(value: string) {
    console.log(value);
    // TODO: implement translation
    this.compiled = value;
  }

}
