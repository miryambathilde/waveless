import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';

export type HeroSlide = {
  id: string;
  title: string;
  subtitle: string;
  ctaLabel: string;
  // ruta relativa a /assets, ej: 'assets/images/icons/backgrounds/fondo-hero.png'
  imageUrl: string;
};

@Component({
  selector: 'app-hero-slider',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './hero-slider.html',
  styleUrl: './hero-slider.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeroSliderComponent {
  private readonly destroyRef = inject(DestroyRef);

  readonly slides = input.required<HeroSlide[]>();
  readonly autoplayMs = input<number>(5500);

  protected readonly index = signal(0);
  protected readonly isPaused = signal(false);

  protected readonly activeSlide = computed(() => {
    const s = this.slides();
    if (s.length === 0) return null;
    const i = Math.min(Math.max(this.index(), 0), s.length - 1);
    return s[i];
  });

  private intervalId: number | null = null;

  constructor() {
    effect(() => {
      // reinicia autoplay cuando cambian slides / pausa / ms
      this.clearTimer();

      const s = this.slides();
      if (!s?.length) return;
      if (this.isPaused()) return;

      const ms = this.autoplayMs();
      this.intervalId = globalThis.setInterval(() => this.next(), ms);

      this.destroyRef.onDestroy(() => this.clearTimer());
    });
  }

  protected prev(): void {
    const s = this.slides();
    if (!s.length) return;
    this.index.update((i) => (i - 1 + s.length) % s.length);
  }

  protected next(): void {
    const s = this.slides();
    if (!s.length) return;
    this.index.update((i) => (i + 1) % s.length);
  }

  protected goTo(i: number): void {
    const s = this.slides();
    if (!s.length) return;
    this.index.set(Math.max(0, Math.min(i, s.length - 1)));
  }

  protected pause(): void {
    this.isPaused.set(true);
  }

  protected resume(): void {
    this.isPaused.set(false);
  }

  private clearTimer(): void {
    if (this.intervalId != null) {
      globalThis.clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}
