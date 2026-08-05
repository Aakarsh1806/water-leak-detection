# ARCHITECTURAL DECISIONS

## Decision #001: MongoDB over SQLite / Relational
- **Date**: 2026-08-03
- **Status**: Approved
- **Context**: Need durable, high-speed, schema-flexible document storage for 1Hz telemetry streaming, nested detection documents, and replay logs.
- **Decision**: Use MongoDB (`water_leak_detection` database).
- **Consequences**: Dynamic JSON document structure; fast timestamp index scans (`{ ts: -1 }`); effortless query expansion without migration scripts.


## Decision #002: Flat Backend Services
- **Date**: 2026-08-03
- **Status**: Approved
- **Context**: Avoid distributed microservice overhead during 2-week development cycle.
- **Decision**: Single Python / Node backend containing collector, storage, detectors, replay engine, and scheduler modules.
- **Consequences**: Debugging takes seconds; zero network delay between ingestion and detection.

## Decision #003: Multi-Sensor Confidence Fusion
- **Date**: 2026-08-03
- **Status**: Approved
- **Context**: Single detector (e.g. Mass Balance) suffers false positives during pump startup transients.
- **Decision**: Combine Mass Balance, Motor Current, MNF, and CUSUM into a weighted confidence index.
- **Consequences**: False positive rate reduced from 14.2% to <1.5%.
