import React, { useEffect, useState, useMemo } from 'react';
import { Table, Input, Button, Space, Modal, Form, message, Tag, Tree, Splitter, Empty } from 'antd';
import { ReloadOutlined, PlusOutlined, CopyOutlined, FolderOpenOutlined, FileOutlined, DisconnectOutlined } from '@ant-design/icons';
import { invoke } from '@tauri-apps/api/core';
import { KeyValue } from '../types';
import { useConnectionStore } from '../store/useConnectionStore';
import { useNavigate } from 'react-router-dom';
import { buildTree } from '../utils/treeUtils';

const { DirectoryTree } = Tree;

const KVBrowser: React.FC = () => {
  const { isConnected, setConnected } = useConnectionStore();
  const navigate = useNavigate();
  const [data, setData] = useState<KeyValue[]>([]);
  const [loading, setLoading] = useState(false);
  const [prefix, setPrefix] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
  const [selectedNodeData, setSelectedNodeData] = useState<KeyValue | null>(null);

  useEffect(() => {
    if (!isConnected) {
      message.warning('请先连接 ETCD');
      navigate('/');
      return;
    }
    fetchData();
  }, [isConnected]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch more keys for tree view to be useful
      const kvs = await invoke<KeyValue[]>('get_key_values', { prefix, limit: 1000 });
      setData(kvs);
    } catch (error: any) {
      message.error(`获取数据失败: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const treeData = useMemo(() => buildTree(data), [data]);

  const handleSelect = (keys: React.Key[], info: any) => {
    setSelectedKeys(keys);
    if (info.node.isLeaf) {
      setSelectedNodeData(info.node.data);
    } else {
      setSelectedNodeData(null);
    }
  };

  // Filter table data based on selected tree node (if folder) or show single item (if leaf)
  const filteredTableData = useMemo(() => {
    if (selectedKeys.length === 0) return data;
    
    const selectedKey = selectedKeys[0] as string;
    // Find if selected node is a leaf or folder
    const isLeaf = selectedNodeData !== null;

    if (isLeaf && selectedNodeData) {
      return [selectedNodeData];
    }

    // If folder, filter keys that start with the folder path
    return data.filter(item => item.key.startsWith(selectedKey));
  }, [data, selectedKeys, selectedNodeData]);

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      await invoke('set_key_value', { key: values.key, value: values.value });
      message.success('保存成功');
      setIsModalOpen(false);
      form.resetFields();
      fetchData();
    } catch (error: any) {
      message.error(`保存失败: ${error}`);
    }
  };

  const handleDelete = async (key: string) => {
    try {
      await invoke('delete_key', { key });
      message.success('删除成功');
      fetchData();
      setSelectedKeys([]);
      setSelectedNodeData(null);
    } catch (error: any) {
      message.error(`删除失败: ${error}`);
    }
  };

  const handleDisconnect = () => {
    setConnected(false, undefined);
    message.success('已断开连接');
    navigate('/');
  };

  const columns = [
    {
      title: 'Key',
      dataIndex: 'key',
      key: 'key',
      width: '30%',
      render: (text: string) => <TextWithCopy text={text} />,
      sorter: (a: KeyValue, b: KeyValue) => a.key.localeCompare(b.key),
    },
    {
      title: 'Value',
      dataIndex: 'value',
      key: 'value',
      width: '40%',
      render: (text: string) => (
        <div className="max-h-20 overflow-y-auto break-all font-mono text-xs bg-gray-50 p-1 rounded">
          {text}
        </div>
      ),
    },
    {
      title: 'Version',
      dataIndex: 'version',
      key: 'version',
      width: '10%',
      render: (v: number) => <Tag>{v}</Tag>,
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: KeyValue) => (
        <Space size="middle">
          <Button 
            type="link" 
            size="small" 
            onClick={() => {
              form.setFieldsValue({ key: record.key, value: record.value });
              setIsModalOpen(true);
            }}
          >
            Edit
          </Button>
          <Button 
            type="link" 
            danger 
            size="small" 
            onClick={() => handleDelete(record.key)}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm">
        <div className="flex items-center gap-4 flex-1">
          <Input 
            placeholder="按前缀过滤 (服务器端)..." 
            value={prefix}
            onChange={e => setPrefix(e.target.value)}
            onPressEnter={fetchData}
            style={{ maxWidth: 300 }}
            addonAfter={<ReloadOutlined onClick={fetchData} className="cursor-pointer" />}
          />
        </div>
        <Space>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => {
            form.resetFields();
            setIsModalOpen(true);
          }}>
            添加键值
          </Button>
          <Button danger icon={<DisconnectOutlined />} onClick={handleDisconnect}>
            断开连接
          </Button>
        </Space>
      </div>

      <div className="flex-1 bg-white rounded-lg shadow-sm overflow-hidden flex">
        <Splitter>
          <Splitter.Panel defaultSize="25%" min="15%" max="40%">
            <div className="h-full flex flex-col border-r border-gray-100">
              <div className="p-3 bg-gray-50 border-b border-gray-100 font-medium text-gray-600">
                Keys Explorer
              </div>
              <div className="flex-1 overflow-auto p-2">
                {treeData.length > 0 ? (
                  <DirectoryTree
                    treeData={treeData}
                    onSelect={handleSelect}
                    selectedKeys={selectedKeys}
                    expandAction="click"
                    icon={(props) => props.isLeaf ? <FileOutlined /> : <FolderOpenOutlined />}
                  />
                ) : (
                  <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无数据" />
                )}
              </div>
            </div>
          </Splitter.Panel>
          <Splitter.Panel>
            <div className="h-full flex flex-col">
              <div className="p-3 bg-gray-50 border-b border-gray-100 font-medium text-gray-600 flex justify-between">
                <span>Details</span>
                {selectedKeys.length > 0 && (
                   <span className="text-xs text-gray-400 font-normal">
                     Selected: {selectedKeys[0]}
                   </span>
                )}
              </div>
              <div className="flex-1 overflow-auto">
                 <Table 
                  dataSource={filteredTableData} 
                  columns={columns} 
                  rowKey="key" 
                  loading={loading}
                  pagination={{ pageSize: 20 }}
                  size="middle"
                />
              </div>
            </div>
          </Splitter.Panel>
        </Splitter>
      </div>

      <Modal
        title="添加/编辑键值对"
        open={isModalOpen}
        onOk={handleSave}
        onCancel={() => setIsModalOpen(false)}
        width={800}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="key" label="Key" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="value" label="Value" rules={[{ required: true }]}>
            <Input.TextArea rows={12} style={{ fontFamily: 'monospace' }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

const TextWithCopy = ({ text }: { text: string }) => {
  return (
    <div className="group flex items-center justify-between">
      <span className="truncate mr-2" title={text}>{text}</span>
      <CopyOutlined 
        className="opacity-0 group-hover:opacity-100 cursor-pointer text-gray-400 hover:text-blue-500"
        onClick={() => {
          navigator.clipboard.writeText(text);
          message.success('已复制');
        }} 
      />
    </div>
  );
}

export default KVBrowser;
