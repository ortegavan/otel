import { WebTracerProvider } from '@opentelemetry/sdk-trace-web';
import { ZoneContextManager } from '@opentelemetry/context-zone';
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { ATTR_SERVICE_NAME } from '@opentelemetry/semantic-conventions';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { environment } from './environments/environment';

export function initializeTelemetry() {
    const resource = resourceFromAttributes({
        [ATTR_SERVICE_NAME]: environment.appName,
    });

    const otlpExporter = new OTLPTraceExporter({
        url: `${window.location.origin}/v1/traces`,
    });

    const provider = new WebTracerProvider({
        resource: resource,
        spanProcessors: [new BatchSpanProcessor(otlpExporter)],
    });

    provider.register({
        contextManager: new ZoneContextManager(),
    });
}
