import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CardPopoverCoordinatorService {
  readonly openCardId = signal<string | null>(null);

  open(cardId: string): void {
    this.openCardId.set(cardId);
  }

  close(): void {
    this.openCardId.set(null);
  }
}
