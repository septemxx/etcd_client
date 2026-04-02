# ETCD Client

A cross-platform ETCD management tool built with Tauri and React, providing an intuitive and efficient interface for managing ETCD key-value pairs.

> **中文版本**: [中文 README](./README.zh-CN.md)

## Overview

ETCD Client is a desktop application developed using Tauri and React, designed to provide a user-friendly interface for managing ETCD key-value stores. It supports connection management, CRUD operations on key-value pairs, and intuitive tree-based key navigation.

## Features

### Connection Management
- Add, edit, and delete ETCD connection configurations
- Test connections before saving
- Support multiple saved connection profiles

### Key-Value Operations
- Add, edit, and delete key-value pairs
- Filter keys by prefix
- Tree-based key structure display
- Copy key values to clipboard

### User Interface
- Responsive design for different screen sizes
- Intuitive operation flow
- Real-time operation feedback

## Tech Stack

### Frontend
- React 19
- TypeScript
- Ant Design
- Tailwind CSS
- Vite

### Backend
- Rust
- Tauri
- etcd-client
- Tokio

## Project Structure

```
etcd_client/
├── .github/            # GitHub configurations
│   └── workflows/      # CI/CD configuration
├── public/             # Static assets
├── src/                # Frontend code
│   ├── assets/         # Frontend assets
│   ├── layouts/        # Layout components
│   ├── pages/          # Page components
│   ├── store/          # State management
│   ├── types/          # Type definitions
│   ├── utils/          # Utility functions
│   ├── App.tsx         # Main application component
│   └── main.tsx        # Application entry point
├── src-tauri/          # Tauri backend code
│   ├── capabilities/   # Capability configuration
│   ├── icons/          # Application icons
│   ├── src/            # Rust source code
│   ├── Cargo.toml      # Rust dependencies
│   └── tauri.conf.json # Tauri configuration
├── docs/               # Documentation
├── README.md           # This file (English)
├── README.zh-CN.md     # Chinese version
├── package.json        # Frontend dependencies
└── tsconfig.json       # TypeScript configuration
```

## Getting Started

### Prerequisites

**Frontend:**
- Node.js 18+
- npm or yarn

**Backend:**
- Rust 1.60+
- Cargo

**Recommended IDE:**
- [VS Code](https://code.visualstudio.com/) with [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode) and [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer) extensions

### Installation

```bash
npm install
```

### Development Mode

```bash
npm run dev
```

### Build Application

```bash
npm run build
```

### Run Tauri Commands

```bash
npm run tauri [command]
```

## API

### Backend Commands

1. **test_etcd_connection**
   - Purpose: Test ETCD connection
   - Parameters:
     - hosts: Vec - ETCD host addresses
     - username: Option - Username (optional)
     - password: Option - Password (optional)
   - Returns: Result<bool, String>

2. **connect_etcd**
   - Purpose: Connect to ETCD
   - Parameters:
     - hosts: Vec - ETCD host addresses
     - username: Option - Username (optional)
     - password: Option - Password (optional)
   - Returns: Result<bool, String>

3. **save_connection_config**
   - Purpose: Save connection configuration
   - Parameters:
     - config: ConnectionConfig - Connection configuration
   - Returns: Result<(), String>

4. **get_saved_connections**
   - Purpose: Get saved connection configurations
   - Parameters: None
   - Returns: Result<Vec, String>

5. **delete_connection**
   - Purpose: Delete connection configuration
   - Parameters:
     - name: String - Connection name
   - Returns: Result<(), String>

6. **get_key_values**
   - Purpose: Get key-value pairs
   - Parameters:
     - prefix: String - Key prefix
     - _limit: Option - Limit count (optional)
   - Returns: Result<Vec, String>

7. **set_key_value**
   - Purpose: Set key-value pair
   - Parameters:
     - key: String - Key
     - value: String - Value
   - Returns: Result<(), String>

8. **delete_key**
   - Purpose: Delete key
   - Parameters:
     - key: String - Key
   - Returns: Result<(), String>

## CI/CD

The project uses GitHub Actions for CI/CD. Configuration files are located in `.github/workflows/release.yml`. Main workflows include:

1. Code linting
2. Build frontend and backend
3. Generate release packages
4. Publish to GitHub Releases

## Documentation

For detailed documentation, please refer to the `docs` directory:
- [API Documentation](/septemxx/etcd_client/blob/main/docs/api.md)
- [Changelog](/septemxx/etcd_client/blob/main/docs/changelog.md)

## License

MIT License