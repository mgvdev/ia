import type { CategoryDefinition } from "../types.ts";

const rule = (
  id: string,
  label: string,
  description: string,
  defaultOptionId: string,
  options: Array<{ id: string; label: string; emits: string }>,
): CategoryDefinition["rules"][number] => ({
  id,
  label,
  description,
  defaultOptionId,
  options,
});

export const RULES_CATALOG: CategoryDefinition[] = [
  {
    id: "frontend",
    label: "Frontend",
    description: "UI architecture, styling, and client-side state patterns.",
    rules: [
      rule("component_pattern", "Component pattern", "How components are structured.", "compound", [
        { id: "compound", label: "Compound components", emits: "Build complex widgets as compound components with shared context APIs." },
        { id: "atomic", label: "Atomic design", emits: "Organize UI as atoms, molecules, organisms, templates, and pages." },
        { id: "headless", label: "Headless components", emits: "Separate behavior from presentation using headless components." },
      ]),
      rule("styling_strategy", "Styling strategy", "How styles are authored and maintained.", "css_modules", [
        { id: "bem", label: "BEM", emits: "Use BEM naming for CSS selectors and forbid deep descendant coupling." },
        { id: "css_modules", label: "CSS Modules", emits: "Use CSS Modules and avoid global style leakage." },
        { id: "utility_first", label: "Utility-first", emits: "Use utility-first classes and limit custom CSS to tokens and exceptions." },
      ]),
      rule("state_strategy", "State strategy", "How client state and server state are handled.", "query_cache", [
        { id: "query_cache", label: "Query cache", emits: "Use server-state caching library for remote data and keep local UI state minimal." },
        { id: "global_store", label: "Global store", emits: "Use a centralized global store with explicit slices and selectors." },
        { id: "local_first", label: "Local-first state", emits: "Prefer local component state; escalate to shared state only when necessary." },
      ]),
      rule("ui_library_packaging", "UI library packaging", "How reusable components are packaged and documented.", "separate_package_storybook", [
        { id: "separate_package_storybook", label: "Separate package + Storybook", emits: "Maintain reusable UI components in a dedicated package and document them in Storybook." },
        { id: "app_local_components", label: "App-local components", emits: "Keep components in the application repo and avoid publishing a separate UI package." },
        { id: "progressive_extract", label: "Progressive extraction", emits: "Start in-app and progressively extract stable components into a shared package with Storybook." },
      ]),
      rule("component_library_standard", "Component library standard", "Operational standards for the component library stack.", "shadcn_strict", [
        {
          id: "shadcn_strict",
          label: "Shadcn strict",
          emits:
            "Enforce shadcn-first composition for molecules/organisms; if a primitive is missing, create or extend a shadcn atom first; forbid raw HTML controls (`<button>`, `<input>`, `<select>`, `<textarea>`) outside atoms/wrappers; use token-only design classes (no hardcoded colors/radius/shadows); forbid inline style for design except documented dynamic technical constraints; keep stories aligned with design-system components (no fake visual wrappers); enforce CI guardrails such as `rg -n \"<button|<input|<select|<textarea\" src/{molecules,organisms} --glob '!**/*.test.tsx'` and `rg -n \"#[0-9A-Fa-f]{3,8}|oklch\\\\(|rgb\\\\(|hsl\\\\(\" src/{atoms,molecules,organisms,stories}`; definition of done requires typecheck + tests + Storybook build, and story/snapshot updates for visual class changes.",
        },
        {
          id: "shadcn_balanced",
          label: "Shadcn balanced",
          emits:
            "Prefer shadcn atoms as the base for molecules/organisms, minimize raw HTML controls outside atoms, use theme tokens by default, keep stories design-system compliant, and run CI checks for raw controls and hardcoded color functions.",
        },
        {
          id: "library_agnostic",
          label: "Library-agnostic",
          emits:
            "Do not enforce a specific component library standard; apply generic design-system and accessibility conventions instead.",
        },
      ]),
      rule("accessibility_standard", "Accessibility standard", "Accessibility quality bar for frontend deliverables.", "wcag_aa_required", [
        { id: "wcag_aa_required", label: "WCAG AA required", emits: "Require WCAG 2.2 AA compliance for all user-facing interactive flows." },
        { id: "wcag_aa_with_axe_ci", label: "WCAG AA + automated checks", emits: "Enforce WCAG AA and run automated accessibility checks in CI for critical pages." },
        { id: "pragmatic_a11y", label: "Pragmatic accessibility", emits: "Prioritize accessibility for core journeys and schedule iterative remediation for non-critical screens." },
      ]),
      rule("routing_strategy", "Routing strategy", "How routes are organized and loaded.", "file_based", [
        { id: "file_based", label: "File-based routing", emits: "Use file-based routing conventions with route-level ownership and clear loading boundaries." },
        { id: "config_driven", label: "Config-driven routing", emits: "Define routes in centralized typed configuration to enforce access and navigation consistency." },
        { id: "hybrid_routing", label: "Hybrid routing", emits: "Combine file-based routing for simple routes and explicit config for guarded or dynamic routes." },
      ]),
    ],
  },
  {
    id: "backend",
    label: "Backend",
    description: "Service architecture, API style, and async execution.",
    rules: [
      rule("service_topology", "Service topology", "How backend services are composed.", "modular_monolith", [
        { id: "modular_monolith", label: "Modular monolith", emits: "Implement a modular monolith with strict internal module boundaries." },
        { id: "microservices", label: "Microservices", emits: "Split bounded contexts into independently deployable services." },
        { id: "hexagonal", label: "Hexagonal", emits: "Enforce ports-and-adapters boundaries around domain logic." },
      ]),
      rule("api_style", "API style", "Transport/API contract style.", "rest", [
        { id: "rest", label: "REST", emits: "Expose resource-oriented REST APIs with consistent nouns and HTTP semantics." },
        { id: "graphql", label: "GraphQL", emits: "Expose GraphQL schema with typed resolvers and field-level auth." },
        { id: "grpc", label: "gRPC", emits: "Use gRPC contracts for internal service-to-service communication." },
      ]),
      rule("async_pattern", "Async pattern", "How asynchronous workloads are processed.", "queue_jobs", [
        { id: "queue_jobs", label: "Queue jobs", emits: "Process long-running work via durable queues and retry policies." },
        { id: "event_driven", label: "Event-driven", emits: "Publish domain events and handle side effects asynchronously." },
        { id: "cron_tasks", label: "Cron tasks", emits: "Use scheduled jobs only for periodic tasks with idempotent handlers." },
      ]),
      rule("error_contract", "Error contract", "How service errors are structured and exposed.", "problem_details", [
        { id: "problem_details", label: "Problem Details", emits: "Expose errors using RFC 9457 Problem Details with stable machine-readable fields." },
        { id: "domain_error_codes", label: "Domain error codes", emits: "Use explicit domain error codes and map them consistently at transport boundaries." },
        { id: "transport_native", label: "Transport-native errors", emits: "Keep errors transport-native and document mapping rules per endpoint family." },
      ]),
      rule("idempotency_policy", "Idempotency policy", "Where idempotency must be enforced.", "required_for_writes", [
        { id: "required_for_writes", label: "Required for writes", emits: "Require idempotency keys for all non-safe write operations exposed externally." },
        { id: "selected_endpoints", label: "Selected endpoints", emits: "Enforce idempotency on financially or operationally critical endpoints only." },
        { id: "none", label: "No idempotency policy", emits: "Do not enforce idempotency globally and rely on endpoint-specific safeguards." },
      ]),
      rule("service_discovery", "Service discovery", "How services locate each other and route traffic.", "platform_registry", [
        { id: "platform_registry", label: "Platform registry", emits: "Use platform-native service registry and avoid hardcoded service addresses." },
        { id: "dns_only", label: "DNS only", emits: "Use DNS-based discovery with strict naming and health-check conventions." },
        { id: "gateway_mediated", label: "Gateway-mediated", emits: "Route inter-service calls through a managed gateway with centralized policy enforcement." },
      ]),
    ],
  },
  {
    id: "sql-data",
    label: "SQL-Data",
    description: "Database migrations, integrity, and query design.",
    rules: [
      rule("migration_strategy", "Migration strategy", "How schema changes are rolled out.", "forward_only", [
        { id: "forward_only", label: "Forward-only", emits: "Apply forward-only migrations; no down migrations in production pipelines." },
        { id: "reversible", label: "Reversible", emits: "Require reversible migrations for every schema change." },
        { id: "expand_contract", label: "Expand-contract", emits: "Use expand-contract migrations for backward-compatible rollouts." },
      ]),
      rule("integrity_policy", "Integrity policy", "How data consistency is enforced.", "strict_fk", [
        { id: "strict_fk", label: "Strict FK", emits: "Enforce referential integrity with foreign keys and transactional writes." },
        { id: "hybrid", label: "Hybrid", emits: "Use database constraints for critical paths and app validation for soft relations." },
        { id: "app_enforced", label: "App-enforced", emits: "Enforce integrity in application layer with explicit consistency checks." },
      ]),
      rule("query_policy", "Query policy", "How data-access logic is structured.", "repository", [
        { id: "repository", label: "Repository", emits: "Access persistence through repositories with explicit query methods." },
        { id: "query_object", label: "Query object", emits: "Use query objects for complex read paths and pagination." },
        { id: "raw_sql_reviewed", label: "Raw SQL reviewed", emits: "Allow raw SQL only with review and explain-plan evidence." },
      ]),
      rule("tenancy_model", "Tenancy model", "How tenant data is isolated.", "single_schema", [
        { id: "single_schema", label: "Single schema", emits: "Use single-schema multi-tenancy with tenant-scoped keys and strict row-level controls." },
        { id: "schema_per_tenant", label: "Schema per tenant", emits: "Isolate tenants by schema and automate schema lifecycle management." },
        { id: "database_per_tenant", label: "Database per tenant", emits: "Use database-per-tenant isolation for high-compliance or high-noise tenants." },
      ]),
      rule("retention_policy", "Retention policy", "How data retention and cleanup are managed.", "ttl_enforced", [
        { id: "ttl_enforced", label: "TTL enforced", emits: "Enforce retention windows with automated purge jobs and audit trails." },
        { id: "archive_then_purge", label: "Archive then purge", emits: "Archive data to cold storage before purge based on policy classification." },
        { id: "manual_retention", label: "Manual retention", emits: "Handle retention manually through periodic reviewed operations." },
      ]),
      rule("replication_strategy", "Replication strategy", "How replicas and read scaling are used.", "primary_replicas", [
        { id: "primary_replicas", label: "Primary + read replicas", emits: "Use primary-replica topology and route read-only workloads to replicas." },
        { id: "single_primary", label: "Single primary", emits: "Keep single-primary topology and scale vertically before adding replicas." },
        { id: "multi_region", label: "Multi-region replication", emits: "Use multi-region replication with explicit consistency and failover policies." },
      ]),
    ],
  },
  {
    id: "api-contracts",
    label: "API-Contracts",
    description: "Contract source, versioning, and pagination.",
    rules: [
      rule("source_of_truth", "Source of truth", "Canonical API contract source.", "openapi_first", [
        { id: "openapi_first", label: "OpenAPI-first", emits: "Define API contracts in OpenAPI before implementation." },
        { id: "code_first", label: "Code-first", emits: "Generate contract artifacts from typed source code." },
        { id: "schema_first", label: "Schema-first", emits: "Keep schema files as canonical source for all clients and servers." },
      ]),
      rule("versioning", "Versioning", "How API versions are managed.", "semver_contract", [
        { id: "uri_version", label: "URI version", emits: "Version public APIs in URI path segments." },
        { id: "header_version", label: "Header version", emits: "Version APIs via explicit headers and negotiation." },
        { id: "semver_contract", label: "Semantic versioning", emits: "Version contracts semantically and deprecate with timelines." },
      ]),
      rule("pagination", "Pagination", "How collection endpoints paginate.", "cursor", [
        { id: "cursor", label: "Cursor", emits: "Use cursor pagination for mutable and high-volume datasets." },
        { id: "offset", label: "Offset", emits: "Use offset pagination for simple bounded datasets." },
        { id: "keyset", label: "Keyset", emits: "Use keyset pagination for stable ordered traversal." },
      ]),
      rule("error_format", "Error format", "Canonical API error response format.", "problem_json", [
        { id: "problem_json", label: "Problem+JSON", emits: "Return API errors in Problem+JSON format with stable type URIs and error codes." },
        { id: "custom_schema", label: "Custom error schema", emits: "Use a versioned custom error schema shared across clients and backend services." },
        { id: "transport_native", label: "Transport-native", emits: "Keep transport-native error envelopes and document translations in clients." },
      ]),
      rule("compatibility_policy", "Compatibility policy", "Backward compatibility guarantees for public APIs.", "strict_non_breaking", [
        { id: "strict_non_breaking", label: "Strict non-breaking", emits: "Forbid breaking API changes without a new major version path." },
        { id: "deprecation_window", label: "Deprecation window", emits: "Allow changes with explicit deprecation windows and migration guides." },
        { id: "fast_iteration", label: "Fast iteration", emits: "Allow faster contract evolution with short-lived versions and aggressive client upgrades." },
      ]),
      rule("schema_distribution", "Schema distribution", "How API schemas are published to consumers.", "registry_publish", [
        { id: "registry_publish", label: "Registry publish", emits: "Publish contracts to a schema registry and track consumer compatibility checks." },
        { id: "repo_only", label: "Repo only", emits: "Store schemas in-repo and distribute through source control workflows." },
        { id: "artifact_bundle", label: "Artifact bundle", emits: "Bundle API contracts as versioned artifacts consumed by SDK and gateway pipelines." },
      ]),
    ],
  },
  {
    id: "security",
    label: "Security",
    description: "Authentication, authorization, and secret policies.",
    rules: [
      rule("auth_model", "Authentication model", "Primary authentication approach.", "oidc", [
        { id: "session_cookie", label: "Session cookie", emits: "Use secure HTTP-only session cookies with rotation and CSRF protection." },
        { id: "jwt_short", label: "Short JWT", emits: "Use short-lived JWTs with refresh token rotation." },
        { id: "oidc", label: "OIDC", emits: "Use OIDC provider as primary identity authority." },
      ]),
      rule("authorization_model", "Authorization model", "Access control model.", "rbac", [
        { id: "rbac", label: "RBAC", emits: "Implement role-based access checks at service boundaries." },
        { id: "abac", label: "ABAC", emits: "Implement attribute-based access decisions using contextual policies." },
        { id: "policy_engine", label: "Policy engine", emits: "Centralize authorization in a policy engine with audited decisions." },
      ]),
      rule("secret_management", "Secret management", "How secrets are distributed and rotated.", "vault_runtime", [
        { id: "vault_runtime", label: "Vault runtime", emits: "Load secrets at runtime from centralized secret manager." },
        { id: "kms_sealed", label: "KMS sealed", emits: "Encrypt environment secrets with KMS and rotate regularly." },
        { id: "env_local_only", label: "Local env only", emits: "Allow local `.env` secrets only for development, never in production." },
      ]),
      rule("dependency_security", "Dependency security", "How third-party dependency risk is managed.", "sbom_and_blocking_scan", [
        { id: "sbom_and_blocking_scan", label: "SBOM + blocking scan", emits: "Generate SBOMs and block releases on critical dependency vulnerabilities." },
        { id: "ci_scan_non_blocking", label: "CI scan non-blocking", emits: "Scan dependencies in CI and require remediation plans for critical findings." },
        { id: "periodic_audit", label: "Periodic audit", emits: "Run scheduled dependency audits and remediate based on risk triage." },
      ]),
      rule("threat_modeling", "Threat modeling", "Frequency and rigor of threat modeling.", "per_major_feature", [
        { id: "per_major_feature", label: "Per major feature", emits: "Perform threat modeling for each major feature and architecture change." },
        { id: "quarterly_review", label: "Quarterly review", emits: "Run structured threat-model reviews quarterly for critical systems." },
        { id: "ad_hoc", label: "Ad-hoc", emits: "Conduct threat modeling ad-hoc when risk indicators or incidents require it." },
      ]),
      rule("data_protection", "Data protection", "Default data handling and privacy safeguards.", "encrypt_in_transit_and_rest", [
        { id: "encrypt_in_transit_and_rest", label: "Encrypt in transit and at rest", emits: "Encrypt sensitive data in transit and at rest using managed key rotation." },
        { id: "field_level_encryption", label: "Field-level encryption", emits: "Apply field-level encryption to high-sensitivity data classes in storage." },
        { id: "masked_non_prod", label: "Masked non-prod data", emits: "Use masked or synthetic datasets in non-production environments by default." },
      ]),
    ],
  },
  {
    id: "testing",
    label: "Testing",
    description: "Automated testing strategy and scope.",
    rules: [
      rule("pyramid", "Testing pyramid", "Balance of test types.", "balanced", [
        { id: "unit_heavy", label: "Unit-heavy", emits: "Keep most tests at unit level; integration tests cover seams only." },
        { id: "balanced", label: "Balanced", emits: "Balance unit, integration, and e2e tests by risk profile." },
        { id: "service_heavy", label: "Service-heavy", emits: "Prioritize service/integration tests over isolated unit mocks." },
      ]),
      rule("integration_style", "Integration style", "Approach for integration tests.", "containerized_real", [
        { id: "containerized_real", label: "Containerized real deps", emits: "Run integration tests against real containerized dependencies." },
        { id: "fakes_first", label: "Fakes first", emits: "Use deterministic fakes for most integration scenarios." },
        { id: "contract_only", label: "Contract only", emits: "Rely on contract tests and minimal environment integration tests." },
      ]),
      rule("e2e_scope", "E2E scope", "Breadth of end-to-end coverage.", "critical_journeys", [
        { id: "critical_journeys", label: "Critical journeys", emits: "Maintain e2e coverage for critical user journeys only." },
        { id: "full_regression", label: "Full regression", emits: "Run broad e2e regression suite before release." },
        { id: "smoke_only", label: "Smoke only", emits: "Run smoke e2e checks in CI and deeper tests on schedule." },
      ]),
      rule("flakiness_policy", "Flakiness policy", "How flaky tests are handled in CI.", "quarantine_and_fix", [
        { id: "quarantine_and_fix", label: "Quarantine and fix", emits: "Quarantine flaky tests with ownership and mandatory remediation deadlines." },
        { id: "rerun_once_then_fail", label: "Rerun once then fail", emits: "Allow one automated rerun for flaky tests before failing the pipeline." },
        { id: "non_blocking_flaky", label: "Non-blocking flaky", emits: "Mark known flaky suites as non-blocking while tracking stability trends." },
      ]),
      rule("coverage_policy", "Coverage policy", "Coverage expectations and enforcement.", "critical_paths_threshold", [
        { id: "critical_paths_threshold", label: "Critical path thresholds", emits: "Enforce coverage thresholds on critical modules and business logic paths." },
        { id: "global_threshold", label: "Global threshold", emits: "Enforce a global repository coverage threshold in CI." },
        { id: "no_threshold", label: "No threshold", emits: "Do not enforce numeric coverage thresholds; focus on risk-based test review." },
      ]),
      rule("test_data_strategy", "Test data strategy", "How test fixtures and datasets are maintained.", "factory_based", [
        { id: "factory_based", label: "Factory-based fixtures", emits: "Use test data factories and scenario builders instead of static shared fixtures." },
        { id: "golden_datasets", label: "Golden datasets", emits: "Maintain versioned golden datasets for deterministic integration and e2e scenarios." },
        { id: "runtime_seeded", label: "Runtime seeded", emits: "Seed test environments at runtime with deterministic scripts per suite." },
      ]),
    ],
  },
  {
    id: "observability",
    label: "Observability",
    description: "Logs, traces, and reliability goals.",
    rules: [
      rule("logging_format", "Logging format", "Log encoding and shape.", "json_structured", [
        { id: "json_structured", label: "JSON structured", emits: "Emit structured JSON logs with correlation identifiers." },
        { id: "logfmt", label: "logfmt", emits: "Use logfmt with normalized key naming and trace IDs." },
        { id: "hybrid", label: "Hybrid", emits: "Use readable logs in dev and structured logs in non-dev environments." },
      ]),
      rule("tracing", "Tracing", "Distributed tracing policy.", "otel_required", [
        { id: "otel_required", label: "OpenTelemetry required", emits: "Instrument services with OpenTelemetry traces by default." },
        { id: "critical_path", label: "Critical path only", emits: "Trace only business-critical request paths with sampling." },
        { id: "on_demand", label: "On demand", emits: "Enable trace instrumentation on demand for targeted debugging." },
      ]),
      rule("slo_policy", "SLO policy", "Service-level objective strategy.", "latency_availability", [
        { id: "latency_availability", label: "Latency + availability", emits: "Define SLOs for latency and availability with error budgets." },
        { id: "availability_only", label: "Availability only", emits: "Track availability SLO as primary reliability metric." },
        { id: "error_budget_ops", label: "Error-budget gating", emits: "Gate releases based on remaining error budget." },
      ]),
      rule("alert_routing", "Alert routing", "How alerts are routed and owned.", "service_owned_oncall", [
        { id: "service_owned_oncall", label: "Service-owned on-call", emits: "Route alerts to service owners with explicit escalation and ack expectations." },
        { id: "central_noc", label: "Central NOC", emits: "Route first-level alerts to a centralized operations team before service escalation." },
        { id: "business_hours_primary", label: "Business-hours primary", emits: "Use business-hours primary alerting with critical-severity after-hours escalation." },
      ]),
      rule("pii_logging", "PII logging policy", "How personally identifiable data is handled in logs.", "redact_by_default", [
        { id: "redact_by_default", label: "Redact by default", emits: "Redact sensitive fields by default and require explicit allowlisting for log exposure." },
        { id: "allowlisted_fields", label: "Allowlisted fields", emits: "Log only approved allowlisted fields with periodic policy review." },
        { id: "best_effort", label: "Best effort", emits: "Apply best-effort masking and prioritize high-risk fields for immediate protection." },
      ]),
      rule("metric_strategy", "Metric strategy", "How metrics are defined and maintained.", "golden_signals", [
        { id: "golden_signals", label: "Golden signals", emits: "Track golden signals per service with standardized labels and ownership." },
        { id: "domain_kpis", label: "Domain KPIs", emits: "Prioritize domain-level business KPIs alongside technical service metrics." },
        { id: "minimal_metrics", label: "Minimal metrics", emits: "Collect minimal operational metrics and expand observability based on incidents." },
      ]),
    ],
  },
  {
    id: "ci-cd",
    label: "CI-CD",
    description: "Delivery model, branching, and quality gates.",
    rules: [
      rule("branch_model", "Branch model", "Git workflow model.", "trunk_based", [
        { id: "trunk_based", label: "Trunk-based", emits: "Adopt trunk-based development with short-lived branches." },
        { id: "gitflow", label: "GitFlow", emits: "Use GitFlow with explicit release and hotfix branches." },
        { id: "release_branches", label: "Release branches", emits: "Maintain release branches with patch-only policy." },
      ]),
      rule("deploy_model", "Deploy model", "Deployment rollout strategy.", "canary", [
        { id: "blue_green", label: "Blue-green", emits: "Use blue-green deployment with health-check cutover." },
        { id: "canary", label: "Canary", emits: "Roll out canary deployments with automated rollback thresholds." },
        { id: "rolling", label: "Rolling", emits: "Use rolling updates with readiness and drain guarantees." },
      ]),
      rule("quality_gates", "Quality gates", "Merge/deploy quality requirements.", "tests_lint_security", [
        { id: "tests_lint_security", label: "Tests + lint + security", emits: "Require tests, lint, and security scans before merge." },
        { id: "tests_only", label: "Tests only", emits: "Require tests only for merge; other checks are advisory." },
        { id: "full_gates", label: "Full gates", emits: "Require tests, lint, security, performance, and contract checks." },
      ]),
      rule("artifact_policy", "Artifact policy", "How build artifacts are produced and promoted.", "immutable_artifacts", [
        { id: "immutable_artifacts", label: "Immutable artifacts", emits: "Build artifacts once and promote the same immutable artifact across environments." },
        { id: "rebuild_per_env", label: "Rebuild per environment", emits: "Rebuild artifacts per environment with strict provenance tracking." },
        { id: "hybrid", label: "Hybrid", emits: "Use immutable artifacts for backend services and environment builds for frontend assets when needed." },
      ]),
      rule("release_approval", "Release approval", "Approval policy before production release.", "manual_prod_approval", [
        { id: "fully_automated", label: "Fully automated", emits: "Automate production releases when all quality and reliability gates pass." },
        { id: "manual_prod_approval", label: "Manual prod approval", emits: "Require explicit manual approval for production deployments." },
        { id: "cab_required", label: "CAB required", emits: "Require change advisory board approval for production releases." },
      ]),
      rule("rollback_strategy", "Rollback strategy", "Default rollback strategy when releases fail.", "automatic_rollback", [
        { id: "automatic_rollback", label: "Automatic rollback", emits: "Trigger automatic rollback when health, SLO, or error-rate thresholds fail." },
        { id: "manual_rollback", label: "Manual rollback", emits: "Require operator-driven rollback with runbook-guided decision criteria." },
        { id: "rollforward_first", label: "Roll-forward first", emits: "Prefer roll-forward fixes and reserve rollback for severe regressions only." },
      ]),
    ],
  },
  {
    id: "architecture",
    label: "Architecture",
    description: "Module boundaries and dependency direction.",
    rules: [
      rule("module_boundaries", "Module boundaries", "How modules are grouped.", "feature_sliced", [
        { id: "feature_sliced", label: "Feature-sliced", emits: "Organize code by feature boundaries, not technical layers alone." },
        { id: "layered", label: "Layered", emits: "Use layered architecture with strict directional dependencies." },
        { id: "domain_driven", label: "Domain-driven", emits: "Align modules to domain bounded contexts and ubiquitous language." },
      ]),
      rule("dependency_rules", "Dependency rules", "Allowed dependency direction patterns.", "strict_inward", [
        { id: "strict_inward", label: "Strict inward", emits: "Only allow dependencies pointing inward toward domain/core." },
        { id: "adapters_only", label: "Adapters only", emits: "Restrict infrastructure to adapter layer and forbid domain leaks." },
        { id: "pragmatic", label: "Pragmatic exceptions", emits: "Allow exceptions only with documented architectural decision records." },
      ]),
      rule("config_strategy", "Configuration strategy", "How runtime config is managed.", "typed_config", [
        { id: "12factor", label: "12-factor", emits: "Store configuration in environment variables and validate at startup." },
        { id: "typed_config", label: "Typed config", emits: "Use typed config schema with fail-fast validation." },
        { id: "single_source", label: "Single source", emits: "Centralize config source and prohibit duplicated config definitions." },
      ]),
      rule("integration_pattern", "Integration pattern", "Preferred interaction mode between modules/services.", "hybrid", [
        { id: "sync_first", label: "Synchronous first", emits: "Prefer synchronous integrations and isolate asynchronous boundaries to explicit workflows." },
        { id: "async_first", label: "Asynchronous first", emits: "Prefer asynchronous integration for decoupling and failure isolation across domains." },
        { id: "hybrid", label: "Hybrid", emits: "Use synchronous calls for request/response paths and asynchronous messaging for side effects." },
      ]),
      rule("adr_enforcement", "ADR enforcement", "How architecture decisions must be documented.", "required_significant_changes", [
        { id: "required_significant_changes", label: "Required for significant changes", emits: "Require ADRs for significant architecture, data, and platform decisions." },
        { id: "optional_encouraged", label: "Optional but encouraged", emits: "Encourage ADRs with lightweight templates and review nudges." },
        { id: "none", label: "No formal ADR requirement", emits: "Do not require ADRs; rely on PR descriptions and team discussions." },
      ]),
      rule("domain_events", "Domain events", "How domain events are modeled and published.", "explicit_event_schema", [
        { id: "explicit_event_schema", label: "Explicit event schemas", emits: "Define explicit versioned domain event schemas with ownership and lifecycle policy." },
        { id: "implicit_events", label: "Implicit events", emits: "Emit events from service changes without dedicated schema governance." },
        { id: "event_registry", label: "Event registry", emits: "Register and validate domain events through a centralized event registry." },
      ]),
    ],
  },
  {
    id: "code-quality",
    label: "Code-Quality",
    description: "Linting, typing, and commit hygiene.",
    rules: [
      rule("lint_format", "Lint/format", "Static quality gate strictness.", "balanced", [
        { id: "strict_autofix", label: "Strict autofix", emits: "Apply strict linting and formatting with mandatory autofix in CI." },
        { id: "balanced", label: "Balanced", emits: "Use balanced lint profile with warnings for non-critical style rules." },
        { id: "minimal", label: "Minimal", emits: "Use minimal linting focused on correctness and safety." },
      ]),
      rule("typing_level", "Typing level", "Type-safety policy.", "strict_ts", [
        { id: "strict_ts", label: "Strict TypeScript", emits: "Enable strict TypeScript mode and disallow unchecked any." },
        { id: "runtime_validation", label: "Runtime validation", emits: "Validate external inputs at runtime using schemas." },
        { id: "recommended_ts", label: "Recommended TS", emits: "Use recommended TypeScript strictness with targeted relaxations." },
      ]),
      rule("commit_policy", "Commit policy", "Commit message and review policy.", "conventional", [
        { id: "conventional", label: "Conventional commits", emits: "Use Conventional Commits for all repository changes." },
        { id: "template", label: "Commit template", emits: "Use a standard commit template with scope and rationale sections." },
        { id: "freeform_reviewed", label: "Freeform reviewed", emits: "Allow freeform commits but require meaningful review descriptions." },
      ]),
      rule("review_policy", "Review policy", "Code review approval expectations.", "one_owner_one_peer", [
        { id: "two_approvals", label: "Two approvals", emits: "Require two approvals for non-trivial changes before merge." },
        { id: "one_owner_one_peer", label: "Owner + peer", emits: "Require one owner approval and one peer approval for owned areas." },
        { id: "single_approval", label: "Single approval", emits: "Allow a single qualified reviewer approval for standard changes." },
      ]),
      rule("static_analysis", "Static analysis", "Static analysis and SAST enforcement.", "baseline_sast", [
        { id: "strict_sast", label: "Strict SAST", emits: "Run strict static security analysis and block merges on high-confidence findings." },
        { id: "baseline_sast", label: "Baseline SAST", emits: "Run baseline static analysis in CI and triage findings with SLA." },
        { id: "minimal_sast", label: "Minimal SAST", emits: "Run minimal static analysis focused on critical rule packs only." },
      ]),
      rule("technical_debt_policy", "Technical debt policy", "How debt is tracked and resolved.", "track_with_sla", [
        { id: "track_with_sla", label: "Track with SLA", emits: "Track technical debt issues with owners and SLA-based remediation targets." },
        { id: "capacity_allocation", label: "Capacity allocation", emits: "Reserve explicit sprint capacity for debt and maintenance work." },
        { id: "opportunistic", label: "Opportunistic", emits: "Address technical debt opportunistically during related feature changes." },
      ]),
    ],
  },
  {
    id: "docs-knowledge",
    label: "Docs-Knowledge",
    description: "Architecture docs, API docs, and release notes.",
    rules: [
      rule("adr_policy", "ADR policy", "Architecture decision recording policy.", "adr_required_major", [
        { id: "adr_required_major", label: "ADR required for major", emits: "Require ADRs for major architecture and infra decisions." },
        { id: "crosscutting_only", label: "Cross-cutting only", emits: "Require ADRs only for cross-cutting decisions." },
        { id: "lightweight", label: "Lightweight notes", emits: "Capture architecture decisions in lightweight decision notes." },
      ]),
      rule("api_docs", "API docs", "API documentation strategy.", "hybrid", [
        { id: "generated_openapi", label: "Generated OpenAPI", emits: "Generate API docs from contract source on each release." },
        { id: "handwritten_guides", label: "Handwritten guides", emits: "Maintain task-oriented handwritten API guides." },
        { id: "hybrid", label: "Hybrid", emits: "Combine generated reference docs with curated usage guides." },
      ]),
      rule("changelog_policy", "Changelog policy", "Release history publication model.", "keep_a_changelog", [
        { id: "keep_a_changelog", label: "Keep a Changelog", emits: "Maintain Keep a Changelog format with release categories." },
        { id: "auto_release_notes", label: "Auto release notes", emits: "Generate release notes automatically from merged changes." },
        { id: "manual_curated", label: "Manual curated", emits: "Curate changelog manually with editorial quality checks." },
      ]),
      rule("onboarding_docs", "Onboarding documentation", "How new contributors are onboarded.", "playbook_required", [
        { id: "playbook_required", label: "Playbook required", emits: "Maintain an onboarding playbook with local setup, architecture map, and first tasks." },
        { id: "wiki_light", label: "Light wiki", emits: "Maintain lightweight onboarding docs and rely on pairing for advanced topics." },
        { id: "pair_only", label: "Pairing-first", emits: "Rely on pairing and mentorship as primary onboarding mechanism with minimal docs." },
      ]),
      rule("runbooks", "Runbook policy", "Operational runbook requirements.", "service_runbooks_required", [
        { id: "service_runbooks_required", label: "Service runbooks required", emits: "Require runbooks for each production service with ownership and escalation steps." },
        { id: "incident_only", label: "Incident-only runbooks", emits: "Maintain runbooks only for critical incident classes and systems." },
        { id: "ad_hoc", label: "Ad-hoc runbooks", emits: "Create runbooks ad-hoc after incidents or major operational changes." },
      ]),
      rule("decision_logging", "Decision logging", "How product and technical decisions are captured.", "central_decision_log", [
        { id: "central_decision_log", label: "Central decision log", emits: "Record key product and technical decisions in a centralized searchable decision log." },
        { id: "pr_linked", label: "PR-linked decisions", emits: "Capture decisions in pull requests and link them to relevant docs." },
        { id: "meeting_notes_only", label: "Meeting notes only", emits: "Track decisions primarily in meeting notes with periodic curation." },
      ]),
    ],
  },
  {
    id: "design-system-ux",
    label: "Design-System-UX",
    description: "Tokens, theming, and localization strategy.",
    rules: [
      rule("token_strategy", "Token strategy", "Design token usage model.", "semantic_tokens", [
        { id: "semantic_tokens", label: "Semantic tokens", emits: "Use semantic design tokens as the only theming API." },
        { id: "raw_scale", label: "Raw scale", emits: "Use direct scale tokens for low-level styling decisions." },
        { id: "hybrid", label: "Hybrid", emits: "Use semantic tokens with controlled raw-token escape hatch." },
      ]),
      rule("theming", "Theming", "Theme availability model.", "light_dark", [
        { id: "light_dark", label: "Light + dark", emits: "Support light and dark themes with equivalent contrast guarantees." },
        { id: "multi_brand", label: "Multi-brand", emits: "Support multi-brand theming through token overrides." },
        { id: "single_theme", label: "Single theme", emits: "Maintain a single theme and optimize consistency." },
      ]),
      rule("i18n", "Internationalization", "Localization policy.", "icu_required", [
        { id: "icu_required", label: "ICU required", emits: "Use ICU message formatting for all user-facing text." },
        { id: "dictionary_simple", label: "Simple dictionary", emits: "Use keyed dictionary translations with locale fallbacks." },
        { id: "english_first", label: "English-first", emits: "Ship English first and localize prioritized user flows only." },
      ]),
      rule("component_documentation", "Component documentation", "How UI component usage is documented.", "storybook_required", [
        { id: "storybook_required", label: "Storybook required", emits: "Document all reusable components in Storybook with usage and accessibility notes." },
        { id: "mdx_docs_only", label: "MDX docs only", emits: "Document components through MDX pages without a dedicated Storybook runtime." },
        { id: "minimal_examples", label: "Minimal examples", emits: "Provide minimal runnable examples for core components only." },
      ]),
      rule("visual_regression", "Visual regression", "Visual testing policy for design consistency.", "per_pr_snapshots", [
        { id: "per_pr_snapshots", label: "Per-PR snapshots", emits: "Run visual snapshot checks on each pull request for impacted components." },
        { id: "nightly_snapshots", label: "Nightly snapshots", emits: "Run visual regression suites nightly and triage drift in batch." },
        { id: "manual_check", label: "Manual checks", emits: "Rely on manual visual review with checklists for release-critical UI surfaces." },
      ]),
      rule("content_design", "Content design", "How copy and UX writing standards are enforced.", "ux_copy_guidelines", [
        { id: "ux_copy_guidelines", label: "UX copy guidelines", emits: "Maintain UX copy guidelines with reusable patterns for errors, forms, and onboarding." },
        { id: "product_writer_review", label: "Writer review", emits: "Require product writer review for user-facing copy changes in critical flows." },
        { id: "developer_owned_copy", label: "Developer-owned copy", emits: "Allow developers to own copy changes with lightweight style rules." },
      ]),
    ],
  },
  {
    id: "mobile",
    label: "Mobile",
    description: "Mobile architecture, sync, and release channels.",
    rules: [
      rule("architecture", "Mobile architecture", "Application architecture on mobile.", "feature_module", [
        { id: "mvvm", label: "MVVM", emits: "Use MVVM boundaries with testable view models." },
        { id: "feature_module", label: "Feature modules", emits: "Modularize app by features with explicit navigation contracts." },
        { id: "clean_arch", label: "Clean architecture", emits: "Apply clean architecture use-cases with platform adapters." },
      ]),
      rule("sync_policy", "Sync policy", "Offline/online data synchronization approach.", "hybrid_sync", [
        { id: "offline_first", label: "Offline-first", emits: "Design local-first storage and deferred sync by default." },
        { id: "online_first", label: "Online-first", emits: "Optimize for online consistency with minimal local caching." },
        { id: "hybrid_sync", label: "Hybrid sync", emits: "Use hybrid sync strategy based on feature criticality." },
      ]),
      rule("release_channels", "Release channels", "Distribution channel strategy.", "phased_rollout", [
        { id: "stable_beta_alpha", label: "Stable/Beta/Alpha", emits: "Maintain stable, beta, and alpha channels with staged promotion." },
        { id: "phased_rollout", label: "Phased rollout", emits: "Roll out releases gradually with telemetry-based gates." },
        { id: "single_channel", label: "Single channel", emits: "Use single release channel with strict pre-release testing." },
      ]),
      rule("crash_monitoring", "Crash monitoring", "How crash metrics influence release decisions.", "block_on_crash_regression", [
        { id: "block_on_crash_regression", label: "Block on crash regression", emits: "Block release promotion when crash-free rate regresses beyond agreed thresholds." },
        { id: "monitor_only", label: "Monitor only", emits: "Track crash metrics without hard release gates and escalate by severity." },
        { id: "manual_review", label: "Manual review", emits: "Require manual crash triage signoff before promoting major releases." },
      ]),
      rule("device_support", "Device support policy", "Supported OS versions and device matrix.", "latest_two_os", [
        { id: "latest_two_os", label: "Latest two OS versions", emits: "Support the latest two major OS versions with clear deprecation timelines." },
        { id: "long_tail_support", label: "Long-tail support", emits: "Maintain extended support for older OS/device versions based on user distribution." },
        { id: "enterprise_whitelist", label: "Enterprise whitelist", emits: "Support an explicit enterprise-approved device and OS whitelist." },
      ]),
      rule("mobile_observability", "Mobile observability", "Client-side telemetry and diagnostics depth.", "structured_mobile_telemetry", [
        { id: "structured_mobile_telemetry", label: "Structured telemetry", emits: "Emit structured mobile telemetry for navigation, performance, and critical failures." },
        { id: "errors_only", label: "Errors only", emits: "Collect client crash and error telemetry only to minimize runtime overhead." },
        { id: "privacy_minimal", label: "Privacy minimal", emits: "Collect minimal client telemetry with strict privacy and consent boundaries." },
      ]),
    ],
  },
  {
    id: "data-ml",
    label: "Data-ML",
    description: "Data quality, model lifecycle, and promotion gates.",
    rules: [
      rule("data_contracts", "Data contracts", "Input dataset contract policy.", "schema_enforced", [
        { id: "schema_enforced", label: "Schema enforced", emits: "Enforce dataset schemas at ingestion and fail on contract breaks." },
        { id: "soft_validated", label: "Soft validated", emits: "Warn on schema drift and quarantine invalid partitions." },
        { id: "batch_validated", label: "Batch validated", emits: "Validate schema and quality in scheduled batch checks." },
      ]),
      rule("model_lifecycle", "Model lifecycle", "Model version governance strategy.", "registry_required", [
        { id: "registry_required", label: "Registry required", emits: "Register every model version with lineage and metadata." },
        { id: "experiment_first", label: "Experiment-first", emits: "Promote models from tracked experiments to production registry." },
        { id: "manual_versioning", label: "Manual versioning", emits: "Version models manually with mandatory release checklist." },
      ]),
      rule("evaluation_gates", "Evaluation gates", "Promotion evidence policy.", "offline_plus_online", [
        { id: "offline_plus_online", label: "Offline + online", emits: "Require offline metrics and online A/B evidence before promotion." },
        { id: "offline_only", label: "Offline only", emits: "Promote models based on offline benchmark thresholds." },
        { id: "manual_signoff", label: "Manual signoff", emits: "Require human signoff for model promotions." },
      ]),
      rule("feature_store_strategy", "Feature store strategy", "How ML features are defined and reused.", "central_feature_store", [
        { id: "central_feature_store", label: "Central feature store", emits: "Use a centralized feature store with consistent online/offline definitions." },
        { id: "code_defined_features", label: "Code-defined features", emits: "Define features in code within each model pipeline with strict review and tests." },
        { id: "hybrid_feature_store", label: "Hybrid", emits: "Use a feature store for shared features and code-defined features for model-specific logic." },
      ]),
      rule("model_monitoring", "Model monitoring", "Production model monitoring strategy.", "drift_and_performance", [
        { id: "drift_and_performance", label: "Drift + performance", emits: "Monitor data drift, prediction quality, and latency in production with alerting." },
        { id: "basic_uptime_only", label: "Basic uptime", emits: "Track service uptime and inference failures without model-quality monitoring." },
        { id: "no_online_monitoring", label: "No online monitoring", emits: "Do not monitor model behavior online beyond application-level observability." },
      ]),
      rule("retraining_policy", "Retraining policy", "How and when models are retrained.", "scheduled_retraining", [
        { id: "scheduled_retraining", label: "Scheduled retraining", emits: "Retrain models on a defined schedule with validation and staged rollout." },
        { id: "event_triggered", label: "Event-triggered retraining", emits: "Trigger retraining from drift, data shift, or business KPI thresholds." },
        { id: "manual_cycle", label: "Manual cycle", emits: "Run retraining manually through explicit review and release planning." },
      ]),
    ],
  },
  {
    id: "infra-platform",
    label: "Infra-Platform",
    description: "Infrastructure management and cost governance.",
    rules: [
      rule("iac", "Infrastructure as code", "Provisioning tool strategy.", "terraform", [
        { id: "terraform", label: "Terraform", emits: "Manage infrastructure declaratively with Terraform modules." },
        { id: "pulumi", label: "Pulumi", emits: "Manage infrastructure as typed code with Pulumi." },
        { id: "manual_reviewed", label: "Manual reviewed", emits: "Allow manual infra changes only with audited change requests." },
      ]),
      rule("environment_strategy", "Environment strategy", "Environment topology strategy.", "dev_stage_prod", [
        { id: "dev_stage_prod", label: "Dev/Stage/Prod", emits: "Maintain dev, stage, and prod with controlled promotion." },
        { id: "ephemeral_preview", label: "Ephemeral preview", emits: "Create ephemeral preview environments per change request." },
        { id: "prod_mirror", label: "Prod-mirror stage", emits: "Use staging environment that mirrors production topology." },
      ]),
      rule("cost_controls", "Cost controls", "Cost monitoring strategy.", "budgets_alerts", [
        { id: "budgets_alerts", label: "Budgets + alerts", emits: "Set per-environment budget alerts and ownership tags." },
        { id: "unit_cost", label: "Unit cost", emits: "Track unit economics per feature/workload." },
        { id: "monthly_review", label: "Monthly review", emits: "Run monthly cost review with optimization actions." },
      ]),
      rule("policy_as_code", "Policy as code", "How infrastructure policy controls are enforced.", "opa_required", [
        { id: "opa_required", label: "OPA required", emits: "Enforce infrastructure policies as code with OPA checks in CI." },
        { id: "sentinel", label: "Sentinel", emits: "Apply policy checks through Terraform Sentinel in plan/apply workflows." },
        { id: "manual_policy_review", label: "Manual review", emits: "Review infra policy compliance manually during code review and change approval." },
      ]),
      rule("disaster_recovery", "Disaster recovery", "Disaster recovery planning and validation cadence.", "tested_quarterly", [
        { id: "tested_quarterly", label: "Quarterly tested DR", emits: "Test disaster recovery procedures quarterly with documented RTO/RPO outcomes." },
        { id: "documented_not_tested", label: "Documented only", emits: "Maintain DR documentation without regular failover simulations." },
        { id: "best_effort", label: "Best effort", emits: "Apply best-effort DR practices without formal testing commitments." },
      ]),
      rule("provisioning_governance", "Provisioning governance", "How infrastructure changes are approved and audited.", "tracked_change_requests", [
        { id: "tracked_change_requests", label: "Tracked change requests", emits: "Require tracked change requests with auditable links to IaC pull requests." },
        { id: "self_service_with_guardrails", label: "Self-service + guardrails", emits: "Allow self-service provisioning within predefined policy guardrails." },
        { id: "platform_team_only", label: "Platform team only", emits: "Restrict infrastructure provisioning rights to the platform team." },
      ]),
    ],
  },
  {
    id: "containers-runtime",
    label: "Containers-Runtime",
    description: "Container base images and runtime hardening.",
    rules: [
      rule("image_policy", "Image policy", "Container base image policy.", "distroless", [
        { id: "distroless", label: "Distroless", emits: "Use distroless runtime images whenever feasible." },
        { id: "slim_base", label: "Slim base", emits: "Use slim base images with pinned digests." },
        { id: "full_base", label: "Full base", emits: "Use full base images only when required by runtime tooling." },
      ]),
      rule("runtime_security", "Runtime security", "Container runtime hardening controls.", "non_root", [
        { id: "non_root", label: "Non-root", emits: "Run containers as non-root with least privileges." },
        { id: "readonly_fs", label: "Read-only FS", emits: "Use read-only filesystem and explicit writable mounts." },
        { id: "rootless_runtime", label: "Rootless runtime", emits: "Prefer rootless container runtime in production clusters." },
      ]),
      rule("image_scanning", "Image scanning", "Vulnerability scanning enforcement.", "block_high_critical", [
        { id: "block_high_critical", label: "Block high/critical", emits: "Block releases with unresolved high/critical vulnerabilities." },
        { id: "report_only", label: "Report only", emits: "Report vulnerabilities without blocking deploy." },
        { id: "scheduled_blocking", label: "Scheduled blocking", emits: "Apply blocking policy on scheduled security releases." },
      ]),
      rule("build_reproducibility", "Build reproducibility", "Container build reproducibility requirements.", "pinned_digests_required", [
        { id: "pinned_digests_required", label: "Pinned digests required", emits: "Pin base image digests and lock build inputs for reproducible container builds." },
        { id: "partial_pin", label: "Partial pinning", emits: "Pin critical images while allowing controlled floating tags for low-risk build stages." },
        { id: "floating_dev", label: "Floating in dev", emits: "Allow floating tags in development and enforce pinning for production images." },
      ]),
      rule("resource_limits", "Resource limits", "Default CPU and memory limit policy.", "limits_required", [
        { id: "limits_required", label: "Limits required", emits: "Require CPU and memory requests/limits for all container workloads." },
        { id: "best_effort_limits", label: "Best-effort limits", emits: "Apply resource limits to production workloads and best-effort in non-production." },
        { id: "no_limits", label: "No limits", emits: "Do not enforce default resource limits at container runtime level." },
      ]),
      rule("runtime_hardening", "Runtime hardening", "Runtime hardening controls beyond base image policy.", "seccomp_apparmor", [
        { id: "seccomp_apparmor", label: "Seccomp/AppArmor", emits: "Enforce seccomp and AppArmor profiles for production container workloads." },
        { id: "namespace_isolation", label: "Namespace isolation", emits: "Strengthen namespace and capability isolation for sensitive services." },
        { id: "minimal_hardening", label: "Minimal hardening", emits: "Apply minimal runtime hardening and focus on network and identity controls." },
      ]),
    ],
  },
  {
    id: "performance",
    label: "Performance",
    description: "Performance budgets, caching, and load testing.",
    rules: [
      rule("budgets", "Performance budgets", "Primary performance KPI policy.", "p95_latency", [
        { id: "web_vitals", label: "Core Web Vitals", emits: "Enforce Core Web Vitals budgets in CI for web surfaces." },
        { id: "p95_latency", label: "p95 latency", emits: "Enforce p95 latency budgets on critical endpoints." },
        { id: "throughput_targets", label: "Throughput targets", emits: "Track throughput targets and alert on sustained regression." },
      ]),
      rule("caching", "Caching", "Caching layer strategy.", "cdn_edge", [
        { id: "cdn_edge", label: "CDN edge", emits: "Cache static and cacheable responses at CDN edge." },
        { id: "app_cache", label: "Application cache", emits: "Use application-level caches with explicit invalidation keys." },
        { id: "selective_cache", label: "Selective cache", emits: "Apply caching only to proven hot paths." },
      ]),
      rule("load_testing", "Load testing", "Load-test execution cadence.", "per_pr_smoke", [
        { id: "per_pr_smoke", label: "Per-PR smoke", emits: "Run lightweight load smoke tests on pull requests." },
        { id: "nightly_heavy", label: "Nightly heavy", emits: "Run heavy load suites nightly and track trends." },
        { id: "pre_release", label: "Pre-release", emits: "Run full load tests as release gate only." },
      ]),
      rule("profiling_policy", "Profiling policy", "How profiling is performed in environments.", "continuous_profiling", [
        { id: "continuous_profiling", label: "Continuous profiling", emits: "Run continuous profiling in production with overhead budgets and retention policy." },
        { id: "scheduled_profiling", label: "Scheduled profiling", emits: "Run profiling sessions on schedule and during major releases." },
        { id: "on_demand_only", label: "On-demand only", emits: "Run profiling only during incident response or targeted optimization efforts." },
      ]),
      rule("bundle_policy", "Bundle policy", "Frontend bundle governance for web clients.", "budget_per_route", [
        { id: "budget_per_route", label: "Per-route budgets", emits: "Enforce per-route bundle budgets and block regressions in CI." },
        { id: "global_budget", label: "Global budget", emits: "Maintain a global bundle size budget with trend reporting." },
        { id: "no_budget", label: "No budget", emits: "Do not enforce formal frontend bundle budgets in CI." },
      ]),
      rule("query_performance", "Query performance", "Backend query performance governance.", "p95_query_slo", [
        { id: "p95_query_slo", label: "p95 query SLO", emits: "Set p95 latency SLOs for critical queries and alert on regressions." },
        { id: "top_n_queries", label: "Top-N queries", emits: "Track and optimize the top-N heaviest queries by resource usage." },
        { id: "incident_driven", label: "Incident-driven tuning", emits: "Tune query performance primarily when incidents or severe regressions occur." },
      ]),
    ],
  },
  {
    id: "collaboration-governance",
    label: "Collaboration-Governance",
    description: "Team process, incident model, and ownership.",
    rules: [
      rule("rfc_process", "RFC process", "Decision proposal process.", "rfc_required_major", [
        { id: "rfc_required_major", label: "RFC required for major", emits: "Require RFCs for major product or architecture changes." },
        { id: "lightweight_template", label: "Lightweight template", emits: "Use lightweight RFC template for medium-impact changes." },
        { id: "ad_hoc", label: "Ad-hoc", emits: "Allow ad-hoc proposals with mandatory decision logging." },
      ]),
      rule("incident_management", "Incident management", "Operational incident response model.", "oncall_postmortem", [
        { id: "oncall_postmortem", label: "On-call + postmortem", emits: "Use on-call rotation with blameless postmortems for incidents." },
        { id: "business_hours", label: "Business-hours", emits: "Use business-hours incident response with severity matrix." },
        { id: "outsourced", label: "Outsourced", emits: "Route first-line incident handling to external operations provider." },
      ]),
      rule("ownership", "Ownership", "Code/service ownership policy.", "codeowners_required", [
        { id: "codeowners_required", label: "CODEOWNERS required", emits: "Require CODEOWNERS approvals for owned paths." },
        { id: "team_conventions", label: "Team conventions", emits: "Assign ownership by team conventions and service registry." },
        { id: "no_formal", label: "No formal ownership", emits: "Use implicit ownership with issue triage fallback." },
      ]),
      rule("decision_latency", "Decision latency", "Expected speed for technical decision-making.", "bounded_rfc_timelines", [
        { id: "single_decider", label: "Single decider", emits: "Assign clear decision owners to keep decision cycles short." },
        { id: "consensus", label: "Consensus", emits: "Use consensus-based decision-making for major cross-team changes." },
        { id: "bounded_rfc_timelines", label: "Bounded RFC timelines", emits: "Use RFC timelines with explicit deadlines and fallback decision ownership." },
      ]),
      rule("meeting_policy", "Meeting policy", "Synchronous vs asynchronous collaboration balance.", "async_first", [
        { id: "async_first", label: "Async-first", emits: "Prefer asynchronous collaboration and use meetings only for high-bandwidth decisions." },
        { id: "weekly_sync", label: "Weekly sync", emits: "Run lightweight weekly sync meetings with async updates by default." },
        { id: "sync_heavy", label: "Sync-heavy", emits: "Rely on frequent synchronous rituals for planning and coordination." },
      ]),
      rule("escalation_policy", "Escalation policy", "How unresolved blockers are escalated.", "timeboxed_escalation", [
        { id: "timeboxed_escalation", label: "Timeboxed escalation", emits: "Escalate unresolved blockers after explicit timeboxes with accountable owners." },
        { id: "manager_driven", label: "Manager-driven", emits: "Route escalations through engineering management chain by default." },
        { id: "peer_escalation", label: "Peer escalation", emits: "Favor peer-to-peer escalation before formal management escalation." },
      ]),
    ],
  },
  {
    id: "package-management",
    label: "Package-Management",
    description: "Dependency and package topology management.",
    rules: [
      rule("workspace_model", "Workspace model", "Repository packaging topology.", "single_package", [
        { id: "bun_workspaces", label: "Bun workspaces", emits: "Use Bun workspaces for multi-package repositories." },
        { id: "single_package", label: "Single package", emits: "Keep single-package repo and avoid premature workspace split." },
        { id: "multi_repo", label: "Multi-repo", emits: "Split domains into multiple repos with explicit interfaces." },
      ]),
      rule("dependency_updates", "Dependency updates", "Dependency update cadence.", "weekly_bot", [
        { id: "weekly_bot", label: "Weekly bot", emits: "Automate weekly dependency update pull requests." },
        { id: "monthly_batch", label: "Monthly batch", emits: "Batch dependency updates monthly with focused verification." },
        { id: "manual_only", label: "Manual only", emits: "Update dependencies manually with explicit planning." },
      ]),
      rule("internal_versioning", "Internal versioning", "Internal package versioning strategy.", "changesets", [
        { id: "changesets", label: "Changesets", emits: "Use Changesets for internal package versioning and release notes." },
        { id: "fixed_version", label: "Fixed version", emits: "Version all internal packages together with fixed versioning." },
        { id: "independent", label: "Independent", emits: "Version internal packages independently by change scope." },
      ]),
      rule("lockfile_policy", "Lockfile policy", "How lockfiles are managed in development and CI.", "mandatory_lockfile_updates", [
        { id: "mandatory_lockfile_updates", label: "Mandatory lockfile updates", emits: "Require lockfile updates in every dependency change and enforce in CI." },
        { id: "ci_generated", label: "CI-generated lockfile", emits: "Allow CI to generate lockfile updates for dependency maintenance workflows." },
        { id: "optional_lockfile", label: "Optional lockfile", emits: "Treat lockfile updates as optional outside release preparation workflows." },
      ]),
      rule("license_compliance", "License compliance", "Open-source license governance policy.", "allowlist_enforced", [
        { id: "allowlist_enforced", label: "Allowlist enforced", emits: "Enforce dependency license allowlists and block non-compliant additions." },
        { id: "release_review", label: "Release review", emits: "Review dependency licenses during release readiness checks." },
        { id: "no_formal_policy", label: "No formal policy", emits: "Do not enforce formal dependency license compliance policy." },
      ]),
      rule("registry_policy", "Registry policy", "How package registries are used and secured.", "private_proxy_registry", [
        { id: "private_proxy_registry", label: "Private proxy registry", emits: "Use a private proxy registry with caching, provenance, and access controls." },
        { id: "public_registry_direct", label: "Public registry direct", emits: "Install packages directly from public registries with scoped credentials." },
        { id: "mixed_registries", label: "Mixed registries", emits: "Use mixed public/private registries with explicit package source pinning." },
      ]),
    ],
  },
];

export const CATALOG_BY_ID = new Map(RULES_CATALOG.map((category) => [category.id, category]));

export const PRESETS: Record<string, string[]> = {
  balanced: RULES_CATALOG.map((category) => category.id),
  web: [
    "frontend",
    "backend",
    "sql-data",
    "api-contracts",
    "security",
    "testing",
    "observability",
    "ci-cd",
    "architecture",
    "code-quality",
    "docs-knowledge",
    "performance",
    "package-management",
  ],
};

export function getCategoryById(categoryId: string): CategoryDefinition | undefined {
  return CATALOG_BY_ID.get(categoryId);
}
