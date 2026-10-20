import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Cricket } from './cricket';

describe('Cricket', () => {
  let component: Cricket;
  let fixture: ComponentFixture<Cricket>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Cricket],
    }).compileComponents();

    fixture = TestBed.createComponent(Cricket);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
