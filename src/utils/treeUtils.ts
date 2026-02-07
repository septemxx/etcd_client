import { DataNode } from 'antd/es/tree';
import { KeyValue } from '../types';

interface TreeNode extends DataNode {
  children?: TreeNode[];
  isLeaf?: boolean;
  fullPath: string;
  data?: KeyValue;
}

export const buildTree = (items: KeyValue[]): TreeNode[] => {
  const root: TreeNode[] = [];
  const map: Record<string, TreeNode> = {};

  items.forEach((item) => {
    const parts = item.key.split('/').filter(p => p); // Remove empty parts from leading/trailing slashes
    let currentPath = '';

    // Handle root-level keys or keys starting with /
    const hasLeadingSlash = item.key.startsWith('/');
    
    parts.forEach((part, index) => {
      const isLast = index === parts.length - 1;
      const parentPath = currentPath;
      currentPath = currentPath ? `${currentPath}/${part}` : (hasLeadingSlash ? `/${part}` : part);
      
      if (!map[currentPath]) {
        const node: TreeNode = {
          key: currentPath,
          title: part,
          fullPath: currentPath,
          isLeaf: false,
          children: [],
        };

        map[currentPath] = node;

        if (index === 0) {
          root.push(node);
        } else {
          const parent = map[parentPath];
          if (parent) {
            parent.children = parent.children || [];
            // Check if child already exists (shouldn't if map logic is correct, but safe guard)
            if (!parent.children.find(c => c.key === node.key)) {
              parent.children.push(node);
            }
          }
        }
      }

      if (isLast) {
        map[currentPath].isLeaf = true;
        map[currentPath].data = item;
      }
    });
  });

  return root;
};
