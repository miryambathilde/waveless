import {
  ChangeDetectionStrategy,
  Component,
  DOCUMENT,
  effect,
  HostListener,
  inject,
  signal,
} from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, NgOptimizedImage],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Navbar {
  private readonly doc = inject(DOCUMENT);
  private readonly mobileBreakpoint = 900;
  private restoreFocusTo: HTMLElement | null = null;

  protected readonly isMobileOpen = signal(false);

  constructor() {
    effect(() => {
      const open = this.isMobileOpen();
      this.doc.documentElement.classList.toggle('is-nav-open', open);

      if (open) {
        this.restoreFocusTo = this.doc.activeElement instanceof HTMLElement ? this.doc.activeElement : null;
        return;
      }

      this.restoreFocusTo?.focus();
      this.restoreFocusTo = null;
    });
  }

  toggle(): void {
    this.isMobileOpen.update((v) => !v);
  }

  close(): void {
    this.isMobileOpen.set(false);
  }

  onNavigate(): void {
    this.close();
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.close();
  }

  @HostListener('window:resize')
  onResize(): void {
    const viewportWidth = this.doc.defaultView?.innerWidth ?? 0;
    if (viewportWidth > this.mobileBreakpoint && this.isMobileOpen()) {
      this.close();
    }
  }
}
