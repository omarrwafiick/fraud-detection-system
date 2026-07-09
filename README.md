# 🛡️ Real-Time Financial Fraud Detection Platform

An enterprise-grade, distributed multi-tenant backend architecture engineered to ingest, audit, and evaluate banking transactions for fraudulent patterns at high throughput ($\ge$ 1,000 TPS). 

This ecosystem is built using **NestJS**, structured around a **Trusted Subsystem** architecture network model, and leverages asynchronous event-streaming to isolate public-facing ingress paths from deep relational business rule engines.

---

## 🏗️ Architectural Topology

The system is decoupled into two primary containerized services communicating through a secure, isolated Docker overlay network. Public access is strictly regulated via an edge reverse-proxy layer.
```
                  [ Public Internet Inbound Traffic ]
                                  │
                                  ▼
                     ┌────────────────────────┐
                     │   Nginx Edge Router    │ (Port 80/443 Exposed)
                     └────────────┬───────────┘
                                  │ (Internal DNS Proxy routing)
                                  ▼
                     ┌────────────────────────┐
                     │   api-gateway Node     │ (Port 3000 Private)
                     └──────┬──────────┬──────┘
                            │          │
         ┌──────────────────┘          └──────────────────┐
         │ (High-Speed Cache Verification)                │ (Asynchronous Event Stream)
         ▼                                                ▼
┌─────────────────┐                              ┌─────────────────┐
│   Redis Cache   │                              │  Kafka Cluster  │
│ (API-Key Store) │                              │ (Ingest Topic)  │
└─────────────────┘                              └────────┬────────┘
                                                          │
                                                          │ (Streaming Consumer)
                                                          ▼
                                                 ┌─────────────────┐
                                                 │   api-worker    │ (Port 3001 Private)
                                                 └──────┬───┬──────┘
                                                        │   │
                        ┌───────────────────────────────┘   └───────────────────────────────┐
                        │ (Dual-Write Relational Ledger)                                    │ (Graph Link Sync & Risk Queries)
                        ▼                                                                   ▼
┌────────────────────────────────────────────────┐                 ┌────────────────────────────────────────────────┐
│              PostgreSQL Database               │                 │                 Neo4j Cluster                  │
│       (Source of Truth / Fraud Ledger)         │                 │          (Operational Graph Index)             │
│                                                │                 │                                                │
│  - Multi-Tenant Schema Partitioning            │                 │  - Multi-Tenant Structural Sub-Graphs          │
│  - Transaction States (APPROVED/REJECTED)      │                 │  - High-Speed Hop Traversal BFS                │
│  - Tenant Profiles, Custom Rules & Cases Table │                 │  - Cycle Detection & Entity Fingerprinting     │
└────────────────────────────────────────────────┘                 └────────────────────────────────────────────────┘
                        │                                                                   │
                        └───────────────────────────────┐   ┌───────────────────────────────┘
                                                        │   │
                                                        ▼   ▼
                                             ┌─────────────────────┐
                                             │ NestJS Event Bus    │ (Internal Async Decoupling)
                                             │   (EventEmitter2)   │
                                             └──────────┬──────────┘
                                                        │
                                                        ▼
                                             ┌─────────────────────┐
                                             │   AlertsListener    │ ──> [ Creates Cases / Dashboard Records ]
                                             └─────────────────────┘ ──> [ Dispatches Merchant Webhooks / Slack ]

                                   ─────────────────────────────────────────────
                                          Observability & Monitoring Plane
                                   ─────────────────────────────────────────────

                                                 Metrics Scraping
                                                        ▲
                                                        │
                                          ┌─────────────┴──────────────┐
                                          │                            │
                                   ┌─────────────┐                ┌─────────────┐
                                   │ api-gateway │                │  api-worker │
                                   │  /metrics   │                │   /metrics  │
                                   └──────┬──────┘                └────┬────────┘
                                          │                            │
                                          └─────────────┬──────────────┘
                                                        │
                                                        ▼
                                          ┌──────────────────────────┐
                                          │       Prometheus         │
                                          │   Metrics Collection     │
                                          │  Time-Series Database    │
                                          └─────────────┬────────────┘
                                                        │ (PromQL Queries)
                                                        ▼
                                          ┌──────────────────────────┐
                                          │         Grafana          │
                                          │  Operational Dashboards  │
                                          │   Alert Visualization    │
                                          └──────────────────────────┘
```
