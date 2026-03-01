import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  NgZone,
  ViewChild,
  computed,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { TagComponent } from '@shared/tag/tag';
import { PopoverPriceComponent, type PopoverPriceItem } from '@shared/popover-price/popover-price';
import { CardPopoverCoordinatorService } from '@shared/services/ui/card-popover-coordinator.service';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [TagComponent, PopoverPriceComponent, NgOptimizedImage],
  templateUrl: './card.html',
  styleUrl: './card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.card--popover-open]': 'isPopoverOpen()',
  },
})
export class CardComponent {
  private static nextCardId = 0;

  title = input<string>('');
  description = input<string>('');
  durationBucket = input<string | undefined>(undefined);
  price = input<string>('');
  image = input<string>('');
  tag = input<string>('Quads');

  readonly isPopoverOpen = computed(
    () => this.popoverCoordinator.openCardId() === this.cardId,
  );
  readonly daysLabel = computed(() => {
    const duration = this.durationBucket();
    return duration ? `${duration} d\u00EDas` : '';
  });
  readonly popoverPosition = signal({ left: 0, top: 0 });
  readonly priceBreakdownItems: PopoverPriceItem[] = [
    { label: 'Precio antes de impuestos', value: '1.124,00 \u20AC' },
    { label: 'Impuesto', value: '4,43 \u20AC' },
    { label: 'Lorem ipsum', value: '150,42 \u20AC' },
  ];
  readonly priceBreakdownTotal = '2.455,00 \u20AC';

  @ViewChild('breakdownButton') private readonly breakdownButton?: ElementRef<HTMLButtonElement>;
  @ViewChild('popoverHost', { read: ElementRef })
  private readonly popoverHost?: ElementRef<HTMLElement>;

  private readonly hostEl = inject(ElementRef<HTMLElement>);
  private readonly popoverCoordinator = inject(CardPopoverCoordinatorService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly ngZone = inject(NgZone);
  private readonly viewportPadding = 16;
  private readonly popoverGap = 8;
  private readonly cardId = `card-${CardComponent.nextCardId++}`;
  readonly popoverId = `${this.cardId}-popover`;
  private rafId: number | null = null;

  constructor() {
    effect((onCleanup) => {
      if (!this.isPopoverOpen()) return;

      this.schedulePopoverReposition();

      const onViewportChange = () => this.schedulePopoverReposition();
      this.ngZone.runOutsideAngular(() => {
        window.addEventListener('resize', onViewportChange, { passive: true });
        window.addEventListener('scroll', onViewportChange, { passive: true });
      });

      onCleanup(() => {
        window.removeEventListener('resize', onViewportChange);
        window.removeEventListener('scroll', onViewportChange);
        this.cancelScheduledReposition();
      });
    });

    this.destroyRef.onDestroy(() => this.cancelScheduledReposition());
  }

  togglePopover(): void {
    const nextState = !this.isPopoverOpen();
    if (nextState) {
      this.popoverCoordinator.open(this.cardId);
    } else {
      this.popoverCoordinator.close();
    }

    if (nextState) {
      this.schedulePopoverReposition();
    }
  }

  closePopover(): void {
    this.popoverCoordinator.close();
  }

  protected repositionPopover(): void {
    if (!this.isPopoverOpen()) return;

    const button = this.breakdownButton?.nativeElement;
    const popover =
      this.popoverHost?.nativeElement ??
      (this.hostEl.nativeElement.querySelector('app-popover-price') as HTMLElement | null);
    const card = this.hostEl.nativeElement.querySelector('.card') as HTMLElement | null;
    if (!button || !popover || !card) return;

    const triggerRect = button.getBoundingClientRect();
    const cardRect = card.getBoundingClientRect();
    const popoverRect = popover.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let left = cardRect.left + cardRect.width / 2 - popoverRect.width / 2;
    left = Math.max(
      this.viewportPadding,
      Math.min(left, viewportWidth - popoverRect.width - this.viewportPadding),
    );

    let top = triggerRect.bottom + this.popoverGap;
    const fitsBelow = top + popoverRect.height <= viewportHeight - this.viewportPadding;
    if (!fitsBelow) {
      const topAbove = triggerRect.top - popoverRect.height - this.popoverGap;
      if (topAbove >= this.viewportPadding) {
        top = topAbove;
      } else {
        top = Math.max(
          this.viewportPadding,
          viewportHeight - popoverRect.height - this.viewportPadding,
        );
      }
    }

    this.popoverPosition.set({ left: Math.round(left), top: Math.round(top) });
  }

  private schedulePopoverReposition(): void {
    if (this.rafId != null) return;

    this.rafId = requestAnimationFrame(() => {
      this.rafId = null;
      this.repositionPopover();
    });
  }

  private cancelScheduledReposition(): void {
    if (this.rafId == null) return;
    cancelAnimationFrame(this.rafId);
    this.rafId = null;
  }
}
