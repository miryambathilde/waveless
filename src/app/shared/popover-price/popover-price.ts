import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

export interface PopoverPriceItem {
  label: string;
  value: string;
}

@Component({
  selector: 'app-popover-price',
  standalone: true,
  templateUrl: './popover-price.html',
  styleUrl: './popover-price.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PopoverPriceComponent {
  readonly title = input('Desglose de precios');
  readonly location = input('');
  readonly days = input('');
  readonly items = input<PopoverPriceItem[]>([]);
  readonly total = input('');

  readonly close = output<void>();

  protected onDismiss(): void {
    this.close.emit();
  }
}
