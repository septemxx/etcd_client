# ETCD UI

## 项目简介
ETCD UI 是一个基于 Tauri 和 React 开发的跨平台 ETCD 管理工具，旨在提供直观、高效的 ETCD 键值对管理界面。

### 产品背景
ETCD 是一个分布式键值存储系统，广泛应用于容器编排、服务发现等场景。然而，目前 ETCD 的管理工具相对缺乏，尤其是跨平台的图形化界面工具。本项目旨在解决这一问题，为开发人员和运维人员提供一个易用的 ETCD 管理界面。

### 目标
- 提供跨平台的 ETCD 管理界面
- 支持 ETCD 连接管理
- 提供键值对的增删改查功能
- 支持键的树形结构展示
- 提供简单直观的用户操作体验

## 核心功能

1. **连接管理**
   - 支持添加、编辑、删除 ETCD 连接配置
   - 支持连接测试
   - 支持保存多个连接配置

2. **键值管理**
   - 支持键值对的添加、编辑、删除
   - 支持按前缀过滤键
   - 支持键的树形结构展示
   - 支持键值的复制功能

3. **用户界面**
   - 响应式设计，适配不同屏幕尺寸
   - 直观的操作流程
   - 实时反馈操作结果

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

## 开发环境

### 前端依赖
- Node.js 18+
- npm 或 yarn

### 后端依赖
- Rust 1.60+
- Cargo

### 推荐 IDE
- [VS Code](https://code.visualstudio.com/) + [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode) + [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)

## 项目结构

```
etcd_ui_trae/
├── .github/            # GitHub 配置
│   └── workflows/      # CI/CD 配置
├── public/             # 静态资源
├── src/                # 前端代码
│   ├── assets/         # 前端资源
│   ├── layouts/        # 布局组件
│   ├── pages/          # 页面组件
│   ├── store/          # 状态管理
│   ├── types/          # 类型定义
│   ├── utils/          # 工具函数
│   ├── App.tsx         # 应用主组件
│   └── main.tsx        # 应用入口
├── src-tauri/          # Tauri 后端代码
│   ├── capabilities/   # 能力配置
│   ├── icons/          # 应用图标
│   ├── src/            # Rust 源代码
│   ├── Cargo.toml      # Rust 依赖配置
│   └── tauri.conf.json # Tauri 配置
├── docs/               # 文档目录
├── README.md           # 项目主文档
├── package.json        # 前端依赖配置
└── tsconfig.json       # TypeScript 配置
```

## CI/CD

项目使用 GitHub Actions 进行 CI/CD 配置，配置文件位于 `.github/workflows/release.yml`。主要流程包括：

1. 代码检查
2. 构建前端和后端
3. 生成发布包
4. 发布到 GitHub Releases

## API

### 前端调用的后端接口

1. **test_etcd_connection**
   - 功能：测试 ETCD 连接
   - 参数：
     - hosts: Vec<String> - ETCD 主机地址列表
     - username: Option<String> - 用户名（可选）
     - password: Option<String> - 密码（可选）
   - 返回：Result<bool, String> - 连接是否成功

2. **connect_etcd**
   - 功能：连接到 ETCD
   - 参数：
     - hosts: Vec<String> - ETCD 主机地址列表
     - username: Option<String> - 用户名（可选）
     - password: Option<String> - 密码（可选）
   - 返回：Result<bool, String> - 连接是否成功

3. **save_connection_config**
   - 功能：保存连接配置
   - 参数：
     - config: ConnectionConfig - 连接配置
   - 返回：Result<(), String> - 保存是否成功

4. **get_saved_connections**
   - 功能：获取保存的连接配置
   - 参数：无
   - 返回：Result<Vec<ConnectionConfig>, String> - 连接配置列表

5. **delete_connection**
   - 功能：删除连接配置
   - 参数：
     - name: String - 连接名称
   - 返回：Result<(), String> - 删除是否成功

6. **get_key_values**
   - 功能：获取键值对
   - 参数：
     - prefix: String - 键前缀
     - _limit: Option<i64> - 限制数量（可选）
   - 返回：Result<Vec<KeyValue>, String> - 键值对列表

7. **set_key_value**
   - 功能：设置键值对
   - 参数：
     - key: String - 键
     - value: String - 值
   - 返回：Result<(), String> - 设置是否成功

8. **delete_key**
   - 功能：删除键
   - 参数：
     - key: String - 键
   - 返回：Result<(), String> - 删除是否成功

## 快速开始

### 安装依赖
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

## 文档

详细文档请参考 `docs` 目录：
- [接口文档](docs/api.md)
- [Changelog](docs/changelog.md)
