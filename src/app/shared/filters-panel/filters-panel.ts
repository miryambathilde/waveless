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

export interface FiltersState {
  durations: TripDuration[];
  priceMin: number | null;
  priceMax: number | null;
}

const DEFAULT_FILTERS: FiltersState = {
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

  protected readonly durations = signal<TripDuration[]>([]);
  protected readonly priceMin = signal<number | null>(null);
  protected readonly priceMax = signal<number | null>(null);

  protected readonly state = computed<FiltersState>(() => ({
    durations: this.durations(),
    priceMin: this.priceMin(),
    priceMax: this.priceMax(),
  }));

  ngOnInit(): void {
    const init = this.initial();
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

  protected setPriceMin(value: string): void {
    this.priceMin.set(value.trim() === '' ? null : Number(value));
    this.emit();
  }

  protected setPriceMax(value: string): void {
    this.priceMax.set(value.trim() === '' ? null : Number(value));
    this.emit();
  }

  protected clear(): void {
    this.durations.set([]);
    this.priceMin.set(null);
    this.priceMax.set(null);
    this.emit();
  }

  private emit(): void {
    this.filtersChange.emit(this.state());
  }
}
