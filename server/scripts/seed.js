require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const User = require('../models/User');
const CandidateProfile = require('../models/CandidateProfile');
const ReviewerProfile = require('../models/ReviewerProfile');
const RecruiterProfile = require('../models/RecruiterProfile');
const Organization = require('../models/Organization');
const Challenge = require('../models/Challenge');
const Submission = require('../models/Submission');
const Project = require('../models/Project');
const ADR = require('../models/ADR');
const AutomatedCheck = require('../models/AutomatedCheck');
const Review = require('../models/Review');
const DefenseRound = require('../models/DefenseRound');
const CapabilityScore = require('../models/CapabilityScore');
const Opportunity = require('../models/Opportunity');
const AuditLog = require('../models/AuditLog');
const Job = require('../models/Job');
const Assessment = require('../models/Assessment');
const Application = require('../models/Application');
const Interview = require('../models/Interview');
const Notification = require('../models/Notification');

const DEMO_PASSWORD = process.env.DEMO_USER_PASSWORD || 'ProofWork2026!';

async function seedDatabase() {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/proofline';
  console.log(`[SEED] Connecting to MongoDB: ${uri}`);
  await mongoose.connect(uri);

  console.log('[SEED] Clearing existing collections...');
  await Promise.all([
    User.deleteMany({}),
    CandidateProfile.deleteMany({}),
    ReviewerProfile.deleteMany({}),
    RecruiterProfile.deleteMany({}),
    Organization.deleteMany({}),
    Challenge.deleteMany({}),
    Submission.deleteMany({}),
    Project.deleteMany({}),
    ADR.deleteMany({}),
    AutomatedCheck.deleteMany({}),
    Review.deleteMany({}),
    DefenseRound.deleteMany({}),
    CapabilityScore.deleteMany({}),
    Opportunity.deleteMany({}),
    AuditLog.deleteMany({}),
    Job.deleteMany({}),
    Assessment.deleteMany({}),
    Application.deleteMany({}),
    Interview.deleteMany({}),
    Notification.deleteMany({}),
  ]);

  console.log('[SEED] Generating secure password hashes...');
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, salt);

  // 1. ORGANIZATIONS
  console.log('[SEED] Seeding 3 verified organizations...');
  const orgs = await Organization.create([
    {
      name: 'Stripe',
      slug: 'stripe',
      domain: 'stripe.com',
      verified: true,
      hiringDomains: ['Distributed Systems', 'Backend APIs', 'Database Engineering'],
      logoUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=100&auto=format&fit=crop&q=80',
      description: 'Financial infrastructure for the internet powering millions of businesses.',
    },
    {
      name: 'Cloudflare',
      slug: 'cloudflare',
      domain: 'cloudflare.com',
      verified: true,
      hiringDomains: ['Edge Computing', 'Network Security', 'High-Throughput Systems'],
      logoUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=100&auto=format&fit=crop&q=80',
      description: 'Building a better, faster, and more private global internet backbone.',
    },
    {
      name: 'Datadog',
      slug: 'datadog',
      domain: 'datadoghq.com',
      verified: true,
      hiringDomains: ['Observability', 'Real-time Telemetry Stream Processing', 'Go/Rust Systems'],
      logoUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=100&auto=format&fit=crop&q=80',
      description: 'Monitoring and security platform for cloud applications and distributed fleets.',
    },
  ]);

  // 2. ADMIN USER
  console.log('[SEED] Seeding Admin user...');
  const adminUser = await User.create({
    name: 'Platform Administrator',
    email: 'admin@proofline.dev',
    passwordHash,
    role: 'ADMIN',
    emailVerified: true,
    status: 'ACTIVE',
  });

  // 3. REVIEWERS (5 Calibrated Experts)
  console.log('[SEED] Seeding 5 Calibrated Expert Reviewers...');
  const reviewerData = [
    {
      name: 'Dr. Vikram Malhotra',
      email: 'vikram.reviewer@proofline.dev',
      domains: ['Distributed Systems', 'Storage Engines', 'Consensus Algorithms'],
      lang: 'Rust / C++',
      exp: 12,
      rri: 1.45,
    },
    {
      name: 'Sarah Jenkins',
      email: 'sarah.reviewer@proofline.dev',
      domains: ['High-Concurrency APIs', 'Database Optimization', 'Go'],
      lang: 'Go / TypeScript',
      exp: 9,
      rri: 1.35,
    },
    {
      name: 'Alexandre Dubois',
      email: 'alex.reviewer@proofline.dev',
      domains: ['Defensive Security', 'Cryptography', 'SAST Auditing'],
      lang: 'C / Rust',
      exp: 11,
      rri: 1.5,
    },
    {
      name: 'Mei-Ling Zhou',
      email: 'meiling.reviewer@proofline.dev',
      domains: ['Cloud Infrastructure', 'Chaos Engineering', 'Kubernetes'],
      lang: 'Go / Python',
      exp: 8,
      rri: 1.25,
    },
    {
      name: 'Carlos Mendoza',
      email: 'carlos.reviewer@proofline.dev',
      domains: ['API Design', 'Event-Driven Architectures', 'Node.js'],
      lang: 'TypeScript / Node.js',
      exp: 7,
      rri: 1.15,
    },
  ];

  const reviewers = [];
  for (const r of reviewerData) {
    const u = await User.create({
      name: r.name,
      email: r.email,
      passwordHash,
      role: 'REVIEWER',
      emailVerified: true,
      status: 'ACTIVE',
    });
    const profile = await ReviewerProfile.create({
      userId: u._id,
      expertiseDomains: r.domains,
      primaryLanguage: r.lang,
      yearsExperience: r.exp,
      reliabilityIndex: r.rri,
      reviewsCompleted: 14,
    });
    reviewers.push({ user: u, profile });
  }

  // 4. RECRUITERS
  console.log('[SEED] Seeding Recruiters from verified organizations...');
  const recruiterData = [
    {
      name: 'Rachel Sterling',
      email: 'rachel@stripe.com',
      org: orgs[0],
      title: 'Head of Infrastructure Talent',
    },
    {
      name: 'Tariq Al-Mansoor',
      email: 'tariq@cloudflare.com',
      org: orgs[1],
      title: 'Principal Technical Sourcer - Edge Systems',
    },
    {
      name: 'Jessica Walsh',
      email: 'jessica@datadoghq.com',
      org: orgs[2],
      title: 'Director of Systems Engineering Recruiting',
    },
  ];

  const recruiters = [];
  for (const rec of recruiterData) {
    const u = await User.create({
      name: rec.name,
      email: rec.email,
      passwordHash,
      role: 'RECRUITER',
      emailVerified: true,
      status: 'ACTIVE',
    });
    const profile = await RecruiterProfile.create({
      userId: u._id,
      organizationId: rec.org._id,
      title: rec.title,
      hiringFocus: ['Distributed Systems', 'Backend Engineering', 'P99 Optimization'],
    });
    recruiters.push({ user: u, profile, org: rec.org });
  }

  // 5. 15 REAL-WORLD ENGINEERING CHALLENGES
  console.log('[SEED] Seeding 15 Real-World Engineering Challenges...');
  const challenges = await Challenge.create([
    {
      title: 'High-Concurrency Ticket Booking API',
      slug: 'high-concurrency-ticket-booking-api',
      domain: 'DISTRIBUTED_SYSTEMS',
      difficulty: 'ADVANCED',
      difficultyWeight: 1.4,
      timeEstimateHours: 6,
      summary:
        'Architect a resilient flash-sale ticketing engine preventing overselling under 25,000 concurrent purchase requests.',
      businessContext:
        'Concert ticket sales trigger massive flash-crowds where 50,000 fans vie for 5,000 seats in 10 seconds. Traditional database row-locks cause connection pool starvation and CPU saturation.',
      requirements: [
        'Enforce strict zero-double-booking guarantee under concurrent thread contention.',
        'Implement optimistic locking with version checks or atomics to eliminate deadlocks.',
        'Sustain P99 response latency < 5ms under 20,000 req/sec.',
        'Provide automated test harness verifying race-condition resilience with ThreadSanitizer or goroutines.',
      ],
      constraints: {
        p99LatencyTargetMs: 5,
        minThroughputRps: 20000,
        memoryCeilingMb: 512,
        zeroDataLoss: true,
      },
      skills: ['Concurrency', 'Redis', 'PostgreSQL', 'Lock-Free Data Structures', 'Go/TypeScript'],
      evaluationCriteria: [
        'Correctness under high thread contention',
        'Clean isolation of seat reservation state',
        'P99 latency benchmarks',
        'Thorough ADR explaining locking trade-offs',
      ],
      hiddenTestsCount: 24,
      totalSubmissionsCount: 42,
    },
    {
      title: 'Idempotent Payment Webhook Ingestion Engine',
      slug: 'idempotent-payment-webhook-ingestion',
      domain: 'BACKEND_API',
      difficulty: 'PRODUCTION',
      difficultyWeight: 1.0,
      timeEstimateHours: 4,
      summary:
        'Build a fault-tolerant webhook receiver processing out-of-order and duplicated Stripe/Adyen payloads with zero duplicate transactions.',
      businessContext:
        'Payment gateways send webhook retries over unreliable networks. Multiple webhooks for the same invoice can arrive out-of-order or simultaneously.',
      requirements: [
        'Idempotency key locking with distributed TTL deduplication window.',
        'Guaranteed exactly-once side-effect fulfillment (ledger credit).',
        'Graceful recovery and DLQ (Dead Letter Queue) routing for corrupted payloads.',
      ],
      constraints: {
        p99LatencyTargetMs: 15,
        minThroughputRps: 8000,
        memoryCeilingMb: 256,
        zeroDataLoss: true,
      },
      skills: ['Node.js', 'PostgreSQL', 'Redis', 'Idempotency', 'API Security'],
      evaluationCriteria: ['Idempotency key race condition safety', 'Transactional atomicity', 'Error handling'],
      hiddenTestsCount: 18,
      totalSubmissionsCount: 58,
    },
    {
      title: 'Distributed Write-Ahead Log (WAL) Storage Engine',
      slug: 'distributed-wal-storage-engine',
      domain: 'DATABASE_ENGINEERING',
      difficulty: 'STAFF',
      difficultyWeight: 1.85,
      timeEstimateHours: 10,
      summary:
        'Construct a crash-safe append-only Write-Ahead Log with fsync guarantees, memory memtables, and SSTable segment compaction.',
      businessContext:
        'Modern databases like RocksDB and Cassandra rely on append-only WALs to guarantee ACID durability across catastrophic power failure.',
      requirements: [
        'Zero data corruption under simulated SIGKILL or abrupt OS power cut.',
        'Sequential disk writes minimizing head seek latency.',
        'Background log segment compaction with tombstone garbage collection.',
      ],
      constraints: {
        p99LatencyTargetMs: 2,
        minThroughputRps: 50000,
        memoryCeilingMb: 1024,
        zeroDataLoss: true,
      },
      skills: ['Storage Engines', 'Rust/C++', 'OS File I/O', 'Memory Mapped Files'],
      evaluationCriteria: ['Crash safety proof', 'Compaction performance', 'Clean binary serialization'],
      hiddenTestsCount: 30,
      totalSubmissionsCount: 18,
    },
    {
      title: 'Sliding-Window Distributed Rate Limiting Gateway',
      slug: 'sliding-window-rate-limiting-gateway',
      domain: 'BACKEND_API',
      difficulty: 'PRODUCTION',
      difficultyWeight: 1.0,
      timeEstimateHours: 4,
      summary:
        'Implement an ultra-low-latency API gateway middleware enforcing per-IP and per-token sliding-window counters across 40,000 RPS.',
      businessContext:
        'API abuse and credential stuffing attacks demand rate limiters that avoid the burstiness of fixed windows without consuming prohibitive Redis memory.',
      requirements: [
        'Sub-millisecond P99 overhead (< 1ms).',
        'Redis Lua script or atomic in-memory sliding window log.',
        'Graceful bypass degradation on cache timeout.',
      ],
      constraints: {
        p99LatencyTargetMs: 1,
        minThroughputRps: 40000,
        memoryCeilingMb: 256,
        zeroDataLoss: false,
      },
      skills: ['Redis', 'Lua', 'Reverse Proxies', 'Go', 'API Security'],
      evaluationCriteria: ['P99 latency contribution', 'Accuracy of sliding window boundary'],
      hiddenTestsCount: 16,
      totalSubmissionsCount: 76,
    },
    {
      title: 'Raft Consensus State Machine Implementation',
      slug: 'raft-consensus-state-machine',
      domain: 'DISTRIBUTED_SYSTEMS',
      difficulty: 'STAFF',
      difficultyWeight: 1.85,
      timeEstimateHours: 12,
      summary:
        'Implement leader election, log replication, and split-brain resolution for a 5-node cluster under asymmetric network partitions.',
      businessContext:
        'Cloud orchestration requires quorum-based consensus state machines that maintain linearizable consistency despite network failure.',
      requirements: [
        'Heartbeat timers with randomized election timeouts.',
        'Quorum-based log commitment ($N/2 + 1$).',
        'Healing after sustained network split.',
      ],
      constraints: {
        p99LatencyTargetMs: 20,
        minThroughputRps: 5000,
        memoryCeilingMb: 512,
        zeroDataLoss: true,
      },
      skills: ['Distributed Systems', 'Raft', 'Go/Rust', 'Network Partitions'],
      evaluationCriteria: ['Safety invariant proof under chaos', 'Leader transition stability'],
      hiddenTestsCount: 28,
      totalSubmissionsCount: 15,
    },
    {
      title: 'Zero-Allocation JSON Parser & Stream Deserializer',
      slug: 'zero-allocation-json-parser',
      domain: 'PERFORMANCE_DEBUGGING',
      difficulty: 'ADVANCED',
      difficultyWeight: 1.4,
      timeEstimateHours: 6,
      summary:
        'Build an ultra-fast streaming JSON parser that parses multi-gigabyte payloads with zero heap allocations during tokenization.',
      businessContext:
        'Garbage collection pauses in high-throughput microservices are overwhelmingly caused by short-lived object allocations during JSON parsing.',
      requirements: [
        'Zero heap allocations in the critical parsing loop.',
        'SIMD-accelerated string scanning where supported.',
        'Proper error reporting with line/column syntax diagnostics.',
      ],
      constraints: {
        p99LatencyTargetMs: 3,
        minThroughputRps: 100000,
        memoryCeilingMb: 128,
        zeroDataLoss: true,
      },
      skills: ['Performance', 'Memory Management', 'C++/Rust/Go', 'SIMD'],
      evaluationCriteria: ['Benchmark allocation count = 0', 'Handling of escape characters and floats'],
      hiddenTestsCount: 20,
      totalSubmissionsCount: 24,
    },
    {
      title: 'OAuth 2.1 & PKCE Hardened Identity Provider',
      slug: 'oauth-pkce-hardened-idp',
      domain: 'SECURITY_AUDIT',
      difficulty: 'PRODUCTION',
      difficultyWeight: 1.0,
      timeEstimateHours: 5,
      summary:
        'Implement a secure identity provider featuring Authorization Code Flow with PKCE, asymmetric JWT signing, and rotation.',
      businessContext:
        'Single Page Apps and mobile clients cannot securely store client secrets; PKCE prevents authorization code interception attacks.',
      requirements: [
        'SHA-256 code challenge and code verifier validation.',
        'Token rotation with automatic family revocation on token reuse.',
        'Timing-safe cryptographic comparisons.',
      ],
      constraints: {
        p99LatencyTargetMs: 25,
        minThroughputRps: 3000,
        memoryCeilingMb: 256,
        zeroDataLoss: true,
      },
      skills: ['OAuth2', 'PKCE', 'JWT', 'Security Architecture', 'Node.js/Go'],
      evaluationCriteria: ['Replay attack resistance', 'Strict timing-safe crypto'],
      hiddenTestsCount: 16,
      totalSubmissionsCount: 39,
    },
    {
      title: 'PostgreSQL Index & Slow Query Optimization',
      slug: 'postgresql-slow-query-optimization',
      domain: 'DATABASE_ENGINEERING',
      difficulty: 'PRODUCTION',
      difficultyWeight: 1.0,
      timeEstimateHours: 4,
      summary:
        'Diagnose and optimize a 10-million row relational database schema suffering from sequential scans and lock contention.',
      businessContext:
        'An analytics dashboard querying multi-tenant audit logs is timing out under read-write contention.',
      requirements: [
        'Eliminate all sequential scans on tables > 100k rows.',
        'Design composite B-Tree and BRIN indexes for time-series ranges.',
        'Refactor N+1 join queries into optimal window functions.',
      ],
      constraints: {
        p99LatencyTargetMs: 8,
        minThroughputRps: 12000,
        memoryCeilingMb: 1024,
        zeroDataLoss: true,
      },
      skills: ['PostgreSQL', 'EXPLAIN ANALYZE', 'BRIN Indexes', 'Query Optimization'],
      evaluationCriteria: ['Execution plan cost reduction > 90%', 'Index size to table ratio'],
      hiddenTestsCount: 15,
      totalSubmissionsCount: 65,
    },
    {
      title: 'Multi-Tenant Kubernetes Operator & CRD Controller',
      slug: 'kubernetes-multi-tenant-operator',
      domain: 'DEVOPS_INFRASTRUCTURE',
      difficulty: 'ADVANCED',
      difficultyWeight: 1.4,
      timeEstimateHours: 7,
      summary:
        'Build a Kubernetes custom controller reconciling tenant namespaces, network policies, and isolated resource quotas.',
      businessContext:
        'Enterprise SaaS requires self-service provisioning of isolated tenant environments with zero cross-tenant network leakage.',
      requirements: [
        'CRD controller reconciling state within 2 seconds of spec change.',
        'Strict Calico/Cilium network policy generation.',
        'Graceful finalizer cleanup on tenant de-provisioning.',
      ],
      constraints: {
        p99LatencyTargetMs: 100,
        minThroughputRps: 500,
        memoryCeilingMb: 256,
        zeroDataLoss: true,
      },
      skills: ['Kubernetes', 'Go', 'KubeBuilder', 'Network Policies'],
      evaluationCriteria: ['Idempotent reconciliation loop', 'Zero resource leaks'],
      hiddenTestsCount: 14,
      totalSubmissionsCount: 19,
    },
    {
      title: 'Real-Time Financial Order Matching Engine',
      slug: 'real-time-order-matching-engine',
      domain: 'DISTRIBUTED_SYSTEMS',
      difficulty: 'STAFF',
      difficultyWeight: 1.85,
      timeEstimateHours: 12,
      summary:
        'Implement an in-memory Limit Order Book (LOB) matching buy and sell orders with FIFO price-time priority under microsecond latencies.',
      businessContext:
        'Crypto and equities exchanges require deterministic order matching with zero race conditions between order cancellations and executions.',
      requirements: [
        'Price-time priority matching algorithm.',
        'Continuous order book depth snapshotting.',
        'Sub-100 microsecond execution latency.',
      ],
      constraints: {
        p99LatencyTargetMs: 1,
        minThroughputRps: 75000,
        memoryCeilingMb: 512,
        zeroDataLoss: true,
      },
      skills: ['C++', 'Rust', 'Order Books', 'Low Latency', 'Memory Layout'],
      evaluationCriteria: ['Deterministic trade generation', 'Microsecond latency benchmark'],
      hiddenTestsCount: 26,
      totalSubmissionsCount: 12,
    },
    {
      title: 'End-to-End Encrypted Messaging Relay',
      slug: 'e2ee-messaging-relay',
      domain: 'SECURITY_AUDIT',
      difficulty: 'ADVANCED',
      difficultyWeight: 1.4,
      timeEstimateHours: 6,
      summary:
        'Construct a Signal Protocol-compatible double ratchet message relay server supporting offline pre-key bundles and forward secrecy.',
      businessContext:
        'Secure communication tools must forward encrypted payloads without having access to cryptographic keys.',
      requirements: [
        'X3DH pre-key bundle management.',
        'Zero-knowledge storage of message contents.',
        'Protection against replay and MITM attacks.',
      ],
      constraints: {
        p99LatencyTargetMs: 20,
        minThroughputRps: 15000,
        memoryCeilingMb: 512,
        zeroDataLoss: true,
      },
      skills: ['Cryptography', 'Signal Protocol', 'WebSockets', 'Go/Rust'],
      evaluationCriteria: ['Forward secrecy verification', 'Replay protection'],
      hiddenTestsCount: 22,
      totalSubmissionsCount: 22,
    },
    {
      title: 'Distributed Tracing & Span Collector Service',
      slug: 'distributed-tracing-collector',
      domain: 'DEVOPS_INFRASTRUCTURE',
      difficulty: 'PRODUCTION',
      difficultyWeight: 1.0,
      timeEstimateHours: 5,
      summary:
        'Build an OpenTelemetry-compatible span ingestion buffer that handles bursty trace packets with tail-based sampling.',
      businessContext:
        'High-traffic microservice architectures generate terabytes of trace data; tail-based sampling retains traces containing errors while dropping mundane 200 OKs.',
      requirements: [
        'OTLP gRPC/HTTP span receiver.',
        'Adaptive tail-sampling retaining 100% of spans with HTTP 5xx or latency > 500ms.',
        'Ring buffer memory management.',
      ],
      constraints: {
        p99LatencyTargetMs: 10,
        minThroughputRps: 35000,
        memoryCeilingMb: 512,
        zeroDataLoss: false,
      },
      skills: ['OpenTelemetry', 'gRPC', 'Distributed Tracing', 'Go'],
      evaluationCriteria: ['Tail-sampling accuracy', 'Low collector overhead'],
      hiddenTestsCount: 18,
      totalSubmissionsCount: 31,
    },
    {
      title: 'Fault-Tolerant Distributed Job Scheduler',
      slug: 'fault-tolerant-job-scheduler',
      domain: 'SYSTEM_DESIGN',
      difficulty: 'ADVANCED',
      difficultyWeight: 1.4,
      timeEstimateHours: 7,
      summary:
        'Architect a distributed cron and delayed task runner guaranteeing exactly-once execution across a cluster of dynamic worker nodes.',
      businessContext:
        'Critical background operations (billing cycles, report generation) must execute on schedule even if the coordinating node crashes.',
      requirements: [
        'Heartbeat worker leases with automatic failover.',
        'Delayed queueing via Redis Sorted Sets or DB skips.',
        'Idempotent job execution guards.',
      ],
      constraints: {
        p99LatencyTargetMs: 20,
        minThroughputRps: 10000,
        memoryCeilingMb: 512,
        zeroDataLoss: true,
      },
      skills: ['Job Queues', 'Redis', 'Leader Leases', 'Node.js/Go'],
      evaluationCriteria: ['Zero duplicate runs on node crash', 'Precision of execution timing'],
      hiddenTestsCount: 20,
      totalSubmissionsCount: 45,
    },
    {
      title: 'High-Performance Graph Dependency Resolver',
      slug: 'graph-dependency-resolver',
      domain: 'PERFORMANCE_DEBUGGING',
      difficulty: 'PRODUCTION',
      difficultyWeight: 1.0,
      timeEstimateHours: 4,
      summary:
        'Implement an ultra-fast package dependency resolution algorithm with cycle detection and version constraint SAT-solving.',
      businessContext:
        'Package managers like npm, Cargo, and pip require blazing-fast graph traversal and conflict resolution across complex dependency trees.',
      requirements: [
        'Topological sort with cycle detection.',
        'SemVer constraint reconciliation.',
        'Parallel node fetching and memoized resolution.',
      ],
      constraints: {
        p99LatencyTargetMs: 15,
        minThroughputRps: 2000,
        memoryCeilingMb: 256,
        zeroDataLoss: true,
      },
      skills: ['Graph Theory', 'Algorithms', 'Topological Sort', 'TypeScript/Rust'],
      evaluationCriteria: ['Cycle detection accuracy', 'Resolution speed for 1,000+ packages'],
      hiddenTestsCount: 16,
      totalSubmissionsCount: 52,
    },
    {
      title: 'Resilient Event-Driven CQRS Read-Model Projector',
      slug: 'cqrs-read-model-projector',
      domain: 'SYSTEM_DESIGN',
      difficulty: 'ADVANCED',
      difficultyWeight: 1.4,
      timeEstimateHours: 6,
      summary:
        'Design a Kafka consumer projector that rebuilds high-speed read views in Elasticsearch with zero state drift during consumer rebalances.',
      businessContext:
        'Command Query Responsibility Segregation (CQRS) decouples transaction writes from optimized query views, but out-of-order events can corrupt read-models.',
      requirements: [
        'Sequential projection ordering per entity aggregate ID.',
        'At-least-once replay capability from epoch zero.',
        'Rebalance fault-tolerance with manual Kafka commit offsets.',
      ],
      constraints: {
        p99LatencyTargetMs: 12,
        minThroughputRps: 25000,
        memoryCeilingMb: 512,
        zeroDataLoss: true,
      },
      skills: ['Kafka', 'CQRS', 'Event Sourcing', 'Elasticsearch', 'TypeScript/Go'],
      evaluationCriteria: ['Read-model consistency after random kill', 'Projection throughput'],
      hiddenTestsCount: 20,
      totalSubmissionsCount: 27,
    },
  ]);

  // 6. 10 REALISTIC CANDIDATES WITH FULL ENGINEERING PROOF
  console.log('[SEED] Seeding 10 Candidates with full verified proof dossiers...');
  const candidateSeeds = [
    {
      name: 'Arjun Kumar',
      email: 'arjun.candidate@proofline.dev',
      headline: 'Distributed Systems & High-Throughput Backend Specialist',
      bio: 'Self-taught engineer from Bengaluru focused on lock-free concurrency, database storage internals, and resilient API architectures.',
      location: 'Bengaluru, India',
      github: 'arjun-systems',
      skills: ['Go', 'Distributed Systems', 'Redis', 'PostgreSQL', 'Concurrency', 'Docker'],
      targetRoles: ['Staff Distributed Systems Engineer', 'Senior Backend Engineer'],
      confidence: 'HIGH',
      verificationLevel: 'LEVEL_3_EXPERT_PEER_REVIEWED',
      scores: [
        { dim: 'BACKEND_APIS', name: 'Backend APIs & Services', score: 88, conf: 'HIGH' },
        { dim: 'DATABASE_ENGINEERING', name: 'Database & Storage Internals', score: 82, conf: 'HIGH' },
        { dim: 'SYSTEM_DESIGN', name: 'Distributed Systems & Architecture', score: 86, conf: 'HIGH' },
        { dim: 'TESTING_RELIABILITY', name: 'Testing & Chaos Resilience', score: 91, conf: 'HIGH' },
        { dim: 'PERFORMANCE_OPTIMIZATION', name: 'Performance & Concurrency', score: 92, conf: 'HIGH' },
        { dim: 'SECURITY_DEFENSE', name: 'Defensive Security & SAST', score: 78, conf: 'MODERATE' },
      ],
      completedChallengeIndex: 0, // Ticket Booking API
    },
    {
      name: 'Priya Patel',
      email: 'priya.candidate@proofline.dev',
      headline: 'Payment Infrastructure & Idempotent Systems Engineer',
      bio: 'Building mission-critical financial backend services with strict zero-loss guarantees and defensive API boundaries.',
      location: 'Mumbai, India',
      github: 'priyapatel-eng',
      skills: ['Node.js', 'PostgreSQL', 'Kafka', 'Redis', 'Idempotency', 'TypeScript'],
      targetRoles: ['Senior Payment Infrastructure Engineer', 'Backend Architect'],
      confidence: 'HIGH',
      verificationLevel: 'LEVEL_3_EXPERT_PEER_REVIEWED',
      scores: [
        { dim: 'BACKEND_APIS', name: 'Backend APIs & Services', score: 94, conf: 'HIGH' },
        { dim: 'DATABASE_ENGINEERING', name: 'Database & Storage Internals', score: 85, conf: 'HIGH' },
        { dim: 'TESTING_RELIABILITY', name: 'Testing & Chaos Resilience', score: 89, conf: 'HIGH' },
        { dim: 'SECURITY_DEFENSE', name: 'Defensive Security & SAST', score: 84, conf: 'HIGH' },
      ],
      completedChallengeIndex: 1, // Idempotent Payment
    },
    {
      name: 'Marcus Chen',
      email: 'marcus.candidate@proofline.dev',
      headline: 'Systems & Storage Engine Engineer',
      bio: 'Specialist in low-level file systems, Write-Ahead Logs, and custom memory allocators in Rust.',
      location: 'Singapore',
      github: 'mchen-systems',
      skills: ['Rust', 'C++', 'Storage Engines', 'Linux Kernel', 'Memory Safety'],
      targetRoles: ['Staff Storage Engineer', 'Database Kernel Engineer'],
      confidence: 'HIGH',
      verificationLevel: 'LEVEL_3_EXPERT_PEER_REVIEWED',
      scores: [
        { dim: 'DATABASE_ENGINEERING', name: 'Database & Storage Internals', score: 96, conf: 'HIGH' },
        { dim: 'SYSTEM_DESIGN', name: 'Distributed Systems & Architecture', score: 90, conf: 'HIGH' },
        { dim: 'PERFORMANCE_OPTIMIZATION', name: 'Performance & Concurrency', score: 95, conf: 'HIGH' },
      ],
      completedChallengeIndex: 2, // WAL Storage Engine
    },
    {
      name: 'Elena Rostova',
      email: 'elena.candidate@proofline.dev',
      headline: 'API Gateway & High-Throughput Network Architect',
      bio: 'Designing sliding-window rate limiters, reverse proxies, and sub-millisecond edge services in Go and Lua.',
      location: 'Berlin, Germany',
      github: 'erostova-dev',
      skills: ['Go', 'Redis', 'Lua', 'Reverse Proxies', 'Network Protocols'],
      targetRoles: ['Senior Infrastructure Engineer', 'Edge Systems Engineer'],
      confidence: 'HIGH',
      verificationLevel: 'LEVEL_3_EXPERT_PEER_REVIEWED',
      scores: [
        { dim: 'BACKEND_APIS', name: 'Backend APIs & Services', score: 91, conf: 'HIGH' },
        { dim: 'PERFORMANCE_OPTIMIZATION', name: 'Performance & Concurrency', score: 89, conf: 'HIGH' },
        { dim: 'TESTING_RELIABILITY', name: 'Testing & Chaos Resilience', score: 87, conf: 'HIGH' },
      ],
      completedChallengeIndex: 3, // Rate Limiter
    },
    {
      name: 'Dev Sharma',
      email: 'dev.candidate@proofline.dev',
      headline: 'Consensus & Raft Protocol Engineer',
      bio: 'Focused on distributed linearizable state machines, quorum healing, and network partition chaos testing.',
      location: 'Hyderabad, India',
      github: 'devsharma-core',
      skills: ['Go', 'Raft', 'Consensus', 'Chaos Engineering', 'Kubernetes'],
      targetRoles: ['Principal Distributed Systems Engineer'],
      confidence: 'HIGH',
      verificationLevel: 'LEVEL_3_EXPERT_PEER_REVIEWED',
      scores: [
        { dim: 'SYSTEM_DESIGN', name: 'Distributed Systems & Architecture', score: 95, conf: 'HIGH' },
        { dim: 'TESTING_RELIABILITY', name: 'Testing & Chaos Resilience', score: 93, conf: 'HIGH' },
        { dim: 'BACKEND_APIS', name: 'Backend APIs & Services', score: 84, conf: 'HIGH' },
      ],
      completedChallengeIndex: 4, // Raft State Machine
    },
    {
      name: 'Aisha Khan',
      email: 'aisha.candidate@proofline.dev',
      headline: 'Zero-Allocation Memory & Performance Optimizer',
      bio: 'Systems software developer passionate about compiler internals, zero-copy streaming, and micro-benchmarking.',
      location: 'London, UK',
      github: 'aishakhan-perf',
      skills: ['C++', 'Rust', 'Performance Engineering', 'Memory Allocation'],
      targetRoles: ['Low-Latency Systems Engineer'],
      confidence: 'HIGH',
      verificationLevel: 'LEVEL_2_CHAOS_VERIFIED',
      scores: [
        { dim: 'PERFORMANCE_OPTIMIZATION', name: 'Performance & Concurrency', score: 94, conf: 'HIGH' },
        { dim: 'TESTING_RELIABILITY', name: 'Testing & Chaos Resilience', score: 86, conf: 'HIGH' },
      ],
      completedChallengeIndex: 5, // Zero Allocation JSON
    },
    {
      name: 'Lucas Vance',
      email: 'lucas.candidate@proofline.dev',
      headline: 'Defensive Security & Cryptographic Protocol Engineer',
      bio: 'Auditing authentication pipelines, PKCE token rotation, and timing-attack vulnerabilities in identity services.',
      location: 'San Francisco, USA',
      github: 'lucasvance-sec',
      skills: ['Security', 'OAuth2', 'Cryptography', 'JWT', 'Node.js'],
      targetRoles: ['Staff Security Engineer', 'Identity Architect'],
      confidence: 'HIGH',
      verificationLevel: 'LEVEL_3_EXPERT_PEER_REVIEWED',
      scores: [
        { dim: 'SECURITY_DEFENSE', name: 'Defensive Security & SAST', score: 97, conf: 'HIGH' },
        { dim: 'BACKEND_APIS', name: 'Backend APIs & Services', score: 86, conf: 'HIGH' },
      ],
      completedChallengeIndex: 6, // OAuth PKCE
    },
    {
      name: 'Sofia Morales',
      email: 'sofia.candidate@proofline.dev',
      headline: 'Database Query Tuning & PostgreSQL Internals Engineer',
      bio: 'Transforming sequential-scan queries into sub-10ms composite-indexed lookups across terabyte relational tables.',
      location: 'Austin, USA',
      github: 'sofiamorales-db',
      skills: ['PostgreSQL', 'Query Optimization', 'Database Architecture', 'SQL'],
      targetRoles: ['Senior Database Administrator / Query Architect'],
      confidence: 'HIGH',
      verificationLevel: 'LEVEL_2_CHAOS_VERIFIED',
      scores: [
        { dim: 'DATABASE_ENGINEERING', name: 'Database & Storage Internals', score: 93, conf: 'HIGH' },
        { dim: 'PERFORMANCE_OPTIMIZATION', name: 'Performance & Concurrency', score: 88, conf: 'HIGH' },
      ],
      completedChallengeIndex: 7, // Slow Query
    },
    {
      name: 'Kenji Sato',
      email: 'kenji.candidate@proofline.dev',
      headline: 'Kubernetes Platform & Cloud Infrastructure Specialist',
      bio: 'Custom CRD operator builder enforcing multi-tenant isolation and automated zero-downtime cluster rollouts.',
      location: 'Tokyo, Japan',
      github: 'kenjisato-k8s',
      skills: ['Kubernetes', 'Go', 'DevOps', 'Terraform', 'Network Policies'],
      targetRoles: ['Principal Platform Engineer', 'Kubernetes Architect'],
      confidence: 'HIGH',
      verificationLevel: 'LEVEL_3_EXPERT_PEER_REVIEWED',
      scores: [
        { dim: 'DEVOPS_INFRASTRUCTURE', name: 'DevOps & Deployment Pipelines', score: 95, conf: 'HIGH' },
        { dim: 'SYSTEM_DESIGN', name: 'Distributed Systems & Architecture', score: 87, conf: 'HIGH' },
      ],
      completedChallengeIndex: 8, // Kubernetes Operator
    },
    {
      name: 'David Miller',
      email: 'david.candidate@proofline.dev',
      headline: 'Low-Latency Financial Matching Engine Engineer',
      bio: 'Writing microsecond-precision Limit Order Books in Rust with zero runtime allocations and lockless queues.',
      location: 'Chicago, USA',
      github: 'davidmiller-hft',
      skills: ['Rust', 'Low-Latency', 'Financial Markets', 'Concurrency'],
      targetRoles: ['High-Frequency Trading Systems Engineer'],
      confidence: 'HIGH',
      verificationLevel: 'LEVEL_3_EXPERT_PEER_REVIEWED',
      scores: [
        { dim: 'PERFORMANCE_OPTIMIZATION', name: 'Performance & Concurrency', score: 98, conf: 'HIGH' },
        { dim: 'SYSTEM_DESIGN', name: 'Distributed Systems & Architecture', score: 92, conf: 'HIGH' },
      ],
      completedChallengeIndex: 9, // Order Matching Engine
    },
  ];

  const candidateUsers = [];

  for (const c of candidateSeeds) {
    const u = await User.create({
      name: c.name,
      email: c.email,
      passwordHash,
      role: 'CANDIDATE',
      emailVerified: true,
      status: 'ACTIVE',
    });

    const publicProofToken = crypto.randomBytes(16).toString('hex');

    const profile = await CandidateProfile.create({
      userId: u._id,
      headline: c.headline,
      bio: c.bio,
      location: c.location,
      githubUsername: c.github,
      githubConnected: true,
      skills: c.skills,
      targetRoles: c.targetRoles,
      proofConfidence: c.confidence,
      verificationLevel: c.verificationLevel,
      publicProofToken,
      publicProofEnabled: true,
      totalProjectsCount: 2,
      advancedChallengesCount: 1,
      expertReviewsCount: 2,
      adrsDocumentedCount: 4,
    });

    // Create Verified Submission for their target challenge
    const targetChallenge = challenges[c.completedChallengeIndex];
    const submission = await Submission.create({
      candidateId: u._id,
      challengeId: targetChallenge._id,
      repoUrl: `https://github.com/${c.github}/${targetChallenge.slug}`,
      commitSha: crypto.randomBytes(4).toString('hex'),
      status: 'VERIFIED',
      version: 1,
      preflightChecks: {
        repoValid: true,
        readmeValid: true,
        architectureValid: true,
        adrValid: true,
        testsValid: true,
        explanationValid: true,
      },
      submittedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      verifiedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    });

    // Create Project
    const project = await Project.create({
      submissionId: submission._id,
      candidateId: u._id,
      challengeId: targetChallenge._id,
      title: `${targetChallenge.title} - Production Implementation`,
      architectureSummary: `Engineered an isolated, high-performance service layer with optimistic concurrency control and zero-copy buffers. Decoupled state persistence from client read paths to guarantee bounded P99 latencies under flash contention.`,
      systemComponents: [
        {
          name: 'Core Ingestion Worker',
          role: 'Processes incoming atomic requests and verifies idempotency keys',
          tech: 'Go / Node.js',
          communication: 'HTTP / gRPC',
        },
        {
          name: 'In-Memory Lock-Free State Store',
          role: 'Maintains versioned CAS counters in RAM to eliminate DB row locking',
          tech: 'Redis Cluster / Memory Memtable',
          communication: 'RESP protocol',
        },
        {
          name: 'Durable Ledger Store',
          role: 'Append-only transactional log for reconciliation and crash durability',
          tech: 'PostgreSQL with Partitioned Tables',
          communication: 'TCP Pool',
        },
      ],
      dataFlowDescription:
        'Client requests arrive at the edge gateway -> Signature validated in < 0.2ms -> Distributed lock-free CAS counter decremented atomically -> On success, asynchronous event dispatched to background WAL commit worker.',
      techStack: c.skills,
      deployedUrl: `https://${c.github}-demo.proofline.run`,
      technicalExplanation:
        'We deliberately rejected pessimistic row locking (SELECT FOR UPDATE) because under concert flash-sales, thread starvation in the database connection pool is the primary failure mode. By utilizing versioned optimistic locking with exponential backoff and jitter, P99 latency dropped from 48ms to 2.4ms under 25,000 req/sec.',
    });

    // Create ADRs
    const adr1 = await ADR.create({
      submissionId: submission._id,
      candidateId: u._id,
      decisionIndex: 1,
      title: 'Optimistic Concurrency Control (OCC) vs. Distributed Redis Redlock',
      status: 'ACCEPTED',
      context:
        'Under extreme contention (25,000 req/sec targeting the same inventory row), lock acquisition queues cause cascading connection pool starvation.',
      decision:
        'Adopt optimistic version tagging (Compare-And-Swap) with client-side retry exponential backoff.',
      alternatives: [
        {
          option: 'Pessimistic Row Locking (SELECT FOR UPDATE)',
          rejectionReason: 'Causes thread starvation and 100% DB CPU saturation at 2,000 RPS.',
        },
        {
          option: 'Redis Distributed Redlock',
          rejectionReason: 'Introduces external clock drift failure modes and network hop latency overhead.',
        },
        {
          option: 'Optimistic CAS with Version Column',
          rejectionReason: 'Selected: Zero lock queues, lock-free reads, instant error return for stale requests.',
        },
      ],
      reasoning:
        'Benchmarking showed OCC maintained 2.4ms P99 latency while Redlock degraded to 28ms under packet delay simulation.',
      tradeOffs: 'Higher retry rate for losing client threads during peak 5-second flash traffic bursts.',
      consequences: {
        positive: ['Lock-free read throughput', 'Zero database deadlocks', 'Bounded memory footprint'],
        negative: ['Requires robust exponential backoff on client side'],
      },
      evidenceCitation: 'src/concurrency/cas_lock.go#L45-L92',
    });

    const adr2 = await ADR.create({
      submissionId: submission._id,
      candidateId: u._id,
      decisionIndex: 2,
      title: 'Pre-Allocated Sync.Pool Memory Buffers for Request Deserialization',
      status: 'ACCEPTED',
      context: 'GC stop-the-world pauses exceeded 15ms during sustained 30,000 req/sec benchmarks.',
      decision: 'Implement sync.Pool ring buffers to eliminate dynamic heap allocations in request hot-paths.',
      alternatives: [
        {
          option: 'Standard Heap Allocation per Request',
          rejectionReason: 'Triggers GC sweeps every 400ms under high payload throughput.',
        },
        {
          option: 'Global Static Buffer with Mutex',
          rejectionReason: 'Introduces mutex thread contention across multi-core workers.',
        },
        {
          option: 'Thread-Local / Sync.Pool Reusable Buffers',
          rejectionReason: 'Selected: Eliminates GC pressure with zero lock contention.',
        },
      ],
      reasoning: 'Reduces memory allocation rate from 450 MB/s to < 12 MB/s.',
      tradeOffs: 'Slightly higher initial memory baseline allocation.',
      consequences: {
        positive: ['Zero GC pause spikes', 'Consistent microsecond tail latencies'],
        negative: ['Buffers must be strictly reset before being returned to pool'],
      },
      evidenceCitation: 'src/pool/buffer_manager.go#L22-L68',
    });

    // Create Automated Verification Check
    const autoCheck = await AutomatedCheck.create({
      submissionId: submission._id,
      testsPassed: 8,
      testsTotal: 8,
      passRate: 100,
      hiddenTestsPassed: targetChallenge.hiddenTestsCount,
      hiddenTestsTotal: targetChallenge.hiddenTestsCount,
      hiddenPassRate: 100,
      branchCoveragePct: 92.4,
      mutationScorePct: 88.0,
      p99LatencyMs: targetChallenge.constraints.p99LatencyTargetMs * 0.45,
      throughputRps: targetChallenge.constraints.minThroughputRps * 1.5,
      securityScanPassed: true,
      sastIssuesCount: 0,
      executionLogs: [
        { timestamp: '00:00.10', level: 'INFO', message: 'gVisor sandbox container provisioned with 2.0 vCPU quota' },
        { timestamp: '00:01.30', level: 'INFO', message: `Executing commit SHA ${submission.commitSha}` },
        { timestamp: '00:02.05', level: 'SUCCESS', message: 'Public test contracts: 8/8 passed' },
        { timestamp: '00:05.40', level: 'INFO', message: 'Chaos harness: Injecting 20ms network jitter and thread contention' },
        { timestamp: '00:08.12', level: 'SUCCESS', message: 'ThreadSanitizer: Zero data races or deadlocks detected' },
        {
          timestamp: '00:11.80',
          level: 'SUCCESS',
          message: `Sustained benchmark throughput: ${(targetChallenge.constraints.minThroughputRps * 1.5).toLocaleString()} req/sec`,
        },
        {
          timestamp: '00:12.40',
          level: 'SUCCESS',
          message: `P99 Latency: ${(targetChallenge.constraints.p99LatencyTargetMs * 0.45).toFixed(1)}ms (Target: <${targetChallenge.constraints.p99LatencyTargetMs}ms)`,
        },
        { timestamp: '00:13.10', level: 'SUCCESS', message: 'Static SAST scan: 0 vulnerabilities found' },
        {
          timestamp: '00:13.90',
          level: 'SUCCESS',
          message: `Hidden edge-case test suite: ${targetChallenge.hiddenTestsCount}/${targetChallenge.hiddenTestsCount} passed (100%)`,
        },
      ],
      ranAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    });

    // Create Defense Round
    const defense = await DefenseRound.create({
      submissionId: submission._id,
      candidateId: u._id,
      questions: [
        {
          id: 'q1',
          prompt: 'Why did you choose optimistic concurrency over Redis Redlock in ADR-001?',
          category: 'ARCHITECTURE_RATIONALE',
          contextSnippet: 'ADR-001 line 12',
        },
        {
          id: 'q2',
          prompt: 'What failure mode occurs first if traffic surges by 10x?',
          category: 'SCALABILITY_FAILURE_MODE',
          contextSnippet: 'Database connection pool bounds',
        },
        {
          id: 'q3',
          prompt: 'Explain how your code prevents orphaned reservations if a worker crashes mid-transaction.',
          category: 'CODE_EXPLANATION',
          contextSnippet: 'src/concurrency/cas_lock.go',
        },
      ],
      answers: [
        {
          questionId: 'q1',
          answerText:
            'Redlock introduces distributed clock drift failure modes described by Martin Kleppmann and adds a network round-trip per lock acquisition. In a flash-sale scenario, our bottleneck is latency, so lock-free CAS at the database layer with version counters yields 10x higher throughput with zero split-brain risk.',
          answeredAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        },
        {
          questionId: 'q2',
          answerText:
            'At 10x traffic (250,000 req/sec), the database network interface card (NIC) will saturate and PostgreSQL connection pool queues will exceed their 50-connection ceiling. To mitigate this, we would introduce an edge token bucket that drops excess requests before reaching the persistence layer.',
          answeredAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        },
        {
          questionId: 'q3',
          answerText:
            'We use PostgreSQL two-phase commit transactions with an explicit 5-second reservation expiration timestamp in every row. If a worker terminates, an uncommitted transaction is rolled back immediately by PostgreSQL; if committed but abandoned, a background sweep reaper reclaims expired reservations.',
          answeredAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        },
      ],
      status: 'EVALUATED',
      confidence: 'STRONG',
      evaluatorNotes:
        'Candidate demonstrated authoritative mastery of state transitions, clock drift failure modes, and connection pool dynamics.',
      evaluatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    });

    // Create 2 Expert Reviews
    const rev1 = await Review.create({
      submissionId: submission._id,
      reviewerId: reviewers[0].user._id,
      isDoubleBlind: true,
      rubricScores: {
        correctness: {
          score: 9,
          citation: 'src/concurrency/cas_lock.go#L45',
          rationale: 'Atomic CAS checks prevent any possibility of overselling seats.',
        },
        architecture: {
          score: 9,
          citation: 'ADR-001 section 3',
          rationale: 'Clean decoupling between reservation state and persistence ledger.',
        },
        codeQuality: {
          score: 9,
          citation: 'src/pool/buffer_manager.go#L30',
          rationale: 'Idiomatic error propagation with zero unhandled panics.',
        },
        testing: {
          score: 9,
          citation: 'test/chaos_race_test.go#L88',
          rationale: 'Exemplary chaos harness verifying 5,000 parallel virtual threads.',
        },
        security: {
          score: 8,
          citation: 'src/middleware/auth.go#L15',
          rationale: 'Strict input sanitization; zero SQL injection vectors.',
        },
        performance: {
          score: 10,
          citation: 'BenchmarkOCCUnderContention-16',
          rationale: 'P99 of 2.4ms under 25,000 req/sec is production-grade.',
        },
        engineeringReasoning: {
          score: 9,
          citation: 'ADR-001 Alternatives Considered',
          rationale: 'Deep awareness of Redlock clock drift trade-offs.',
        },
        maintainability: {
          score: 9,
          citation: 'src/services/booking.go#L110',
          rationale: 'Modular domain design with clear interface abstractions.',
        },
      },
      overallScore: 9.0,
      qualitativeSynthesis:
        'This is one of the cleanest high-concurrency implementations in our platform history. The candidate demonstrates Staff-level awareness of hardware cache line bouncing, GC allocations, and transaction isolation levels.',
      improvementRecommendations: [
        'Consider adding Prometheus gauge metrics for retry backoff histogram distributions.',
      ],
      reviewerConfidence: 5,
      rriSnapshotAtReview: 1.45,
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    });

    const rev2 = await Review.create({
      submissionId: submission._id,
      reviewerId: reviewers[1].user._id,
      isDoubleBlind: true,
      rubricScores: {
        correctness: {
          score: 9,
          citation: 'src/concurrency/cas_lock.go#L60',
          rationale: 'Correct handling of context cancellation mid-flight.',
        },
        architecture: {
          score: 8,
          citation: 'ADR-002 section 2',
          rationale: 'Solid use of memory pool to minimize garbage collection.',
        },
        codeQuality: {
          score: 8,
          citation: 'src/services/booking.go#L45',
          rationale: 'Clean function length and minimal cognitive complexity.',
        },
        testing: {
          score: 9,
          citation: 'test/chaos_race_test.go#L12',
          rationale: 'Comprehensive branch coverage on stale version retries.',
        },
        security: {
          score: 8,
          citation: 'src/api/handler.go#L35',
          rationale: 'Rate limiting headers and payload bounds enforced.',
        },
        performance: {
          score: 9,
          citation: 'BenchmarkOCCUnderContention-16',
          rationale: 'Extremely fast throughput with minimal thread contention.',
        },
        engineeringReasoning: {
          score: 9,
          citation: 'ADR-001 Trade-offs',
          rationale: 'Realistic justification of client-side retry trade-offs.',
        },
        maintainability: {
          score: 8,
          citation: 'src/config/env.go#L10',
          rationale: 'Explicit configuration schema with sensible fallbacks.',
        },
      },
      overallScore: 8.5,
      qualitativeSynthesis:
        'Exceptional engineering rigor. The candidate answers the Defense Round questions with crystal clarity and backs claims with reproducible benchmark telemetry.',
      improvementRecommendations: ['Expose health check endpoints with database connection pool metrics.'],
      reviewerConfidence: 4,
      rriSnapshotAtReview: 1.35,
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    });

    // Seed Capability Scores for Candidate
    for (const sc of c.scores) {
      await CapabilityScore.create({
        candidateId: u._id,
        dimension: sc.dim,
        displayName: sc.name,
        score: sc.score,
        status: 'VERIFIED',
        confidence: sc.conf,
        explanation: {
          verifiedProjectsCount: 2,
          advancedChallengesCount: 1,
          expertReviewsCount: 2,
          adrsCount: 2,
          testPassRateAvg: 100,
          defenseRoundStatus: 'Passed (Strong Confidence)',
          consistencyFactor: 'High (0.35σ Reviewer Consensus Delta)',
          improvementEvident: true,
          summaryPoints: [
            `2 verified production projects evaluated in containerized sandbox`,
            `1 advanced-tier challenge completed with 100% hidden chaos test passes`,
            `2 calibrated expert reviews with mandatory code citations (Avg: 8.8/10)`,
            `100% automated test pass rate with ${targetChallenge.constraints.p99LatencyTargetMs * 0.45}ms P99 benchmark latency`,
            `2 formal Architectural Decision Records (ADRs) accepted`,
            `Defense Round™ evaluated with Strong Confidence against AST interrogation`,
            `Demonstrated responsive code refactoring to peer review critiques`,
          ],
        },
        contributingSubmissionIds: [submission._id],
        lastDemonstratedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      });
    }

    // Also populate Insufficient Evidence dimensions for completeness (never show 0!)
    const allDims = [
      { dim: 'BACKEND_APIS', name: 'Backend APIs & Services' },
      { dim: 'DATABASE_ENGINEERING', name: 'Database & Storage Internals' },
      { dim: 'SYSTEM_DESIGN', name: 'Distributed Systems & Architecture' },
      { dim: 'TESTING_RELIABILITY', name: 'Testing & Chaos Resilience' },
      { dim: 'SECURITY_DEFENSE', name: 'Defensive Security & SAST' },
      { dim: 'PERFORMANCE_OPTIMIZATION', name: 'Performance & Concurrency' },
      { dim: 'DEVOPS_INFRASTRUCTURE', name: 'DevOps & Deployment Pipelines' },
      { dim: 'FRONTEND_ARCHITECTURE', name: 'Frontend Architecture & UI' },
    ];

    for (const d of allDims) {
      const exists = c.scores.some((s) => s.dim === d.dim);
      if (!exists) {
        await CapabilityScore.create({
          candidateId: u._id,
          dimension: d.dim,
          displayName: d.name,
          score: null,
          status: 'INSUFFICIENT_EVIDENCE',
          confidence: 'NONE',
          explanation: {
            verifiedProjectsCount: 0,
            advancedChallengesCount: 0,
            expertReviewsCount: 0,
            adrsCount: 0,
            testPassRateAvg: 0,
            defenseRoundStatus: 'No evidence yet',
            consistencyFactor: 'N/A',
            improvementEvident: false,
            summaryPoints: [
              `Complete a verified ${d.name.toLowerCase()} challenge to establish this capability.`,
            ],
          },
          contributingSubmissionIds: [],
        });
      }
    }

    candidateUsers.push({ user: u, profile, submission, project });
  }

  // 7. SEED AT LEAST 3 DIRECT RECRUITER OPPORTUNITIES
  console.log('[SEED] Seeding Direct Recruiter Opportunities...');
  const arjunCandidate = candidateUsers[0].user;
  const priyaCandidate = candidateUsers[1].user;
  const marcusCandidate = candidateUsers[2].user;

  await Opportunity.create([
    {
      recruiterId: recruiters[0].user._id, // Rachel from Stripe
      candidateId: arjunCandidate._id,
      organizationId: orgs[0]._id, // Stripe
      roleTitle: 'Staff Distributed Systems Engineer - Core Infrastructure',
      compensationRange: '$180,000 - $240,000 + Equity',
      locationType: 'Remote (Global)',
      whyReachedOut:
        'We reviewed your verified implementation of the High-Concurrency Ticket Booking API. Your ADR on optimistic version checks vs. Redis Redlock and your sub-3ms P99 benchmark directly match our ledger transaction scaling challenges. We want to bypass all preliminary technical phone screens and invite you directly to an architectural conversation with our Infrastructure Engineering Director.',
      skillsMatched: ['Go', 'Distributed Systems', 'Concurrency', 'PostgreSQL', 'Redis'],
      referencedProjectIds: [candidateUsers[0].project._id],
      status: 'SENT',
    },
    {
      recruiterId: recruiters[1].user._id, // Tariq from Cloudflare
      candidateId: priyaCandidate._id,
      organizationId: orgs[1]._id, // Cloudflare
      roleTitle: 'Senior Payment & Edge API Infrastructure Engineer',
      compensationRange: '$165,000 - $215,000 + Equity',
      locationType: 'Remote (APAC/EMEA)',
      whyReachedOut:
        'Your verified Idempotent Payment Webhook Ingestion Engine showed exceptional handling of out-of-order delivery and zero-data-loss guarantees under network chaos. We want to skip our coding puzzle round and fast-track you to our team.',
      skillsMatched: ['Node.js', 'PostgreSQL', 'Idempotency', 'Kafka'],
      referencedProjectIds: [candidateUsers[1].project._id],
      status: 'ACCEPTED',
      candidateResponseNotes: 'Excited about Cloudflare Edge workers. Look forward to discussing transaction isolation.',
      respondedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    },
    {
      recruiterId: recruiters[2].user._id, // Jessica from Datadog
      candidateId: marcusCandidate._id,
      organizationId: orgs[2]._id, // Datadog
      roleTitle: 'Principal Storage Kernel Engineer',
      compensationRange: '$210,000 - $280,000 + Equity',
      locationType: 'San Francisco or Remote',
      whyReachedOut:
        'Your Distributed WAL Storage Engine proof scored 96 in Database Engineering with zero heap allocations during tokenization. We are building the next generation of our time-series database and need your systems expertise.',
      skillsMatched: ['Rust', 'Storage Engines', 'Linux Kernel', 'Memory Safety'],
      referencedProjectIds: [candidateUsers[2].project._id],
      status: 'SENT',
    },
  ]);

  // 8. AUDIT LOGS
  console.log('[SEED] Seeding application audit log history...');
  await AuditLog.create([
    {
      actorId: adminUser._id,
      actorEmail: adminUser.email,
      actorRole: 'ADMIN',
      action: 'SYSTEM_INITIALIZED',
      resourceType: 'System',
      ipAddress: '127.0.0.1',
      metadata: { challengesCount: 15, candidatesCount: 10, reviewersCount: 5 },
      timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    },
    {
      actorId: arjunCandidate._id,
      actorEmail: arjunCandidate.email,
      actorRole: 'CANDIDATE',
      action: 'CHALLENGE_STARTED',
      resourceType: 'Challenge',
      resourceId: challenges[0]._id.toString(),
      metadata: { title: challenges[0].title },
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    },
    {
      actorId: arjunCandidate._id,
      actorEmail: arjunCandidate.email,
      actorRole: 'CANDIDATE',
      action: 'SUBMISSION_VERIFIED',
      resourceType: 'Submission',
      resourceId: candidateUsers[0].submission._id.toString(),
      metadata: { p99LatencyMs: 2.4, testPassRate: 100 },
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
    {
      actorId: reviewers[0].user._id,
      actorEmail: reviewers[0].user.email,
      actorRole: 'REVIEWER',
      action: 'REVIEW_CREATED',
      resourceType: 'Review',
      metadata: { overallScore: 9.0, candidate: 'anonymized' },
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
    {
      actorId: recruiters[0].user._id,
      actorEmail: recruiters[0].user.email,
      actorRole: 'RECRUITER',
      action: 'OPPORTUNITY_CREATED',
      resourceType: 'Opportunity',
      metadata: { candidate: arjunCandidate.name, roleTitle: 'Staff Distributed Systems Engineer' },
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    },
  ]);

  // 10. MASTER WORKFLOW: JOBS, ASSESSMENTS, APPLICATIONS, INTERVIEWS, NOTIFICATIONS
  console.log('[SEED] Seeding Jobs, Assessments, Applications & Interviews...');

  const techJob = await Job.create({
    title: 'Staff Concurrency & Distributed Systems Engineer',
    organizationId: orgs[0]._id,
    department: 'Core Infrastructure',
    careerDomain: 'technology',
    profession: 'Software Developer',
    experience: '4-8 years',
    employmentType: 'Full-time',
    location: 'Bangalore, India (Hybrid)',
    description: 'Lead high-throughput payment rail settlement engines, eliminate race conditions, and architect fault-tolerant distributed consensus mechanisms.',
    requiredSkills: ['Distributed Systems', 'Go/Rust', 'Concurrency / CAS', 'Container Hermetic Testing'],
    optionalSkills: ['eBPF', 'Kafka', 'PostgreSQL Internals'],
    difficulty: 'Expert',
    assessmentDurationMinutes: 60,
    status: 'OPEN',
    jobDNA: {
      technicalSkills: [
        { name: 'Distributed Systems', importance: 'Mandatory' },
        { name: 'Concurrency / CAS', importance: 'Mandatory' },
        { name: 'Hermetic Testing', importance: 'High' },
      ],
      problemSolvingFocus: [
        { dimension: 'Architectural Concurrency Rigor', weight: 40 },
        { dimension: 'Distributed Boundary Resilience', weight: 35 },
        { dimension: 'Zero Data Race Guarantee', weight: 25 },
      ],
      practicalRequirements: [
        'Deliver verifiable production lock-free or CAS state coordinator',
        'Provide Architectural Decision Record (ADR)',
        'Pass automated race detector and container benchmark',
      ],
      mandatoryRequirements: [
        '4+ years distributed backend engineering experience',
        'Proven track record of high-concurrency systems design',
      ],
      experienceYears: 5,
      difficulty: 'Expert',
      suggestedAssessmentTypes: ['Practical Task', 'ADR Defense', 'Fuzzing Suite'],
      generatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    },
    competencies: [
      { name: 'Distributed Concurrency & CAS', weight: 30, description: 'Lock-free data structures and race condition elimination', proficiencyLevel: 'Expert', verificationCriteria: ['Clean Git repo', 'No data race'] },
      { name: 'Hermetic Testing & Resilience', weight: 25, description: 'Isolated containerized test suites and fuzzing', proficiencyLevel: 'Advanced', verificationCriteria: ['100% pass rate'] },
      { name: 'Architectural Decision Records', weight: 25, description: 'Clear rationale on throughput vs memory trade-offs', proficiencyLevel: 'Advanced', verificationCriteria: ['ADR-001 memo'] },
      { name: 'Live AST Technical Defense', weight: 20, description: 'Defending state boundaries and failure recovery', proficiencyLevel: 'Expert', verificationCriteria: ['Live defense pass'] },
    ],
    applicantCount: 3,
    shortlistedCount: 1,
    createdBy: recruiters[0].user._id,
  });

  const engJob = await Job.create({
    title: 'Senior Mechanical / CAD Systems Engineer',
    organizationId: orgs[1]._id,
    department: 'Hardware & Robotics',
    careerDomain: 'engineering_core',
    branch: 'Mechanical',
    profession: 'Mechanical Engineer',
    experience: '3-6 years',
    employmentType: 'Full-time',
    location: 'Pune, India (Hybrid)',
    description: 'Design lightweight payload structures, calculate GD&T tolerance stacks, and validate structural FEA stress models for inspection robotics.',
    requiredSkills: ['Parametric CAD', 'FEA Stress Analysis', 'GD&T', 'DFMA'],
    optionalSkills: ['Topology Optimization', 'ANSYS Modal Analysis'],
    difficulty: 'Advanced',
    assessmentDurationMinutes: 90,
    status: 'OPEN',
    competencies: [
      { name: 'Parametric CAD & Tolerancing', weight: 30, description: '3D assembly modeling and ISO tolerance stack analysis', proficiencyLevel: 'Advanced', verificationCriteria: ['STEP model', 'PDF drawing'] },
      { name: 'FEA Stress & Thermal Simulation', weight: 30, description: 'Finite element mesh convergence and FoS calculation', proficiencyLevel: 'Advanced', verificationCriteria: ['Convergence plot'] },
      { name: 'Engineering Decision Records', weight: 20, description: 'Material trade-offs (Al 7075-T6 vs 6061)', proficiencyLevel: 'Proficient', verificationCriteria: ['Calculations sheet'] },
      { name: 'Technical Defense Round', weight: 20, description: 'Live derivation of beam deflections and fastener clamp load', proficiencyLevel: 'Advanced', verificationCriteria: ['Live defense pass'] },
    ],
    applicantCount: 2,
    shortlistedCount: 1,
    createdBy: recruiters[1].user._id,
  });

  const techAssessment = await Assessment.create({
    jobId: techJob._id,
    version: 1,
    title: 'High-Concurrency Atomic State Coordinator Challenge (v1)',
    careerDomain: 'technology',
    profession: 'Software Developer',
    difficulty: 'Expert',
    timeLimitMinutes: 60,
    scenario: 'A high-throughput distributed transaction platform is experiencing race conditions and tail-latency spikes during peak concurrency. Re-architect the critical transaction coordinator.',
    practicalTask: 'Implement an atomic lock-free or CAS state coordinator in production code, accompany it with comprehensive hermetic containerized test suites, and write an Architectural Decision Record (ADR) justifying data consistency trade-offs.',
    constraints: ['Sub-10ms p99 latency under 10,000 concurrent ops', 'Zero data races detected', 'Hermetic container test pass'],
    deliverables: ['Git Repository', 'ADR-001 Record', 'Automated Fuzzing Suite', 'Live Defense Video'],
    toolsAllowed: ['Git', 'Docker', 'Go/Rust/Node', 'Benchmarking Tooling'],
    expectedCompetencies: ['Distributed Concurrency & CAS', 'Hermetic Testing & Resilience', 'Architectural Decision Records'],
    rubricCriteria: [
      { id: 'arch', label: 'Concurrency Architecture & Boundary Rigor', description: 'Deadlock avoidance and atomic isolation', maxScore: 5, weight: 35 },
      { id: 'tests', label: 'Hermetic Testing & Edge Case Depth', description: 'Zero race conditions under high concurrent load', maxScore: 5, weight: 35 },
      { id: 'adr', label: 'ADR Quality & Trade-off Articulation', description: 'Defending chosen approach against alternatives', maxScore: 5, weight: 30 },
    ],
    status: 'PUBLISHED',
    publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    createdBy: recruiters[0].user._id,
  });

  techJob.publishedAssessmentId = techAssessment._id;
  await techJob.save();

  // Seed Application for Arjun (Shortlisted)
  const arjunApp = await Application.create({
    candidateId: arjunCandidate._id,
    jobId: techJob._id,
    status: 'SHORTLISTED',
    eligibility: {
      isEligible: true,
      checks: [
        { name: 'Domain Alignment', passed: true, reason: 'Candidate matches Technology & Backend criteria.' },
        { name: 'Experience Threshold', passed: true, reason: 'Meets 4+ years distributed systems requirement.' },
      ],
      summaryReason: 'Candidate meets all objective domain prerequisites.',
      checkedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    },
    assessmentAttempt: {
      assessmentId: techAssessment._id,
      startedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      submittedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 48 * 60 * 1000),
      submissionContent: {
        workUrl: 'https://github.com/kaushal-verifiable/high-concurrency-atomic-coordinator',
        notes: 'Full production implementation with Redis Lua / atomic CAS synchronization and automated containerized test run.',
        adrDecision: 'Selected Redis Lua CAS atomicity over PostgreSQL row-level locking to avoid transaction coordinator deadlocks under 10k RPS.',
        modalityType: 'code',
      },
      attemptDurationMinutes: 48,
    },
    aiEvaluation: {
      overallScore: 94,
      confidence: 'HIGH',
      humanReviewRecommended: false,
      strengths: [
        'Atomic CAS state coordinator completely eliminates race conditions at 10k RPS.',
        '100% Hermetic container test pass rate with deterministic fuzzing.',
        'Thorough Architectural Decision Record evaluating 3 alternative caching topologies.',
      ],
      weaknesses: ['Minor telemetry documentation omission on distributed trace spans.'],
      summary: 'Verified high-rigor submission meeting all expert-level distributed concurrency benchmarks.',
      criterionScores: [
        { criterionId: 'arch', label: 'Concurrency Architecture & Boundary Rigor', score: 4.8, maxScore: 5, feedback: 'Flawless lock-free atomic isolation.' },
        { criterionId: 'tests', label: 'Hermetic Testing & Edge Case Depth', score: 4.9, maxScore: 5, feedback: 'Zero race conditions detected under parallel stress test.' },
        { criterionId: 'adr', label: 'ADR Quality & Trade-off Articulation', score: 4.6, maxScore: 5, feedback: 'Thorough justification of CAS over row locks.' },
      ],
      evaluatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 50 * 60 * 1000),
    },
    humanReview: {
      reviewerId: reviewers[0].user._id,
      status: 'VERIFIED',
      agreedWithAI: true,
      feedbackNotes: 'Exceptional architectural conviction and clean Go implementation.',
      reviewedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
    roleFit: {
      score: 95,
      competencyBreakdown: [
        { competency: 'Distributed Concurrency & CAS', alignmentScore: 96, evidenceCount: 4 },
        { competency: 'Hermetic Testing & Resilience', alignmentScore: 98, evidenceCount: 3 },
        { competency: 'Architectural Decision Records', alignmentScore: 92, evidenceCount: 2 },
      ],
      confidenceLevel: 'HIGH',
      calculatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
    whyShortlisted: {
      isShortlisted: true,
      reasons: [
        'Scored 94% on Expert-tier practical concurrency assessment',
        'Verified 4 production-grade proof artifacts and ADR decisions',
        'Met 100% of mandatory job competency requirements with high reviewer consensus',
      ],
      mandatoryRequirementsMet: [
        '4+ years distributed backend engineering experience (Verified)',
        'Proven high-concurrency systems design (Verified in live benchmark)',
      ],
      practicalAssessmentScore: 94,
      verifiedEvidenceHighlight: 'Hermetic container test run passed 100% with atomic CAS state isolation',
      shortlistedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
  });

  // Seed Interview for Arjun
  await Interview.create({
    applicationId: arjunApp._id,
    candidateId: arjunCandidate._id,
    jobId: techJob._id,
    scheduledAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    durationMinutes: 45,
    status: 'SCHEDULED',
    generatedQuestions: [
      {
        id: 'q1',
        question: 'In your practical assessment submission for Staff Concurrency Engineer, what architectural trade-offs did you weigh when selecting Redis Lua CAS instead of PostgreSQL row-level locks?',
        competency: 'System Architecture & Decision Rigor',
        difficulty: 'Expert',
        evidenceContext: 'Assessment ADR: Selected Redis Lua CAS atomicity over PostgreSQL row-level locking.',
        evaluatorFocus: 'Check if candidate explains memory contention, cluster partitioning, and rollback safety.',
        sampleGoodAnswer: 'Articulates throughput bottleneck analysis and explains why memory-level atomicity was chosen despite cache eviction constraints.',
      },
      {
        id: 'q2',
        question: 'How did you verify that your test suite was hermetic and prevented race conditions under 10,000 concurrent ops?',
        competency: 'Verification & Test Depth',
        difficulty: 'Advanced',
        evidenceContext: 'Assessment Test Run: 100% Hermetic pass score across 4 fuzzing suites.',
        evaluatorFocus: 'Evaluate understanding of race condition detectors, mock boundaries, and deterministic seed generation.',
        sampleGoodAnswer: 'Explains setup of isolated containerized environments and automated race detection flags during build.',
      },
    ],
    scorecard: [
      { criterionId: 'tech_depth', label: 'Technical Depth & Domain Rigor', score: 5, notes: 'Superb grasp of distributed memory atomicity.' },
      { criterionId: 'prob_solving', label: 'Practical Problem Solving & Trade-offs', score: 5, notes: 'Clear trade-off reasoning.' },
      { criterionId: 'communication', label: 'Technical Conviction & Clarity', score: 4, notes: 'Confident and precise.' },
      { criterionId: 'role_fit', label: 'Role Alignment & Scalability', score: 5, notes: 'Exact match for core infrastructure needs.' },
    ],
    interviewerId: recruiters[0].user._id,
  });

  // Seed Notifications
  await Notification.create([
    {
      userId: arjunCandidate._id,
      title: 'Technical Defense Interview Scheduled',
      message: 'Your technical defense interview for Staff Concurrency Engineer has been scheduled for tomorrow at 2:00 PM IST.',
      type: 'INTERVIEW',
      link: '/workspace',
      read: false,
    },
    {
      userId: arjunCandidate._id,
      title: 'Practical Assessment Verified (Score: 94%)',
      message: 'Your practical assessment submission has been verified with Distinction by expert peer reviewers.',
      type: 'EVALUATION',
      link: '/passport',
      read: true,
    },
    {
      userId: recruiters[0].user._id,
      title: 'Candidate Shortlisted: Arjun Kumar (95% Role Fit)',
      message: 'Arjun Kumar has been automatically shortlisted for Staff Concurrency Engineer based on verified assessment score of 94%.',
      type: 'SHORTLIST',
      link: '/recruiter',
      read: false,
    },
  ]);

  console.log('\n======================================================');
  console.log(' [PROOFLINE SEED COMPLETE] Successfully seeded database:');
  console.log(` • 10 Candidates (including Arjun Kumar, Priya Patel, Marcus Chen)`);
  console.log(` • 15 Real-World Engineering Challenges across 4 difficulty tiers`);
  console.log(` • 5 Calibrated Expert Reviewers (with RRI metrics & rubrics)`);
  console.log(` • 3 Verified Organizations (Stripe, Cloudflare, Datadog)`);
  console.log(` • Real Submissions, Projects, ADRs, Automated Telemetry Runs, Reviews`);
  console.log(` • Multi-dimensional Capability Scores & ProofGraph connections`);
  console.log(` • 3 Direct Evidence-Backed Recruiter Opportunities`);
  console.log(` • Immutable Security Audit Logs`);
  console.log(`\n Demo Credentials (Standard password: ${DEMO_PASSWORD}):`);
  console.log(` • Candidate: arjun.candidate@proofline.dev / ${DEMO_PASSWORD}`);
  console.log(` • Candidate: priya.candidate@proofline.dev / ${DEMO_PASSWORD}`);
  console.log(` • Reviewer:  vikram.reviewer@proofline.dev / ${DEMO_PASSWORD}`);
  console.log(` • Recruiter: rachel@stripe.com / ${DEMO_PASSWORD}`);
  console.log(` • Admin:     admin@proofline.dev / ${DEMO_PASSWORD}`);
  console.log('======================================================\n');

  await mongoose.disconnect();
}

seedDatabase().catch((err) => {
  console.error('[SEED ERROR]:', err);
  process.exit(1);
});
