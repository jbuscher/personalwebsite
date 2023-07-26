import { Component, OnInit } from '@angular/core';
import * as TwoWrapper from 'two.js'
import { Group } from 'two.js/src/group';
import { Circle } from 'two.js/src/shapes/circle';
import { Line } from 'two.js/src/shapes/line';
import { DrawingManager } from './drawingManger';
const Two = TwoWrapper.default;

@Component({
  selector: 'app-golf',
  templateUrl: './golf.component.html',
  styleUrls: ['./golf.component.css']
})
export class GolfComponent implements OnInit {
  two : TwoWrapper.default | undefined;
  drawingManager: DrawingManager | undefined;

  constructor() {
    console.log('hello, golf')
  }

  ngOnInit(): void {
    this.two = new Two({
      width: 200,
      height: 150,
      autostart: true
    }).appendTo(document.getElementById("wrapper")!);
    this.drawingManager = new DrawingManager(this.two);
  }
}