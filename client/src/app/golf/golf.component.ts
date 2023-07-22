import { Component } from '@angular/core';

@Component({
  selector: 'app-golf',
  templateUrl: './golf.component.html',
  styleUrls: ['./golf.component.css']
})
export class GolfComponent {

  constructor() {
    console.log('hello, golf')
  }
}