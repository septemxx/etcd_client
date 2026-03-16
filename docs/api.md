# 接口文档

## 后端接口

### 1. test_etcd_connection

**功能**：测试 ETCD 连接

**参数**：
- `hosts`: `Vec<String>` - ETCD 主机地址列表
- `username`: `Option<String>` - 用户名（可选）
- `password`: `Option<String>` - 密码（可选）

**返回**：
- `Result<bool, String>` - 连接是否成功，失败时返回错误信息

**使用示例**：
```typescript
import { invoke } from '@tauri-apps/api/core';

const result = await invoke('test_etcd_connection', {
  hosts: ['127.0.0.1:2379'],
  username: 'root',
  password: 'password'
});
```

### 2. connect_etcd

**功能**：连接到 ETCD

**参数**：
- `hosts`: `Vec<String>` - ETCD 主机地址列表
- `username`: `Option<String>` - 用户名（可选）
- `password`: `Option<String>` - 密码（可选）

**返回**：
- `Result<bool, String>` - 连接是否成功，失败时返回错误信息

**使用示例**：
```typescript
import { invoke } from '@tauri-apps/api/core';

const result = await invoke('connect_etcd', {
  hosts: ['127.0.0.1:2379'],
  username: 'root',
  password: 'password'
});
```

### 3. save_connection_config

**功能**：保存连接配置

**参数**：
- `config`: `ConnectionConfig` - 连接配置
  - `name`: `String` - 连接名称
  - `hosts`: `Vec<String>` - ETCD 主机地址列表
  - `username`: `Option<String>` - 用户名（可选）
  - `password`: `Option<String>` - 密码（可选）
  - `createdAt`: `number` - 创建时间戳

**返回**：
- `Result<(), String>` - 保存是否成功，失败时返回错误信息

**使用示例**：
```typescript
import { invoke } from '@tauri-apps/api/core';

await invoke('save_connection_config', {
  config: {
    name: 'Local ETCD',
    hosts: ['127.0.0.1:2379'],
    username: undefined,
    password: undefined,
    createdAt: Date.now()
  }
});
```

### 4. get_saved_connections

**功能**：获取保存的连接配置

**参数**：无

**返回**：
- `Result<Vec<ConnectionConfig>, String>` - 连接配置列表，失败时返回错误信息

**使用示例**：
```typescript
import { invoke } from '@tauri-apps/api/core';

const connections = await invoke('get_saved_connections');
```

### 5. delete_connection

**功能**：删除连接配置

**参数**：
- `name`: `String` - 连接名称

**返回**：
- `Result<(), String>` - 删除是否成功，失败时返回错误信息

**使用示例**：
```typescript
import { invoke } from '@tauri-apps/api/core';

await invoke('delete_connection', {
  name: 'Local ETCD'
});
```

### 6. get_key_values

**功能**：获取键值对

**参数**：
- `prefix`: `String` - 键前缀
- `_limit`: `Option<i64>` - 限制数量（可选）

**返回**：
- `Result<Vec<KeyValue>, String>` - 键值对列表，失败时返回错误信息
  - `key`: `String` - 键
  - `value`: `String` - 值
  - `version`: `number` - 版本
  - `create_revision`: `number` - 创建版本
  - `mod_revision`: `number` - 修改版本
  - `lease`: `number` - 租约

**使用示例**：
```typescript
import { invoke } from '@tauri-apps/api/core';

const kvs = await invoke('get_key_values', {
  prefix: '',
  limit: 1000
});
```

### 7. set_key_value

**功能**：设置键值对

**参数**：
- `key`: `String` - 键
- `value`: `String` - 值

**返回**：
- `Result<(), String>` - 设置是否成功，失败时返回错误信息

**使用示例**：
```typescript
import { invoke } from '@tauri-apps/api/core';

await invoke('set_key_value', {
  key: 'test/key',
  value: 'test value'
});
```

### 8. delete_key

**功能**：删除键

**参数**：
- `key`: `String` - 键

**返回**：
- `Result<(), String>` - 删除是否成功，失败时返回错误信息

**使用示例**：
```typescript
import { invoke } from '@tauri-apps/api/core';

await invoke('delete_key', {
  key: 'test/key'
});
```

## 前端状态管理

### useConnectionStore

**功能**：管理 ETCD 连接状态

**状态**：
- `isConnected`: `boolean` - 是否已连接到 ETCD
- `currentConnection`: `ConnectionConfig | undefined` - 当前连接配置

**方法**：
- `setConnected(isConnected: boolean, connection: ConnectionConfig | undefined)` - 设置连接状态

**使用示例**：
```typescript
import { useConnectionStore } from '../store/useConnectionStore';

const { isConnected, currentConnection, setConnected } = useConnectionStore();
```

## 类型定义

### ConnectionConfig

```typescript
interface ConnectionConfig {
  name: string;
  hosts: string[];
  username?: string;
  password?: string;
  createdAt: number;
}
```

### KeyValue

```typescript
interface KeyValue {
  key: string;
  value: string;
  version: number;
  create_revision: number;
  mod_revision: number;
  lease: number;
}
```