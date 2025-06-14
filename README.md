## Prova de conceito de Angular com OpenTelemetry

### Instalação

Adicione os pacotes necessários com o seguinte comando:

```bash
npm install @opentelemetry/api @opentelemetry/context-zone @opentelemetry/exporter-trace-otlp-http @opentelemetry/resources @opentelemetry/sdk-trace-base @opentelemetry/sdk-trace-web @opentelemetry/semantic-conventions
```

### Configuração

Crie um arquivo `telemetry.ts` na raiz do seu projeto Angular e adicione o seguinte código:

```typescript
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
```

### Inicialização

No arquivo `main.ts`, importe e chame a função `initializeTelemetry`:

```typescript
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { initializeTelemetry } from './telemetry';

initializeTelemetry();

bootstrapApplication(App, appConfig).catch((err) => console.error(err));
```

### Uso

Para criar spans em seu aplicativo Angular, você pode usar o `trace` do OpenTelemetry. Por exemplo, no componente `app.component.ts`, você pode fazer o seguinte:

```typescript
tracer = trace.getTracer('poc-angular', '1.0.0');

test(): void {
    const span = this.tracer.startSpan('test');

    setTimeout(() => {
        span.end();
    }, 2000);
}
```
