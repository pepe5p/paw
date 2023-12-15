import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WpisyComponent } from './wpisy.component';

describe('WpisyComponent', () => {
  let component: WpisyComponent;
  let fixture: ComponentFixture<WpisyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WpisyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WpisyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
