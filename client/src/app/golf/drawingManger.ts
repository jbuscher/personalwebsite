import { Component, OnInit } from '@angular/core';
import * as Two from 'two.js'
import { Group } from 'two.js/src/group';
import { Circle } from 'two.js/src/shapes/circle';
import { Line } from 'two.js/src/shapes/line';
import { Vector } from 'two.js/src/vector';


export interface Edge {
    line: Line,
    start: Circle,
    end: Circle | undefined
  }

export class DrawingManager {

    two: Two.default
    mouseVector = new Vector(0, 0);
    isDraggingCircle = false;
    activeCircle: Circle | undefined; // the circle being hovered or dragged
    pendingLine: Edge | undefined;
    matchedCircles: Circle[] = [];

    Edges: Edge[] = [];
    Nodes: Circle[] = [];

    constructor(two: Two.default) {
        this.two = two;
        
        this.two!.renderer.domElement.addEventListener("mousemove", (e: MouseEvent) => this.onMouseMove(e))
        this.two!.renderer.domElement.addEventListener("mousedown", (e: MouseEvent) => this.onMouseDown(e))
        this.two!.renderer.domElement.addEventListener("mouseup", (e: MouseEvent) => this.onMouseUp(e))
    }

    clear() {
        this.two.clear();
    }
    
    onMouseMove(event: MouseEvent) {
        this.mouseVector.x = event.offsetX;
        this.mouseVector.y = event.offsetY;
        this.matchedCircles = [];
        const eps = 144;
        let min = eps+1;
        let closestCircle: Circle | undefined;

        this.Nodes.forEach(c => {
            const dist = c.position.distanceToSquared(this.mouseVector)
            c.linewidth = 2;
            if (dist < eps) {
                this.matchedCircles.push(c);
                c.linewidth = 5;
                if (dist < min) {
                    min = dist;
                    closestCircle = c;
                }
            }
        });

        if (this.isDraggingCircle) {
            this.activeCircle!.translation.set(this.mouseVector.x, this.mouseVector.y);
            this.Edges.forEach(l => {
                if (l.start === this.activeCircle) {
                    l.line.vertices[0].set(this.mouseVector.x, this.mouseVector.y)
                } else if (l.end === this.activeCircle) {
                    l.line.vertices[1].set(this.mouseVector.x, this.mouseVector.y)
                }
            })
            return;
        }

        if (!!closestCircle) {
            this.two!.renderer.domElement.style.cursor = 'pointer'
        } else {
            this.two!.renderer.domElement.style.cursor = 'default'
        }
        this.activeCircle = closestCircle

        if (!!this.pendingLine) {
            this.pendingLine.line.vertices[1].set(this.mouseVector.x, this.mouseVector.y)
        }
    }
    
    onMouseDown(event: MouseEvent) {
        if (this.activeCircle) {
          this.isDraggingCircle = true;
          return;
        }
        let circle = this.two!.makeCircle(this.mouseVector.x, this.mouseVector.y, 5);
        circle.fill = '#FF8000';
        circle.stroke = 'orangered';
        circle.linewidth = 2;
        this.Nodes.push(circle);

        let line = this.two?.makeLine(this.mouseVector.x, this.mouseVector.y, this.mouseVector.x, this.mouseVector.y)
        this.pendingLine = {line, start: circle, end:undefined}
    }
    
    onMouseUp(event: MouseEvent) {
        if (this.isDraggingCircle) {
          this.isDraggingCircle = false;
          console.log(this.matchedCircles.length)
          if (this.matchedCircles.length > 1) {
            this.mergeCircles(Array.from(this.matchedCircles));
        }
          return;
        }

        if (!this.pendingLine) {
            return;
        }

        let circle = this.two!.makeCircle(this.mouseVector.x, this.mouseVector.y, 5);
        circle.fill = '#1199ff';
        circle.stroke = 'blue';
        circle.linewidth = 2;
        this.Nodes.push(circle);
        
        this.pendingLine.end = circle
        this.Edges.push(this.pendingLine);
        this.pendingLine = undefined;
    }

    mergeCircles(circles: Circle[]) {
        let masterCircle = circles[0];
        for (let i = 1; i < circles.length; i++) {
            let c = circles[i];
            for (let e of this.Edges) {
                if (e.start === c) {
                    e.start = masterCircle;
                    e.line.vertices[0].set(masterCircle.position.x, masterCircle.position.y);
                } 
                if (e.end === c) {
                    e.end = masterCircle;
                    e.line.vertices[1].set(masterCircle.position.x, masterCircle.position.y);
                }
                if (e.end === e.start) { // node pointing two itself, kill it
                    const index = this.Nodes.indexOf(e.end);
                    e.end.remove();
                    if (index > -1) {
                        this.Nodes.splice(index, 1);
                    }
                }
                const index = this.Nodes.indexOf(c);
                c.remove();
                if (index > -1) {
                    this.Nodes.splice(index, 1);
                }
            }
        }
    }
}