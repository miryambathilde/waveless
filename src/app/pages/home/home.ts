import {
  ChangeDetectionStrategy,
  Component,
  DOCUMENT,
  ElementRef,
  computed,
  effect,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { CardComponent } from '@shared/card/card';
import {
  FiltersPanelComponent,
  FiltersState,
  TripDuration,
} from '@shared/filters-panel/filters-panel';
import { HeroSlide, HeroSliderComponent } from '@shared/hero-slider/hero-slider';

type Trip = {
  id: number;
  title: string;
  description: string;
  priceValue: number;
  image: string;
  durationBucket?: TripDuration;
};

type TripForLayout = Trip & {
  trackId: string;
};

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CardComponent, FiltersPanelComponent, HeroSliderComponent],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePage {
  private readonly doc = inject(DOCUMENT);
  private readonly priceFormatter = new Intl.NumberFormat('es-ES', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  private restoreFocusTo: HTMLElement | null = null;

  readonly filters = signal<FiltersState>({
    durations: [],
    priceMin: null,
    priceMax: null,
  });
  readonly isFiltersOpen = signal(false);

  protected readonly filtersDialog = viewChild<ElementRef<HTMLElement>>('filtersDialog');
  protected readonly filtersClose = viewChild<ElementRef<HTMLButtonElement>>('filtersClose');

  readonly heroSlides = signal<HeroSlide[]>([
    {
      id: 'australia',
      title: 'Ruta por Australia',
      subtitle: 'Si te va la aventura, no te lo puedes perder',
      ctaLabel: 'Mas informacion',
      imageUrl: 'assets/images/backgrounds/fondo-hero.png',
    },
    {
      id: 'asia',
      title: 'Viaje por Asia',
      subtitle: 'Explora culturas unicas y paisajes increibles',
      ctaLabel: 'Mas informacion',
      imageUrl: 'assets/images/backgrounds/fondo-hero.png',
    },
    {
      id: 'europa',
      title: 'Escapadas por Europa',
      subtitle: 'Ciudades con encanto para cualquier epoca del ano',
      ctaLabel: 'Mas informacion',
      imageUrl: 'assets/images/backgrounds/fondo-hero.png',
    },
  ]);

  private readonly allTrips = signal<Trip[]>([
    {
      id: 1,
      description: 'Marruecos, Africa',
      durationBucket: '9',
      title: 'Descubre Bangkok con Iberojet',
      priceValue: 248,
      image: '/assets/images/cards/marruecos_1.png',
    },
    {
      id: 2,
      description: 'Marruecos, Africa',
      durationBucket: '9',
      title: 'Descubre Bangkok con Iberojet',
      priceValue: 248,
      image: '/assets/images/cards/marruecos_2.png',
    },
    {
      id: 3,
      description: 'Marruecos, Africa',
      durationBucket: '9',
      title: 'Descubre Bangkok con Iberojet',
      priceValue: 248,
      image: '/assets/images/cards/marruecos_3.png',
    },
  ]);

  readonly trips = computed(() => {
    const { durations, priceMin, priceMax } = this.filters();

    return this.allTrips().filter((trip) => {
      const matchDuration =
        durations.length === 0 ||
        (trip.durationBucket != null && durations.includes(trip.durationBucket));

      const matchMin = priceMin == null || trip.priceValue >= priceMin;
      const matchMax = priceMax == null || trip.priceValue <= priceMax;

      return matchDuration && matchMin && matchMax;
    });
  });

  readonly tripsForLayout = computed<TripForLayout[]>(() => {
    const base = this.trips();
    const repeatCount = 3;

    return Array.from({ length: repeatCount }, (_, repeatIndex) =>
      base.map((trip, index) => ({ ...trip, trackId: `${repeatIndex}-${index}-${trip.id}` })),
    ).flat();
  });

  constructor() {
    effect(() => {
      const open = this.isFiltersOpen();
      this.doc.documentElement.classList.toggle('is-filters-open', open);

      if (open) {
        this.restoreFocusTo = this.doc.activeElement instanceof HTMLElement ? this.doc.activeElement : null;
        queueMicrotask(() => this.filtersClose()?.nativeElement.focus());
        return;
      }

      this.restoreFocusTo?.focus();
      this.restoreFocusTo = null;
    });
  }

  formatPrice(value: number): string {
    return `${this.priceFormatter.format(value)} \u20AC`;
  }

  onFiltersChange(next: FiltersState): void {
    this.filters.set(next);
  }

  openFilters(): void {
    this.isFiltersOpen.set(true);
  }

  closeFilters(): void {
    this.isFiltersOpen.set(false);
  }

  onFiltersOverlayClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.closeFilters();
    }
  }

  onFiltersKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.closeFilters();
      return;
    }

    if (event.key === 'Tab') {
      this.trapFocus(event);
    }
  }

  private trapFocus(event: KeyboardEvent): void {
    const root = this.filtersDialog()?.nativeElement;
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
