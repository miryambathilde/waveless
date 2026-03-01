import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  input,
  output,
  signal,
} from '@angular/core';

export type TripDuration = '3-5' | '6-8' | '9' | '9+';
export type TripDestination = 'Tailandia' | 'Marruecos' | 'Japon' | 'Peru' | 'Indonesia';
export type TripAdventure =
  | 'Quads'
  | 'Parapente'
  | 'Rafting'
  | 'Explora'
  | 'Buceo'
  | 'Paracaidas'
  | 'Snowboard'
  | 'Surf';

export interface FiltersState {
  destinations: TripDestination[];
  adventures: TripAdventure[];
  durations: TripDuration[];
  priceMin: number | null;
  priceMax: number | null;
}

const DEFAULT_FILTERS: FiltersState = {
  destinations: [],
  adventures: [],
  durations: [],
  priceMin: null,
  priceMax: null,
};

@Component({
  selector: 'app-filters-panel',
  templateUrl: './filters-panel.html',
  styleUrl: './filters-panel.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FiltersPanelComponent implements OnInit {
  initial = input<FiltersState>(DEFAULT_FILTERS);

  filtersChange = output<FiltersState>();

  protected readonly isDurationOpen = signal(true);
  protected readonly isPriceOpen = signal(true);

  protected readonly destinations = signal<TripDestination[]>([]);
  protected readonly adventures = signal<TripAdventure[]>([]);
  protected readonly durations = signal<TripDuration[]>([]);
  protected readonly priceMin = signal<number | null>(null);
  protected readonly priceMax = signal<number | null>(null);

  protected readonly state = computed<FiltersState>(() => ({
    destinations: this.destinations(),
    adventures: this.adventures(),
    durations: this.durations(),
    priceMin: this.priceMin(),
    priceMax: this.priceMax(),
  }));

  ngOnInit(): void {
    const init = this.initial();
    this.destinations.set(init.destinations ?? []);
    this.adventures.set(init.adventures ?? []);
    this.durations.set(init.durations);
    this.priceMin.set(init.priceMin);
    this.priceMax.set(init.priceMax);
  }

  protected toggleSection(section: 'duration' | 'price'): void {
    if (section === 'duration') this.isDurationOpen.update((v) => !v);
    if (section === 'price') this.isPriceOpen.update((v) => !v);
  }

  protected toggleDuration(value: TripDuration): void {
    this.durations.update((curr) =>
      curr.includes(value) ? curr.filter((v) => v !== value) : [...curr, value],
    );
    this.emit();
  }

  protected toggleDestination(value: TripDestination): void {
    this.destinations.update((curr) =>
      curr.includes(value) ? curr.filter((v) => v !== value) : [...curr, value],
    );
    this.emit();
  }

  protected isDestinationSelected(value: TripDestination): boolean {
    return this.destinations().includes(value);
  }

  protected toggleAdventure(value: TripAdventure): void {
    this.adventures.update((curr) =>
      curr.includes(value) ? curr.filter((v) => v !== value) : [...curr, value],
    );
    this.emit();
  }

  protected isAdventureSelected(value: TripAdventure): boolean {
    return this.adventures().includes(value);
  }

  protected setPriceMin(value: string): void {
    this.priceMin.set(value.trim() === '' ? null : Number(value));
    this.emit();
  }

  protected setPriceMax(value: string): void {
    this.priceMax.set(value.trim() === '' ? null : Number(value));
    this.emit();
  }

  protected clear(): void {
    this.destinations.set([]);
    this.adventures.set([]);
    this.durations.set([]);
    this.priceMin.set(null);
    this.priceMax.set(null);
    this.emit();
  }

  private emit(): void {
    this.filtersChange.emit(this.state());
  }
}
