import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DslEditorComponent } from './dsl-editor.component';

describe('DslEditorComponent', () => {
  let component: DslEditorComponent;
  let fixture: ComponentFixture<DslEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DslEditorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DslEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
