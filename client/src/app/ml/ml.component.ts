import { Component, ElementRef, OnInit, } from '@angular/core';
import { MlService } from '../services/ml.service';
import * as testdata from './temp/outTestData.json';

@Component({
  selector: 'app-ml',
  templateUrl: './ml.component.html',
  styleUrls: ['./ml.component.css']
})
export class MlComponent implements OnInit {
  cells: any;
  isMouseDown = false;
  result = -1

  constructor(private mlService: MlService) {
    document.body.style.overscrollBehavior = "none"
    this.cells = []
    this.fromArray(testdata)
    this.isMouseDown = false
    addEventListener('mousedown', (event) => {
      this.isMouseDown = true;
    });
    addEventListener('mouseup', (event) => {
      this.isMouseDown = false;
    });
    addEventListener('touchstart', (event) => {
      this.isMouseDown = true;
    });
    addEventListener('touchend', (event) => {
      this.isMouseDown = false;
    });
    addEventListener('touchmove', (event) => {
      this.onCellTouchOver(event)
    });
    addEventListener('touchcancel', (event) => {
      this.isMouseDown = false;
    });
   }

  ngOnInit(): void {
  }

  onSend() {
    let data = []
    for (let i = 0; i < 28; i++) {
      for (let j = 0; j < 28; j++) {
        data.push(this.cells[i][j])
      }
    }
    this.mlService.sendArr(data).subscribe((d) => this.result=d.ans)
  }

  fromArray(arr: any) {
    this.cells = []
    for (let i = 0; i < 28; i++) {
      this.cells.push([])
      for (let j = 0; j < 28; j++) {
        this.cells[i].push(arr[i*28 + j])
      }
    }
    console.log(this.cells)
  }

  onCellMouseOver(e:any) {
    if (this.isMouseDown) {
      let target = document.elementFromPoint(e.clientX, e.clientY)!.classList[1].split("-");
      let x = Number.parseInt(target[0])
      let y = Number.parseInt(target[1])
      this.paintCells(x, y)
    }
  }


  onCellTouchOver(e:any) {
    if (this.isMouseDown && !!e) {
      var myLocation = e.changedTouches[0];
      let target = document.elementFromPoint(myLocation.clientX, myLocation.clientY)?.classList[1].split("-");
      let x = Number.parseInt(target![0])
      let y = Number.parseInt(target![1])
      this.paintCells(x, y)
    }
  }

  paintCells(x: number, y:number) {
    this.cells[x][y] = 1
    this.paintBorderCell(x-1, y)
    this.paintBorderCell(x-1, y-1)
    this.paintBorderCell(x-1, y+1)
    this.paintBorderCell(x+1, y)
    this.paintBorderCell(x+1, y+1)
    this.paintBorderCell(x+1, y-1)
    this.paintBorderCell(x, y-1)
    this.paintBorderCell(x, y+1)
  }

  paintBorderCell(x: number, y:number) {
    if (x < 0 || y < 0 || x > 27 || y > 27) {
      return
    }
    this.cells[x][y]+=.05
    if (this.cells[x][y] > 1) {
      this.cells[x][y] = 1
    }
  }

  onClear() {
    this.result = -1
    this.cells = []
    for (let i = 0; i < 28; i++) {
      this.cells.push([])
      for (let j = 0; j < 28; j++) {
        this.cells[i].push(0)
      }
    }
  }

  getColor(cell: any) {
    return "rgba(0,0,0," + cell + ")";
  }

}
