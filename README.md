# Project to reproduce the gRPC + tracing memory leak

## Requirements

1. Download the v2.21.0 version of the opentelemetry-javaagent.jar from the release page
2. Install [k6](https://grafana.com/docs/k6/latest/set-up/install-k6/) to run load test

## Create jar

```shell
mvn package
```

## Start Observability stack and example application
```shell
docker-compose up -d

SERVER_PORT=8080 java -Dfile.encoding=UTF-8 -Xms128m -Xmx128m -XX:MaxMetaspaceSize=256m -XX:+HeapDumpOnOutOfMemoryError -XX:HeapDumpPath=heapdump.hprof -javaagent:opentelemetry-javaagent.jar -Dotel.service.name=leaky -Dotel.resource.attributes=service.instance.id=grpc -Dotel.instrumentation.common.default-enabled=true -Dotel.metric.export.interval=200 -Dotel.logs.exporter=none -Dotel.exporter.otlp.protocol=grpc -jar target/leaky-1.0-SNAPSHOT.jar
SERVER_PORT=8080 k6 run k6.load-test.js
```

## Prometheus

Navigate to [Prometheus to check the Heap memory](http://localhost:9090/query?g0.expr=jvm_memory_used_bytes%7Bjvm_memory_pool_name%3D%22G1+Old+Gen%22%2C+jvm_memory_type%3D%22heap%22%7D&g0.show_tree=0&g0.tab=graph&g0.range_input=15m&g0.res_type=auto&g0.res_density=medium&g0.display_mode=lines&g0.show_exemplars=0).
