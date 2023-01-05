import { Component, OnInit } from '@angular/core';
import { BundleManagerService } from '../bundle-manager.service';

@Component({
  selector: 'app-chaos',
  templateUrl: './chaos.component.html',
  styleUrls: ['./chaos.component.css']
})
export class ChaosComponent implements OnInit {

  constructor(private bundleService: BundleManagerService) {
      this.bundleService = bundleService
   }

  ngOnInit(): void {
    this.bundleService.loadChaos();
  }

}
