import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ang-personal-website';
  constructor(private http: HttpClient,
    private router: Router) {
    http.get<string>('/api/hello').subscribe((res) => console.log(res));
  }

  ngOnInit(): void {
    this.router.navigateByUrl("posts");
  }
}
