# Open EA Modeler — Architecture Overview

## Vision

A lightweight, git-native enterprise architecture modeling tool that people actually want to use. Not a drawing tool. Not a 25-year-old desktop app. A proper modeling tool with a modern web UI, where the same element can appear across multiple diagrams and everything is stored as human-readable, diffable JSON.

**Primary notation**: ArchiMate 3.2 (the EA standard)
**Secondary notation**: BPMN 2.0 (process modeling)
**Future**: UML, C4, custom notations

---

## Core Principles

1. **Git is the backend** — No proprietary database. Models are JSON files in a repo.
2. **Modeling, not drawing** — Elements exist in a repository; diagrams are views.
3. **Notation-agnostic core** — Support multiple notations via pluggable metamodels.
4. **80/20 rule** — Implement the 20% of each notation that covers 80% of real use.
5. **Runs anywhere** — Web-based, can be self-hosted or run locally.

---

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                           Web UI (React)                            │
├─────────────────────────────────────────────────────────────────────┤
│  Canvas Editor  │  Element Browser  │  Property Panel  │  Palettes  │
│   (React Flow)  │   (Tree/Search)   │   (Forms)        │ (per layer)│
└────────┬────────┴────────┬──────────┴────────┬─────────┴─────┬──────┘
         │                 │                   │               │
         ▼                 ▼                   ▼               ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        Model Layer (TypeScript)                     │
├─────────────────────────────────────────────────────────────────────┤
│  Element Repository  │  Diagram Manager  │  Relationship Tracker    │
│  (all elements)      │  (views of model) │  (valid connections)     │
└────────┬─────────────┴────────┬──────────┴────────┬─────────────────┘
         │                      │                   │
         ▼                      ▼                   ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      Metamodel Engine                               │
├─────────────────────────────────────────────────────────────────────┤
│  Notation Plugins:  │  Validation Rules  │  Constraint Checker      │
│  - ArchiMate 3.2    │  (what can connect │  (cardinality, derived   │
│  - BPMN 2.0         │   to what)         │   relationships, etc.)   │
│  - UML (future)     │                    │                          │
│  - Custom           │                    │                          │
└────────┬────────────┴────────┬───────────┴──────────────────────────┘
         │                     │
         ▼                     ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      Persistence Layer                              │
├─────────────────────────────────────────────────────────────────────┤
│  File Format (JSON)  │  Import/Export     │  Git Integration        │
│  - elements/         │  - ArchiMate OEF   │  - Commit/push          │
│  - diagrams/         │  - SVG/PNG         │  - Branch/merge         │
│  - metamodel.json    │  - Open Exchange   │  - Diff viewer          │
└─────────────────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      File System / Git Repo                         │
└─────────────────────────────────────────────────────────────────────┘
```

---

## ArchiMate 3.2 — MVP Element Coverage

The full spec has ~60 element types. We target the essential subset that covers real-world EA work.

### Strategy Layer (Phase 2)
*Defer to Phase 2 — adds complexity without core modeling value*

### Business Layer

| Element | Icon | Description | MVP |
|---------|------|-------------|-----|
| Business Actor | 🧑 | A person or organizational unit | ✅ |
| Business Role | 👤 | Responsibility for behavior | ✅ |
| Business Collaboration | 👥 | Aggregate of roles | ⏳ |
| Business Interface | ☐ | Access point for business service | ⏳ |
| Business Process | ⮕ | Sequence of behaviors | ✅ |
| Business Function | ƒ | Collection of behavior based on criteria | ✅ |
| Business Interaction | ⇄ | Unit of collective behavior | ⏳ |
| Business Event | ⚡ | Something that happens | ✅ |
| Business Service | ☐ | Explicitly defined exposed behavior | ✅ |
| Business Object | ☐ | Passive element with business meaning | ✅ |
| Contract | 📄 | Formal agreement | ⏳ |
| Representation | 📋 | Perceptible form of business object | ⏳ |
| Product | 📦 | Coherent collection of services | ⏳ |

**MVP Business Layer**: Actor, Role, Process, Function, Event, Service, Object (7 elements)

### Application Layer

| Element | Icon | Description | MVP |
|---------|------|-------------|-----|
| Application Component | ⬚ | Encapsulation of application functionality | ✅ |
| Application Collaboration | ⬚⬚ | Aggregate of components | ⏳ |
| Application Interface | ☐ | Access point for application services | ✅ |
| Application Function | ƒ | Automated behavior | ⏳ |
| Application Interaction | ⇄ | Unit of collective application behavior | ⏳ |
| Application Process | ⮕ | Sequence of application behaviors | ⏳ |
| Application Event | ⚡ | Application state change | ⏳ |
| Application Service | ☐ | Explicitly defined exposed application behavior | ✅ |
| Data Object | ⬚ | Data structured for automated processing | ✅ |

**MVP Application Layer**: Component, Interface, Service, Data Object (4 elements)

### Technology Layer

| Element | Icon | Description | MVP |
|---------|------|-------------|-----|
| Node | ☐ | Computational or physical resource | ✅ |
| Device | 🖥 | Physical IT resource | ✅ |
| System Software | ⬚ | Software environment for components | ✅ |
| Technology Collaboration | ⬚⬚ | Aggregate of nodes | ⏳ |
| Technology Interface | ☐ | Access point for technology services | ✅ |
| Path | ─ | Link between nodes | ⏳ |
| Communication Network | ═ | Set of structures for transmission | ✅ |
| Technology Function | ƒ | Collection of technology behavior | ⏳ |
| Technology Process | ⮕ | Sequence of technology behaviors | ⏳ |
| Technology Interaction | ⇄ | Unit of collective technology behavior | ⏳ |
| Technology Event | ⚡ | Technology state change | ⏳ |
| Technology Service | ☐ | Explicitly defined technology behavior | ✅ |
| Artifact | 📄 | Piece of data used/produced | ✅ |

**MVP Technology Layer**: Node, Device, System Software, Interface, Network, Service, Artifact (7 elements)

### Physical Layer (Phase 2)
*Defer — less commonly used*

### Implementation & Migration Layer (Phase 2)

| Element | Description | MVP |
|---------|-------------|-----|
| Work Package | Series of actions for achieving a result | ⏳ |
| Deliverable | Precisely-defined result | ⏳ |
| Implementation Event | State change related to implementation | ⏳ |
| Plateau | Relatively stable state of architecture | ⏳ |
| Gap | Difference between plateaus | ⏳ |

### Composite Elements

| Element | Description | MVP |
|---------|-------------|-----|
| Grouping | Aggregates concepts | ✅ |
| Location | Place or position | ✅ |

---

## ArchiMate 3.2 — MVP Relationship Coverage

### Structural Relationships

| Relationship | Notation | Description | MVP |
|--------------|----------|-------------|-----|
| Composition | ◆─── | Element consists of other elements | ✅ |
| Aggregation | ◇─── | Element groups other elements | ✅ |
| Assignment | ○──● | Active element performs behavior / allocated to | ✅ |
| Realization | ┄┄▷ | Logical entity implemented by concrete entity | ✅ |

### Dependency Relationships

| Relationship | Notation | Description | MVP |
|--------------|----------|-------------|-----|
| Serving | ───▷ | Element provides functionality to another | ✅ |
| Access | ┄┄─▷ | Behavioral element accesses business/data object | ✅ |
| Influence | ···▷ | Element affects implementation/achievement | ⏳ |

### Dynamic Relationships

| Relationship | Notation | Description | MVP |
|--------------|----------|-------------|-----|
| Triggering | ──▷ | Temporal/causal relationship | ✅ |
| Flow | ─ ─▷ | Transfer from one element to another | ✅ |

### Other Relationships

| Relationship | Notation | Description | MVP |
|--------------|----------|-------------|-----|
| Specialization | ───▷ | Element is particular kind of another | ✅ |
| Association | ─── | Unspecified relationship | ✅ |

**MVP Relationships**: 10 of 11 core relationships (defer Influence to Phase 2)

---

## ArchiMate Viewpoints — MVP

ArchiMate defines 20+ viewpoints. For MVP, we support:

| Viewpoint | Purpose | MVP |
|-----------|---------|-----|
| **Organization** | Structure of enterprise in terms of roles/actors | ✅ |
| **Application Cooperation** | Application components and their relationships | ✅ |
| **Application Usage** | How applications are used by business processes | ✅ |
| **Technology** | Infrastructure and platforms | ✅ |
| **Technology Usage** | How technology supports application layer | ✅ |
| **Layered** | Multiple layers and their dependencies | ✅ |
| **Business Process Cooperation** | Business processes and their relationships | ✅ |
| Product | How products are composed | ⏳ |
| Implementation & Migration | Work packages and plateaus | ⏳ |
| Motivation | Stakeholder concerns, goals, requirements | ⏳ |
| Strategy | Capabilities, resources, and courses of action | ⏳ |

**MVP Viewpoints**: 7 core viewpoints covering Business → Application → Technology

---

## Data Structures

### Element (ArchiMate)

```json
{
  "id": "elem-uuid-1234",
  "type": "archimate:ApplicationComponent",
  "name": "Payment Service",
  "documentation": "Handles all payment processing including card validation and settlement",
  "properties": {
    "owner": "Payments Team",
    "lifecycle": "Production",
    "criticality": "High"
  },
  "tags": ["payments", "core-banking"],
  "created": "2025-01-15T10:00:00Z",
  "modified": "2025-03-20T14:30:00Z"
}
```

### Relationship (ArchiMate)

```json
{
  "id": "rel-uuid-5678",
  "type": "archimate:Serving",
  "name": "provides payment processing",
  "sourceId": "elem-uuid-1234",
  "targetId": "elem-uuid-9999",
  "documentation": "",
  "properties": {},
  "accessType": null,
  "influenceStrength": null
}
```

### Diagram / View

```json
{
  "id": "view-uuid-0001",
  "name": "Payment System - Application Cooperation",
  "viewpoint": "archimate:ApplicationCooperation",
  "documentation": "Shows how payment applications interact",
  "nodes": [
    {
      "id": "node-1",
      "elementId": "elem-uuid-1234",
      "x": 200,
      "y": 150,
      "width": 180,
      "height": 80,
      "style": {
        "fillColor": "#B5FFFF",
        "borderColor": "#007FAD"
      },
      "children": []
    }
  ],
  "edges": [
    {
      "id": "edge-1",
      "relationshipId": "rel-uuid-5678",
      "sourceNodeId": "node-1",
      "targetNodeId": "node-2",
      "waypoints": [],
      "style": {}
    }
  ],
  "groups": [
    {
      "id": "group-1",
      "name": "Core Banking",
      "x": 50,
      "y": 50,
      "width": 500,
      "height": 400,
      "nodeIds": ["node-1", "node-2", "node-3"]
    }
  ]
}
```

### ArchiMate Metamodel Definition

```json
{
  "id": "archimate",
  "name": "ArchiMate 3.2",
  "version": "3.2",
  "layers": [
    {
      "id": "strategy",
      "name": "Strategy",
      "color": "#F5E6A3"
    },
    {
      "id": "business",
      "name": "Business",
      "color": "#FFFFB5"
    },
    {
      "id": "application",
      "name": "Application",
      "color": "#B5FFFF"
    },
    {
      "id": "technology",
      "name": "Technology",
      "color": "#C9E7B7"
    },
    {
      "id": "physical",
      "name": "Physical",
      "color": "#C9E7B7"
    },
    {
      "id": "implementation",
      "name": "Implementation & Migration",
      "color": "#FFE0E0"
    }
  ],
  "elementTypes": [
    {
      "id": "archimate:BusinessActor",
      "name": "Business Actor",
      "layer": "business",
      "aspect": "active",
      "shape": "actor",
      "icon": "business-actor.svg",
      "documentation": "A business entity that is capable of performing behavior.",
      "properties": []
    },
    {
      "id": "archimate:BusinessRole",
      "name": "Business Role",
      "layer": "business",
      "aspect": "active",
      "shape": "role",
      "icon": "business-role.svg",
      "documentation": "The responsibility for performing specific behavior, to which an actor can be assigned.",
      "properties": []
    },
    {
      "id": "archimate:BusinessProcess",
      "name": "Business Process",
      "layer": "business",
      "aspect": "behavior",
      "shape": "process",
      "icon": "business-process.svg",
      "documentation": "A sequence of business behaviors that achieves a specific result.",
      "properties": []
    },
    {
      "id": "archimate:ApplicationComponent",
      "name": "Application Component",
      "layer": "application",
      "aspect": "active",
      "shape": "component",
      "icon": "application-component.svg",
      "documentation": "An encapsulation of application functionality aligned to implementation structure.",
      "properties": [
        {"name": "technology", "type": "string", "required": false}
      ]
    },
    {
      "id": "archimate:ApplicationService",
      "name": "Application Service",
      "layer": "application",
      "aspect": "behavior",
      "shape": "service",
      "icon": "application-service.svg",
      "documentation": "An explicitly defined exposed application behavior.",
      "properties": []
    },
    {
      "id": "archimate:DataObject",
      "name": "Data Object",
      "layer": "application",
      "aspect": "passive",
      "shape": "object",
      "icon": "data-object.svg",
      "documentation": "Data structured for automated processing.",
      "properties": []
    },
    {
      "id": "archimate:Node",
      "name": "Node",
      "layer": "technology",
      "aspect": "active",
      "shape": "node",
      "icon": "node.svg",
      "documentation": "A computational or physical resource that hosts, manipulates, or interacts with other computational or physical resources.",
      "properties": []
    },
    {
      "id": "archimate:SystemSoftware",
      "name": "System Software",
      "layer": "technology",
      "aspect": "active",
      "shape": "system-software",
      "icon": "system-software.svg",
      "documentation": "Software that provides or contributes to an environment for storing, executing, and using software or data.",
      "properties": []
    }
  ],
  "relationshipTypes": [
    {
      "id": "archimate:Composition",
      "name": "Composition",
      "lineStyle": "solid",
      "sourceArrow": "diamond-filled",
      "targetArrow": "none",
      "documentation": "Indicates that an element consists of one or more other concepts.",
      "validConnections": "structural"
    },
    {
      "id": "archimate:Aggregation",
      "name": "Aggregation",
      "lineStyle": "solid",
      "sourceArrow": "diamond-hollow",
      "targetArrow": "none",
      "documentation": "Indicates that an element combines one or more other concepts.",
      "validConnections": "structural"
    },
    {
      "id": "archimate:Assignment",
      "name": "Assignment",
      "lineStyle": "solid",
      "sourceArrow": "circle-filled",
      "targetArrow": "circle-hollow",
      "documentation": "Links active elements with units of behavior that are performed by them, or roles that are fulfilled by them.",
      "validConnections": [
        {"source": "archimate:BusinessActor", "target": "archimate:BusinessRole"},
        {"source": "archimate:BusinessRole", "target": "archimate:BusinessProcess"},
        {"source": "archimate:BusinessRole", "target": "archimate:BusinessFunction"},
        {"source": "archimate:ApplicationComponent", "target": "archimate:ApplicationService"},
        {"source": "archimate:Node", "target": "archimate:SystemSoftware"},
        {"source": "archimate:Node", "target": "archimate:Artifact"},
        {"source": "archimate:SystemSoftware", "target": "archimate:ApplicationComponent"}
      ]
    },
    {
      "id": "archimate:Serving",
      "name": "Serving",
      "lineStyle": "solid",
      "sourceArrow": "none",
      "targetArrow": "open",
      "documentation": "Models that an element provides its functionality to another element.",
      "validConnections": "serving-rules"
    },
    {
      "id": "archimate:Realization",
      "name": "Realization",
      "lineStyle": "dashed",
      "sourceArrow": "none",
      "targetArrow": "hollow-triangle",
      "documentation": "Indicates that an entity plays a critical role in the creation, achievement, sustenance, or operation of a more abstract entity.",
      "validConnections": "realization-rules"
    },
    {
      "id": "archimate:Flow",
      "name": "Flow",
      "lineStyle": "dashed",
      "sourceArrow": "none",
      "targetArrow": "filled",
      "documentation": "Represents transfer from one element to another.",
      "validConnections": "behavior-to-behavior"
    },
    {
      "id": "archimate:Triggering",
      "name": "Triggering",
      "lineStyle": "solid",
      "sourceArrow": "none",
      "targetArrow": "filled",
      "documentation": "Represents a temporal or causal relationship between elements.",
      "validConnections": "behavior-to-behavior"
    },
    {
      "id": "archimate:Access",
      "name": "Access",
      "lineStyle": "dashed",
      "sourceArrow": "none",
      "targetArrow": "open",
      "documentation": "Models the access of behavioral elements to business or data objects.",
      "validConnections": "behavior-to-passive",
      "properties": [
        {"name": "accessType", "type": "enum", "values": ["read", "write", "readwrite", "access"]}
      ]
    },
    {
      "id": "archimate:Association",
      "name": "Association",
      "lineStyle": "solid",
      "sourceArrow": "none",
      "targetArrow": "none",
      "documentation": "Models an unspecified relationship, or a relationship that is not represented by another ArchiMate relationship.",
      "validConnections": "any"
    },
    {
      "id": "archimate:Specialization",
      "name": "Specialization",
      "lineStyle": "solid",
      "sourceArrow": "none",
      "targetArrow": "hollow-triangle",
      "documentation": "Indicates that an element is a particular kind of another element.",
      "validConnections": "same-type"
    }
  ],
  "viewpoints": [
    {
      "id": "archimate:Layered",
      "name": "Layered",
      "allowedElements": "*",
      "allowedRelationships": "*",
      "description": "Provides an overview across multiple layers"
    },
    {
      "id": "archimate:ApplicationCooperation",
      "name": "Application Cooperation",
      "allowedElements": [
        "archimate:ApplicationComponent",
        "archimate:ApplicationInterface",
        "archimate:ApplicationService",
        "archimate:DataObject",
        "archimate:ApplicationCollaboration"
      ],
      "allowedRelationships": "*",
      "description": "Shows application components and their interrelationships"
    },
    {
      "id": "archimate:Technology",
      "name": "Technology",
      "allowedElements": [
        "archimate:Node",
        "archimate:Device",
        "archimate:SystemSoftware",
        "archimate:TechnologyInterface",
        "archimate:CommunicationNetwork",
        "archimate:TechnologyService",
        "archimate:Artifact"
      ],
      "allowedRelationships": "*",
      "description": "Shows the technology infrastructure"
    }
  ]
}
```

---

## File System Structure (Model Repository)

```
/my-enterprise-architecture
├── .openea/
│   ├── config.json              # Project settings, default viewpoints
│   └── styles.json              # Custom colors, fonts
│
├── elements/
│   ├── business/
│   │   ├── actors.json          # All business actors
│   │   ├── processes.json       # All business processes
│   │   └── services.json        # All business services
│   ├── application/
│   │   ├── components.json      # All application components
│   │   ├── services.json        # All application services
│   │   └── data-objects.json    # All data objects
│   └── technology/
│       ├── nodes.json           # All nodes
│       ├── infrastructure.json  # Networks, devices
│       └── artifacts.json       # Deployables
│
├── relationships/
│   └── relationships.json       # All relationships in one file (or split by type)
│
├── views/
│   ├── landscape/
│   │   └── application-landscape.view.json
│   ├── domains/
│   │   ├── payments.view.json
│   │   ├── customer-management.view.json
│   │   └── reporting.view.json
│   └── technology/
│       ├── production-infrastructure.view.json
│       └── aws-deployment.view.json
│
└── README.md
```

---

## Technology Stack

| Layer | Choice | Rationale |
|-------|--------|-----------|
| Canvas | **React Flow** | Mature, performant, good DX |
| UI Framework | **React + TypeScript** | Ecosystem, type safety |
| State | **Zustand** | Lightweight, good React Flow integration |
| Styling | **Tailwind CSS** | Rapid iteration |
| File Storage | **Local FS + isomorphic-git** | Git in browser or Node |
| Desktop | **Tauri** (optional) | Lighter than Electron, Rust-based |
| Validation | **Zod** | Runtime schema validation |

---

## Libraries to Leverage

### Existing ArchiMate Work
- **Archi** (Eclipse-based) — Reference implementation, can study metamodel
- **archi-lib** — Some parsing utilities exist
- **archimate-js** — Incomplete but starting point for rendering

### BPMN (Phase 2)
- **bpmn-js** (Camunda) — Full BPMN modeler, very mature
- **bpmn-moddle** — BPMN 2.0 metamodel and parsing

### Core Infrastructure
- **React Flow** — Canvas
- **isomorphic-git** — Git operations
- **Zod** — Schema validation
- **fast-xml-parser** — ArchiMate Open Exchange Format parsing

### Export
- **html-to-image** — PNG/SVG export
- **jsPDF** — PDF export

---

## Import/Export Formats

| Format | Direction | Priority | Notes |
|--------|-----------|----------|-------|
| Native JSON | Both | MVP | Our format |
| ArchiMate Open Exchange (.archimate) | Import | MVP | Archi compatibility |
| SVG | Export | MVP | Vector diagrams |
| PNG | Export | MVP | Raster diagrams |
| CSV | Both | Phase 2 | Element lists for Excel users |
| XMI | Both | Phase 3 | UML interchange |
| PDF | Export | Phase 2 | Documentation |

---

## Development Phases

### Phase 1: ArchiMate MVP (8-12 weeks)

**Core Infrastructure**
- [ ] Monorepo setup (pnpm workspaces)
- [ ] Core metamodel engine with Zod schemas
- [ ] ArchiMate metamodel definition (MVP elements)
- [ ] Element repository (CRUD, JSON persistence)
- [ ] Relationship repository with validation

**UI - Canvas**
- [ ] React Flow setup with custom node types
- [ ] ArchiMate shape library (SVG components per element type)
- [ ] Layer coloring (Business=yellow, Application=cyan, Technology=green)
- [ ] Relationship rendering (correct line styles and arrows)
- [ ] Nested elements (composition)

**UI - Panels**
- [ ] Element palette (grouped by layer)
- [ ] Element browser (tree view)
- [ ] Property panel (edit selected element)
- [ ] View/diagram tabs

**Persistence**
- [ ] Save/load project from filesystem
- [ ] ArchiMate Open Exchange import (from Archi)
- [ ] SVG/PNG export

**Deliverable**: Usable ArchiMate modeler for single user, can import existing Archi models

---

### Phase 2: BPMN + Polish (6-8 weeks)

**BPMN Support**
- [ ] BPMN metamodel definition
- [ ] BPMN shape library
- [ ] Integrate/adapt bpmn-js or build custom
- [ ] BPMN 2.0 XML import/export

**Cross-Notation**
- [ ] Link BPMN processes to ArchiMate business processes
- [ ] Unified element browser across notations

**Quality of Life**
- [ ] Keyboard shortcuts
- [ ] Undo/redo (command pattern)
- [ ] Search across model
- [ ] Minimap
- [ ] Zoom to fit
- [ ] Auto-layout options

**Git Integration**
- [ ] Git status indicator
- [ ] Commit from UI
- [ ] Simple diff viewer

**Deliverable**: Multi-notation modeler with BPMN, git-aware

---

### Phase 3: Enterprise Features (ongoing)

- [ ] Additional ArchiMate elements (Strategy, Motivation)
- [ ] UML support (Class, Component, Sequence diagrams)
- [ ] Impact analysis (what depends on this element?)
- [ ] Custom properties and tags
- [ ] View templates
- [ ] Documentation generation
- [ ] Validation rules editor
- [ ] PlantUML import
- [ ] Web-hosted version (no install)

---

## UI Wireframe

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  File  Edit  View  Diagram  Tools  Help                      [Git: main ●]  │
├─────────────┬───────────────────────────────────────────────┬───────────────┤
│   PALETTE   │                                               │  PROPERTIES   │
│             │                                               │               │
│ ▼ Business  │                                               │ Name:         │
│   ○ Actor   │                                               │ [Payment Svc] │
│   ○ Role    │           ┌─────────────┐                     │               │
│   ○ Process │           │  Payment    │                     │ Type:         │
│   ○ Service │           │  Service    │────▷ ┌─────────┐   │ App Component │
│             │           │  [App Comp] │      │ Card    │   │               │
│ ▼ Application│          └─────────────┘      │ Gateway │   │ Layer:        │
│   ○ Component│                │              │ [Node]  │   │ Application   │
│   ○ Service │                 │              └─────────┘   │               │
│   ○ Interface│                ▼                            │ Documentation:│
│   ○ Data Obj │          ┌─────────────┐                    │ [            ]│
│             │           │  Payment DB │                     │ [            ]│
│ ▼ Technology│           │  [Data Obj] │                     │               │
│   ○ Node    │           └─────────────┘                     │ Properties:   │
│   ○ Device  │                                               │ owner: [    ] │
│   ○ Artifact│                                               │ status: [▼]  │
│             │                                               │               │
├─────────────┼───────────────────────────────────────────────┼───────────────┤
│  BROWSER    │  Landscape │ Payments │ Infrastructure │ +    │               │
├─────────────┤───────────────────────────────────────────────┴───────────────┤
│ 🔍 Search   │                                                               │
│             │  ┌──────────────────────────────────────────────────────────┐ │
│ ▼ Business  │  │ VALIDATION                                               │ │
│   ├ Actors  │  │ ⚠ "Payment Service" has no serving relationships        │ │
│   └ Process │  │ ✓ All elements are connected                            │ │
│ ▼ Application│ └──────────────────────────────────────────────────────────┘ │
│   ├ Payment │                                                               │
│   └ CRM     │                                                               │
└─────────────┴───────────────────────────────────────────────────────────────┘
```

---

## Comparison: Why This Over Alternatives

| Aspect | Sparx EA | Archi | This Tool |
|--------|----------|-------|-----------|
| UX | 2005 desktop | Decent but dated | Modern web |
| Price | $$$$ | Free | Free/Open |
| Git integration | Bolt-on | Export only | Native |
| Collaboration | Check-in/out | None | Git branching |
| Multi-notation | Yes (strength) | ArchiMate only | Pluggable |
| Learning curve | Steep | Moderate | Low |
| File format | Proprietary | XML | JSON (diffable) |
| Extensibility | Scripting | Plugins | Code + metamodel |

---

## Success Criteria

1. **Architects use it voluntarily** — If people still flee to Miro, we've failed
2. **Models are maintainable** — Git history is useful, PRs are reviewable
3. **Import works** — Can bring in existing Archi models without pain
4. **Fast enough** — Large models (1000+ elements) remain responsive
5. **Looks professional** — Output is presentation-ready without post-processing

---

## Open Questions

1. **Naming?** OpenEA, Archie, Modeler.js, Sketch.EA, something else?

2. **Archi import fidelity?** How perfect does it need to be? 90%? 99%?

3. **Solo project or seek contributors early?** 

4. **License?** MIT, Apache 2.0, AGPL?

---

## Next Steps

1. Scaffold monorepo
2. Define TypeScript types for ArchiMate metamodel
3. Build element/relationship repository with Zod validation
4. Create React Flow canvas with one element type (ApplicationComponent)
5. Add palette → canvas drag-drop
6. Add property panel
7. Implement save/load JSON
8. Iterate: add more element types, relationships, views
9. Archi import
10. Dogfood with a real architecture

---

*Let's build the EA tool that architects actually want to use.*