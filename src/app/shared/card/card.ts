import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewChild,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { TagComponent } from '@shared/tag/tag';
import { PopoverPriceComponent } from '@shared/popover-price/popover-price';
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
    '(window:resize)': 'repositionPopover()',
    '(window:scroll)': 'repositionPopover()',
  },
})
export class CardComponent {
  private static nextCardId = 0;

  title = input<string>('');
  description = input<string>('');
  durationBucket = input<string | undefined>(undefined);
  price = input<string>('');
  image = input<string>('');

  protected readonly isPopoverOpen = computed(
    () => this.popoverCoordinator.openCardId() === this.cardId,
  );
  protected readonly popoverPosition = signal({ left: 0, top: 0 });

  @ViewChild('breakdownButton') private readonly breakdownButton?: ElementRef<HTMLButtonElement>;
  @ViewChild('popoverHost', { read: ElementRef })
  private readonly popoverHost?: ElementRef<HTMLElement>;

  private readonly hostEl = inject(ElementRef<HTMLElement>);
  private readonly popoverCoordinator = inject(CardPopoverCoordinatorService);
  private readonly viewportPadding = 16;
  private readonly popoverGap = 8;
  private readonly cardId = `card-${CardComponent.nextCardId++}`;
  protected readonly popoverId = `${this.cardId}-popover`;

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
    requestAnimationFrame(() => this.repositionPopover());
  }
}
