import { Component } from '@angular/core';
import { trace } from '@opentelemetry/api';

@Component({
    selector: 'app-root',
    imports: [],
    templateUrl: './app.html',
    styleUrl: './app.scss',
})
export class App {
    tracer = trace.getTracer('poc-angular', '1.0.0');

    test(): void {
        const span = this.tracer.startSpan('test');

        setTimeout(() => {
            span.end();
        }, 2000);
    }
}
