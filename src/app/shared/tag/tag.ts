import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

type TagVariant = 'accent' | 'neutral';
type TagSize = 'sm' | 'md';

@Component({
  selector: 'app-tag',
  templateUrl: './tag.html',
  styleUrl: './tag.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'tag',
    '[class.tag--accent]': 'isAccent()',
    '[class.tag--neutral]': 'isNeutral()',
    '[class.tag--sm]': 'isSm()',
    '[class.tag--md]': 'isMd()',
  },
})
export class TagComponent {
  readonly label = input.required<string>();
  readonly variant = input<TagVariant>('neutral');
  readonly size = input<TagSize>('md');

  protected readonly isAccent = computed(() => this.variant() === 'accent');
  protected readonly isNeutral = computed(() => this.variant() === 'neutral');
  protected readonly isSm = computed(() => this.size() === 'sm');
  protected readonly isMd = computed(() => this.size() === 'md');
}
