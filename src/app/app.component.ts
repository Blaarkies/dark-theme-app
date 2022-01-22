import { Component } from '@angular/core';
import { ThemeService } from './services/theme.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  preferredTheme$: Observable<string>;

  constructor(private themeService: ThemeService) {
    this.preferredTheme$ = themeService.themeChange$;
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }

}
