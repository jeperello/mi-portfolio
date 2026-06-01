import { Directive, HostListener, Input, inject } from '@angular/core';
import { AnalyticsService } from '../core/services/analytics.service';

@Directive({
  selector: '[appTracker]',
  standalone: true
})
export class AnalyticsDirective {
  private analytics = inject(AnalyticsService);

  @Input('appTracker') componentId: string = '';
  @Input() trackerData: Record<string, any> = {};
  @Input() trackerEvent: string = 'CLICK';

  @HostListener('click')
  onClick() {
    this.analytics.trackEvent(this.trackerEvent, this.componentId, this.trackerData);
  }
}
