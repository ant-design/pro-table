import React, { useRef, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Drawer, Tag } from 'antd';
import ProTable, {
  ProColumns,
  TableDropdown,
  IntlProvider,
  viVNIntl,
  ActionType,
} from '@ant-design/pro-table';
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
    title: 'STT',
    dataIndex: 'index',
    valueType: 'indexBorder',
    width: 72,
  },
  {
    title: 'Tiêu đề',
    dataIndex: 'title',
    copyable: true,
    ellipsis: true,
    width: 200,
    hideInSearch: true,
  },
  {
    title: 'Trạng thái',
    dataIndex: 'state',
    initialValue: 'all',
    valueEnum: {
      all: { text: 'ALL', status: 'Default' },
      open: {
        text: 'Error',
        status: 'Error',
      },
      closed: {
        text: 'Success',
        status: 'Success',
      },
    },
  },
  {
    title: 'Nhãn',
    dataIndex: 'labels',
    width: 80,
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
    title: 'Thời gian tạo',
    key: 'since',
    dataIndex: 'created_at',
    valueType: 'dateTime',
  },
  {
    title: 'Thao tác',
    valueType: 'option',
    dataIndex: 'id',
    render: (text, row, _, action) => [
      <a href={row.html_url} target="_blank" rel="noopener noreferrer">
        xem
      </a>,
      <TableDropdown
        onSelect={() => action.reload()}
        menus={[
          { key: 'copy', name: 'sao chép' },
          { key: 'delete', name: 'xóa' },
        ]}
      />,
    ],
  },
];

export default () => {
  const actionRef = useRef<ActionType>();
  const [visible, setVisible] = useState(false);
  return (
    <>
      <Drawer onClose={() => setVisible(false)} visible={visible}>
        <Button
          style={{
            margin: 8,
          }}
          onClick={() => {
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }}
        >
          tải lại
        </Button>
        <Button
          onClick={() => {
            if (actionRef.current) {
              actionRef.current.reset();
            }
          }}
        >
          làm lại
        </Button>
      </Drawer>
      <IntlProvider value={viVNIntl}>
        <ProTable<GithubIssueItem>
          columns={columns}
          actionRef={actionRef}
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
          pagination={{
            showSizeChanger: true,
          }}
          tableAlertRender={({ selectedRowKeys }) => `selected ${selectedRowKeys.length} rows`}
          dateFormatter="string"
          headerTitle="Basic Table"
          toolBarRender={() => [
            <Button key="3" type="primary" onClick={() => setVisible(true)}>
              <PlusOutlined />
              Thêm mới
            </Button>,
          ]}
        />
      </IntlProvider>
    </>
  );
};
