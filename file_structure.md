# Project File Structure

This document serves as the authoritative guide for the Pulse of Malaysia project's directory structure. Any modifications to this structure require explicit user verification and manual confirmation before being implemented.

> [!IMPORTANT]
> **MANDATORY RULE:** If any change requires modifying the directory hierarchy or moving core files, the agent MUST alert the user and obtain explicit confirmation before proceeding.

## Directory Hierarchy

```text
├── .agent/              # Agent skills and configurations
│   └── skills/          # Custom agent capabilities
├── .next/               # Next.js build output (Ignored)
├── .tmp/                # Temporary workbench for intermediate data processing
├── architecture/        # Layer 1: Technical SOPs (Standard Operating Procedures)
├── data/                # Raw and processed datasets
├── docs/                # Project documentation
├── public/              # Static assets (images, icons, logos)
├── Rerfrence documents/ # Official competition guidelines and rubrics
├── src/                 # Application source code (Next.js components, pages, styles)
├── tools/               # Layer 3: Deterministic scripts and utility tools
├── .env                 # API Keys and Secrets (Local only)
├── .gitignore           # Git ignore rules
├── ai_rules.md          # Project Constitution and AI Behavioral Rules
├── architecture.md      # System Architecture and Design
├── file_structure.md    # [THIS FILE] Authoritative structure guide
├── package.json         # Node.js dependencies and scripts
├── plan.md              # Active implementation plan
├── prd.md               # Project Requirements Document
└── tsconfig.json        # TypeScript configuration
```

## Maintenance
- Ensure new high-level directories are added here upon approval.
- Keep descriptions concise and accurate.
