import {AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import * as ace from "ace-builds";
import {Ace} from "ace-builds";
import Editor = Ace.Editor;

@Component({
  selector: 'app-dsl-editor',
  templateUrl: './dsl-editor.component.html',
  styleUrl: './dsl-editor.component.scss'
})
export class DslEditorComponent implements AfterViewInit {

  @ViewChild("editor") private editorRef: ElementRef<HTMLElement> = {} as ElementRef<HTMLElement>;

  @Input() title: string = 'DSL Editor';
  @Input() mode: string = 'ace/mode/json';

  @Output() valueChange = new EventEmitter<string>();
  private _value: string = '';

  editor: Ace.Editor = {} as Editor;

  get value(): string {
    return this._value;
  }

  @Input()
  set value(value: string) {
    this._value = value;
    if (this.editor) {
      this.editor.setValue(value);
      this.editor.clearSelection();
    }
  }

  ngAfterViewInit(): void {
    ace.config.set('basePath', 'https://unpkg.com/ace-builds@1.4.12/src-noconflict');

    this.editor = ace.edit(this.editorRef.nativeElement);
    this.editor.setTheme("ace/theme/textmate");
    this.editor.session.setMode(this.mode);
    this.editor.setOptions({
      fontSize: "14px",
      showPrintMargin: false,
      showLineNumbers: true,
      tabSize: 2,
    });

    this.editor.setValue(this._value);
    this.editor.clearSelection();
    this.editor.focus();

    this.editor.on('change', () => {
      this._value = this.editor.getValue();
      this.valueChange.emit(this._value);
    });
  }

}
