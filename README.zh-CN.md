# ETCD 客户端

一款基于 Tauri 和 React 开发的跨平台 ETCD 管理工具，提供直观高效的界面来管理 ETCD 键值对。

> **English Version**: [English README](./README.md)

## 概述

ETCD Client 是一款使用 Tauri 和 React 开发的桌面应用程序，提供友好的用户界面来管理 ETCD 键值存储。支持连接管理、键值对的 CRUD 操作，以及直观的树形键导航。

## 功能特性

### 连接管理
- 添加、编辑和删除 ETCD 连接配置
- 保存前测试连接
- 支持多个已保存的连接配置

### 键值操作
- 添加、编辑和删除键值对
- 按前缀筛选键
- 树形键结构显示
- 复制键值到剪贴板

### 用户界面
- 响应式设计，适配不同屏幕尺寸
- 直观的操作流程
- 实时操作反馈

## 技术栈

### 前端
- React 19
- TypeScript
- Ant Design
- Tailwind CSS
- Vite

### 后端
- Rust
- Tauri
- etcd-client
- Tokio

## 项目结构

```
etcd_ui/
├── .github/            # GitHub 配置
│   └── workflows/      # CI/CD 配置
├── public/             # 静态资源
├── src/                # 前端代码
│   ├── assets/         # 前端资源
│   ├── layouts/       # 布局组件
│   ├── pages/         # 页面组件
│   ├── store/         # 状态管理
│   ├── types/         # 类型定义
│   ├── utils/        # 工具函数
│   ├── App.tsx       # 主应用组件
│   └── main.tsx       # 应用入口
├── src-tauri/          # Tauri 后端代码
│   ├── capabilities/  # 能力配置
│   ├── icons/         # 应用图标
│   ├── src/          # Rust 源代码
│   ├── Cargo.toml    # Rust 依赖
│   └── tauri.conf.json # Tauri 配置
├── docs/              # 文档
├── README.md          # 英文版
├── README.zh-CN.md   # 中文版
├── package.json       # 前端依赖
└── tsconfig.json    # TypeScript 配置
```

## 快速开始

### 前置要求

**前端：**
- Node.js 18+
- npm 或 yarn

**后端：**
- Rust 1.60+
- Cargo

**推荐 IDE：**
- [VS Code](https://code.visualstudio.com/) 配合 [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode) 和 [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer) 扩展

### 安装

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

### 构建应用

```bash
npm run build
```

### 运行 Tauri 命令

```bash
npm run tauri [command]
```

## API

### 后端命令

1. **test_etcd_connection**
   - 用途：测试 ETCD 连接
   - 参数：
     - hosts: Vec - ETCD 主机地址
     - username: Option - 用户名（可选）
     - password: Option - 密码（可选）
   - 返回：Result<bool, String>

2. **connect_etcd**
   - 用途：连接 ETCD
   - 参数：
     - hosts: Vec - ETCD 主机地址
     - username: Option - 用户名（可选）
     - password: Option - 密码（可选）
   - 返回：Result<bool, String>

3. **save_connection_config**
   - 用途：保存连接配置
   - 参数：
     - config: ConnectionConfig - 连接配置
   - 返回：Result<(), String>

4. **get_saved_connections**
   - 用途：获取已保存的连接配置
   - 参数：无
   - 返回：Result<Vec, String>

5. **delete_connection**
   - 用途：删除连接配置
   - 参数：
     - name: String - 连接名称
   - 返回���Result<(), String>

6. **get_key_values**
   - 用途：获取键值对
   - 参数：
     - prefix: String - 键前缀
     - _limit: Option - 限制数量（可选）
   - 返回：Result<Vec, String>

7. **set_key_value**
   - 用途：设置键值对
   - 参数：
     - key: String - 键
     - value: String - 值
   - 返回：Result<(), String>

8. **delete_key**
   - 用途：删除键
   - 参数：
     - key: String - 键
   - 返回：Result<(), String>

## CI/CD

项目使用 GitHub Actions 进行 CI/CD。配置文件位于 `.github/workflows/release.yml`。主要工作流程包括：

1. 代码检查
2. 构建前端和后端
3. 生成发布包
4. 发布到 GitHub Releases

## 文档

详细文档请参考 `docs` 目录：
- [API 文档](/septemxx/etcd_ui/blob/main/docs/api.md)
- [更新日志](/septemxx/etcd_ui/blob/main/docs/changelog.md)

## 许可证

MIT License