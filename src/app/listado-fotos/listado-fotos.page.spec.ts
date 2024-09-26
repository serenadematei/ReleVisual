import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListadoFotosPage } from './listado-fotos.page';

describe('ListadoFotosPage', () => {
  let component: ListadoFotosPage;
  let fixture: ComponentFixture<ListadoFotosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ListadoFotosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
