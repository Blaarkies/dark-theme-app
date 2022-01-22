import { Injectable } from '@angular/core';
import { OverlayContainer } from '@angular/cdk/overlay';
import { BehaviorSubject } from 'rxjs';

export enum ThemeTypeEnum {
  Light = 'light-theme',
  Dark = 'dark-theme',
}

const userThemePreferenceKey = 'angular-material-user-theme-preference';
const themeToggleMap = {
  [ThemeTypeEnum.Light]: ThemeTypeEnum.Dark,
  [ThemeTypeEnum.Dark]: ThemeTypeEnum.Light,
}
const themes: string[] = Object.values(ThemeTypeEnum);

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  #currentTheme: ThemeTypeEnum;
  themeChange$ = new BehaviorSubject<ThemeTypeEnum>(ThemeTypeEnum.Light);

  constructor(private overlayContainer: OverlayContainer) {
    let preferredTheme = this.detectThemePreference();
    this.setNewTheme(preferredTheme);
  }

  private detectThemePreference(): ThemeTypeEnum {
    let localPreference = localStorage.getItem(userThemePreferenceKey) as ThemeTypeEnum;
    if (localPreference && themes.includes(localPreference)) {
      return localPreference;
    }

    const browserPreferenceDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return browserPreferenceDarkMode ? ThemeTypeEnum.Dark : ThemeTypeEnum.Light;
  }

  private setNewTheme(theme: ThemeTypeEnum) {
    this.setThemeOnElement(document.body, theme);
    this.setThemeOnElement(this.overlayContainer.getContainerElement(), theme);

    localStorage.setItem(userThemePreferenceKey, theme);
    this.#currentTheme = theme;
    this.themeChange$.next(theme);
  }

  private setThemeOnElement(element: HTMLElement, theme: ThemeTypeEnum) {
    let classList = element.classList;

    Array.from(classList)
      .filter(c => themes.includes(c))
      .forEach(c => classList.remove(c));

    classList.add(theme);
  }

  toggleTheme(): ThemeTypeEnum {
    let newTheme = themeToggleMap[this.#currentTheme];
    this.setNewTheme(newTheme);
    return newTheme;
  }

}
