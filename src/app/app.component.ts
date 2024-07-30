import {Component} from '@angular/core';
import {ClarityIcons, detailsIcon} from "@cds/core/icon";
import {Semantics} from "ohm-js";
import {grammar} from "./dsl/dsl-grammar";
import {semantics} from "./dsl/dsl-semantics";

ClarityIcons.addIcons(detailsIcon);

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  title = 'Config DSL';
  transform!: Semantics;

  translated = '';

  constructor() {
    // Create the semantics
    this.transform = grammar.createSemantics().addAttribute('metadata', semantics);
  }

  onInputChanged(value: string) {
    const m = grammar.match(value);
    if (m.succeeded()) {
      const value = this.transform(m)['metadata'];
      this.translated = JSON.stringify(value, null, 2);
    } else {
      console.log(m.message);
    }
  }

}
