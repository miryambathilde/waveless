import {
  ChangeDetectionStrategy,
  Component,
  DOCUMENT,
  ElementRef,
  effect,
  inject,
  signal,
  viewChild,
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
  private restoreFocusTo: HTMLElement | null = null;

  protected readonly isMobileOpen = signal(false);
  protected readonly mobileDialog = viewChild<ElementRef<HTMLElement>>('mobileDialog');
  protected readonly mobileClose = viewChild<ElementRef<HTMLButtonElement>>('mobileClose');

  constructor() {
    effect(() => {
      const open = this.isMobileOpen();
      this.doc.documentElement.classList.toggle('is-nav-open', open);

      if (open) {
        this.restoreFocusTo = this.doc.activeElement instanceof HTMLElement ? this.doc.activeElement : null;
        queueMicrotask(() => this.mobileClose()?.nativeElement.focus());
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

  onOverlayClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.close();
    }
  }

  onMobileKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.close();
      return;
    }

    if (event.key === 'Tab') {
      this.trapFocus(event);
    }
  }

  onNavigate(): void {
    this.close();
  }

  private trapFocus(event: KeyboardEvent): void {
    const root = this.mobileDialog()?.nativeElement;
    if (!root) return;

    const focusableNodes = root.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
    );
    const focusable = Array.from(focusableNodes).filter(
      (el) => !el.hasAttribute('hidden') && el.offsetParent !== null,
    );
    if (focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const active = this.doc.activeElement;

    if (event.shiftKey && active === first) {
      event.preventDefault();
      last.focus();
      return;
    }

    if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    }
  }
}
