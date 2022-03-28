import { Component, OnInit } from '@angular/core';

interface MenuItem {
  name: string;
  route: string;
}

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
})
export class MenuComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}

  menuItems: MenuItem[] = [
    { name: 'Full Screen', route: './maps/fullscreen' },
    { name: 'Zoom Range', route: './maps/zoom-range' },
    { name: 'Marcadores', route: './maps/markers' },
    { name: 'Propiedades', route: './maps/properties' },
  ];
}
