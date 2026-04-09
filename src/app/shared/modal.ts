import {
  Injectable,
  ApplicationRef,
  ComponentFactoryResolver,
  Injector,
  EmbeddedViewRef,
  ComponentRef
} from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { LoadTestResultsModalComponent, LoadTestResult } from './load-test-results-modal/load-test-results-modal'; // Removed .ts extension

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private modalComponentRef: ComponentRef<LoadTestResultsModalComponent> | null = null;
  private afterClosedSubject = new Subject<any>();

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private appRef: ApplicationRef,
    private injector: Injector
  ) { }

  open(
    testType: string,
    totalRequests: number,
    resultsStream: Observable<LoadTestResult>
  ): Observable<any> {
    // 1. Create a component factory
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(LoadTestResultsModalComponent);

    // 2. Create a component ref
    this.modalComponentRef = componentFactory.create(this.injector);

    // 3. Attach component to the app `view`
    this.appRef.attachView(this.modalComponentRef.hostView);

    // 4. Get DOM element from component
    const domElem = (this.modalComponentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;

    // 5. Append DOM element to the body
    document.body.appendChild(domElem);

        // 6. Pass inputs to the component

        this.modalComponentRef.instance.testType = testType;

        this.modalComponentRef.instance.totalRequests = totalRequests;

        this.modalComponentRef.instance.resultsStream = resultsStream; // Pass the Observable directly

        console.log('Modal component created and resultsStream passed.'); // Added log

        

        // 7. Subscribe to output events
    this.modalComponentRef.instance.close.subscribe(() => {
      this.close();
    });

    return this.afterClosedSubject.asObservable();
  }

  close(): void {
    if (this.modalComponentRef) {
      this.appRef.detachView(this.modalComponentRef.hostView);
      this.modalComponentRef.destroy();
      this.modalComponentRef = null;
      this.afterClosedSubject.next(null); // Emit a value when modal is closed
    }
  }

  ngOnDestroy(): void {
    this.afterClosedSubject.complete();
  }
}
