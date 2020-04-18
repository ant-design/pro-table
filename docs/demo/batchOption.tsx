import React from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Tag } from 'antd';
import ProTable, { ProColumns, TableDropdown } from '@ant-design/pro-table';
import request from 'umi-request';

interface GithubIssueItem {
  url: string;
  repository_url: string;
  labels_url: string;
  comments_url: string;
  events_url: string;
  html_url: string;
  id: number;
  node_id: string;
  number: number;
  title: string;
  user: User;
  labels: Label[];
  state: string;
  locked: boolean;
  assignee?: any;
  assignees: any[];
  milestone?: any;
  comments: number;
  created_at: string;
  updated_at: string;
  closed_at?: any;
  author_association: string;
  body: string;
}

interface Label {
  id: number;
  node_id: string;
  url: string;
  name: string;
  color: string;
  default: boolean;
  description: string;
}

interface User {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: string;
  site_admin: boolean;
}

const columns: ProColumns<GithubIssueItem>[] = [
  {
    title: '标题',
    dataIndex: 'title',
    copyable: true,
    ellipsis: true,
    width: 200,
    hideInSearch: true,
  },
  {
    title: '状态',
    dataIndex: 'state',
    initialValue: 'all',
    valueEnum: {
      all: { text: '全部', status: 'Default' },
      open: {
        text: '未解决',
        status: 'Error',
      },
      closed: {
        text: '已解决',
        status: 'Success',
      },
    },
  },
  {
    title: '标签',
    dataIndex: 'labels',
    width: 120,
    render: (_, row) =>
      row.labels.map(({ name, id, color }) => (
        <Tag
          color={`#${color}`}
          key={id}
          style={{
            margin: 4,
          }}
        >
          {name}
        </Tag>
      )),
  },
  {
    title: '创建时间',
    key: 'since',
    dataIndex: 'created_at',
    valueType: 'dateTime',
  },

  {
    title: 'option',
    valueType: 'option',
    dataIndex: 'id',
    render: (text, row) => [
      <a key="1" href={row.html_url} target="_blank" rel="noopener noreferrer">
        查看
      </a>,
      <TableDropdown
        key="2"
        onSelect={(key) => window.alert(key)}
        menus={[
          { key: 'copy', name: '复制' },
          { key: 'delete', name: '删除' },
        ]}
      />,
    ],
  },
];

export default () => (
  <ProTable<GithubIssueItem>
    columns={columns}
    request={async (params = {}) => {
      const data = await request<GithubIssueItem[]>(
        'https://api.github.com/repos/ant-design/ant-design-pro/issues',
        {
          params: {
            ...params,
            page: params.current,
            per_page: params.pageSize,
          },
        },
      );
      const totalObj = await request(
        'https://api.github.com/repos/ant-design/ant-design-pro/issues?per_page=1',
        {
          params,
        },
      );
      return {
        data,
        page: params.current,
        success: true,
        total: ((totalObj[0] || { number: 0 }).number - 56) as number,
      };
    }}
    rowKey="id"
    rowSelection={{}}
    tableAlertRender={({ selectedRowKeys, selectedRows }) =>
      `当前共选中${selectedRowKeys.length} 项，共有 ${selectedRows.reduce((pre, item) => {
        if (item.state === 'open') {
          return pre + 1;
        }
        return pre;
      }, 0)} 项未解决 `
    }
    tableAlertOptionRender={(props) => {
      const { onCleanSelected } = props;
      return [
        <a
          style={{
            marginRight: 8,
          }}
        >
          自定义
        </a>,
        <a onClick={onCleanSelected}>清空</a>,
      ];
    }}
    dateFormatter="string"
    headerTitle="批量操作"
    toolBarRender={(_, { selectedRowKeys }) => [
      <Button key="3" type="primary">
        <PlusOutlined />
        新建
      </Button>,
      selectedRowKeys && selectedRowKeys.length && (
        <Button
          key="3"
          onClick={() => {
            window.alert(selectedRowKeys.join('-'));
          }}
        >
          批量删除
        </Button>
      ),
    ]}
  />
);
