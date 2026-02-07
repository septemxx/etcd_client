import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Card, List, message, Popconfirm, Tag, Space, Modal } from 'antd';
import { DeleteOutlined, ApiOutlined, SaveOutlined, ThunderboltOutlined, PlusOutlined, EditOutlined } from '@ant-design/icons';
import { invoke } from '@tauri-apps/api/core';
import { ConnectionConfig } from '../types';
import { useConnectionStore } from '../store/useConnectionStore';
import { useNavigate } from 'react-router-dom';

const ConnectionManager: React.FC = () => {
  const [form] = Form.useForm();
  const [connections, setConnections] = useState<ConnectionConfig[]>([]);
  const [loading, setLoading] = useState(false);
  const [testing, setTesting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingConfig, setEditingConfig] = useState<ConnectionConfig | null>(null);
  const { setConnected } = useConnectionStore();
  const navigate = useNavigate();

  useEffect(() => {
    loadConnections();
  }, []);

  const loadConnections = async () => {
    try {
      const saved = await invoke<ConnectionConfig[]>('get_saved_connections');
      setConnections(saved);
    } catch (error) {
      console.error('Failed to load connections:', error);
      message.error('加载连接配置失败');
    }
  };

  const handleTest = async () => {
    try {
      setTesting(true);
      const values = await form.validateFields();
      const hosts = values.hosts.split(',').map((h: string) => h.trim());
      
      await invoke('test_etcd_connection', {
        hosts,
        username: values.username || null,
        password: values.password || null,
      });
      message.success('连接测试成功');
    } catch (error: any) {
      message.error(`连接测试失败: ${error}`);
    } finally {
      setTesting(false);
    }
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const hosts = values.hosts.split(',').map((h: string) => h.trim());
      
      const config: ConnectionConfig = {
        name: values.name,
        hosts,
        username: values.username || undefined,
        password: values.password || undefined,
        createdAt: Date.now(),
      };

      await invoke('save_connection_config', { config });
      message.success('配置已保存');
      setIsModalOpen(false);
      loadConnections();
    } catch (error: any) {
      message.error(`保存失败: ${error}`);
    }
  };

  const handleConnect = async (config?: ConnectionConfig) => {
    try {
      setLoading(true);
      let targetConfig = config;
      
      if (!targetConfig) {
        const values = await form.validateFields();
        const hosts = values.hosts.split(',').map((h: string) => h.trim());
        targetConfig = {
          name: values.name,
          hosts,
          username: values.username || undefined,
          password: values.password || undefined,
          createdAt: Date.now(),
        };
      }

      await invoke('connect_etcd', {
        hosts: targetConfig.hosts,
        username: targetConfig.username || null,
        password: targetConfig.password || null,
      });

      setConnected(true, targetConfig);
      message.success(`已连接到 ${targetConfig.name}`);
      navigate('/browser');
      // Close modal if connecting from modal
      if (!config) {
        setIsModalOpen(false);
      }
    } catch (error: any) {
      message.error(`连接失败: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (name: string) => {
    try {
      await invoke('delete_connection', { name });
      message.success('删除成功');
      loadConnections();
    } catch (error) {
      message.error('删除失败');
    }
  };

  const openModal = (config?: ConnectionConfig) => {
    setEditingConfig(config || null);
    if (config) {
      form.setFieldsValue({
        name: config.name,
        hosts: config.hosts.join(','),
        username: config.username,
        password: config.password,
      });
    } else {
      form.resetFields();
      form.setFieldsValue({ hosts: '127.0.0.1:2379', name: 'Local ETCD' });
    }
    setIsModalOpen(true);
  };

  return (
    <div className="h-full p-4">
      <Card 
        title="连接管理" 
        className="h-full flex flex-col" 
        styles={{ body: { flex: 1, overflow: 'auto' } }}
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={() => openModal()}>
            新增连接
          </Button>
        }
      >
        <List
          grid={{ gutter: 16, column: 1, xs: 1, sm: 1, md: 2, lg: 2, xl: 3, xxl: 4 }}
          dataSource={connections}
          renderItem={(item) => (
            <List.Item>
              <Card 
                hoverable
                className="cursor-pointer"
                actions={[
                  <Button type="link" icon={<ThunderboltOutlined />} onClick={(e) => { e.stopPropagation(); handleConnect(item); }}>连接</Button>,
                  <Button type="link" icon={<EditOutlined />} onClick={(e) => { e.stopPropagation(); openModal(item); }}>编辑</Button>,
                  <Popconfirm title="确定删除?" onConfirm={(e) => { e?.stopPropagation(); handleDelete(item.name); }}>
                    <Button type="link" danger icon={<DeleteOutlined />} onClick={(e) => e.stopPropagation()}>删除</Button>
                  </Popconfirm>
                ]}
                onClick={() => handleConnect(item)}
              >
                <Card.Meta
                  avatar={<ApiOutlined className="text-2xl text-blue-500" />}
                  title={item.name}
                  description={
                    <div className="text-xs text-gray-500 truncate" title={item.hosts.join(', ')}>
                      {item.hosts.join(', ')}
                    </div>
                  }
                />
              </Card>
            </List.Item>
          )}
        />
        {connections.length === 0 && (
          <EmptyState onAdd={() => openModal()} />
        )}
      </Card>

      <Modal
        title={editingConfig ? "编辑连接" : "新增连接"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            label="连接名称"
            name="name"
            rules={[{ required: true, message: '请输入连接名称' }]}
          >
            <Input placeholder="例如: Production Cluster" prefix={<Tag color="blue">Name</Tag>} />
          </Form.Item>

          <Form.Item
            label="主机地址 (多个地址用逗号分隔)"
            name="hosts"
            rules={[{ required: true, message: '请输入ETCD主机地址' }]}
          >
            <Input placeholder="127.0.0.1:2379, 192.168.1.100:2379" />
          </Form.Item>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item label="用户名 (可选)" name="username">
              <Input placeholder="root" />
            </Form.Item>

            <Form.Item label="密码 (可选)" name="password">
              <Input.Password placeholder="******" />
            </Form.Item>
          </div>

          <Form.Item className="mb-0 flex justify-end">
            <Space>
              <Button onClick={handleTest} loading={testing}>
                测试连接
              </Button>
              <Button icon={<SaveOutlined />} onClick={handleSave}>
                保存配置
              </Button>
              <Button type="primary" icon={<ThunderboltOutlined />} loading={loading} onClick={() => handleConnect()}>
                直接连接
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

const EmptyState = ({ onAdd }: { onAdd: () => void }) => (
  <div className="flex flex-col items-center justify-center h-64 text-gray-400">
    <ApiOutlined className="text-4xl mb-4 text-gray-200" />
    <p className="mb-4">暂无保存的连接配置</p>
    <Button type="dashed" onClick={onAdd}>创建第一个连接</Button>
  </div>
);

export default ConnectionManager;
