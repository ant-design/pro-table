import { render } from 'enzyme';
import React from 'react';
import { Button, Input } from 'antd';
import ProTable, { TableDropdown } from '../../src/index';
import { columns, request } from './demo';

describe('BasicTable', () => {
  it('🎏 base use', () => {
    const html = render(
      <ProTable
        size="small"
        columns={columns}
        request={request}
        rowKey="key"
        params={{ keyword: 'test' }}
        pagination={{
          defaultCurrent: 10,
        }}
        toolBarRender={action => [
          <Input.Search
            style={{
              width: 200,
            }}
          />,
          <Button
            onClick={() => {
              action.reload();
            }}
            key="1"
            type="primary"
            style={{
              marginRight: 8,
            }}
          >
            刷新
          </Button>,
          <Button
            key="2"
            style={{
              marginRight: 8,
            }}
            onClick={() => {
              action.setCurrent(3);
            }}
            type="dashed"
          >
            跳转到第三页
          </Button>,
          <Button
            key="3"
            onClick={() => {
              action.resetPageIndex();
            }}
            type="default"
            style={{
              marginRight: 8,
            }}
          >
            重置
          </Button>,
          <TableDropdown.Button
            menus={[{ key: 'copy', name: '复制' }, { key: 'clear', name: '清空' }]}
          >
            更多操作
          </TableDropdown.Button>,
        ]}
      />,
    );
    expect(html).toMatchSnapshot();
  });

  it('🎏 do not render Search ', () => {
    const html = render(
      <ProTable
        size="small"
        columns={columns}
        request={request}
        rowKey="key"
        search={false}
        params={{ keyword: 'test' }}
        pagination={{
          defaultCurrent: 10,
        }}
      />,
    );
    expect(html).toMatchSnapshot();
  });

  it('🎏  do not render default option', () => {
    const html = render(
      <ProTable
        size="small"
        options={{
          fullScreen: false,
          reload: false,
          setting: false,
        }}
        columns={[
          {
            dataIndex: 'money',
            valueType: 'money',
          },
        ]}
        request={request}
        rowKey="key"
      />,
    );
    expect(html).toMatchSnapshot();
  });

  it('🎏  do not render setting', () => {
    const html = render(
      <ProTable
        size="small"
        options={{
          fullScreen: true,
          reload: true,
          setting: false,
        }}
        columns={[
          {
            dataIndex: 'money',
            valueType: 'money',
          },
        ]}
        request={request}
        rowKey="key"
      />,
    );
    expect(html).toMatchSnapshot();
  });
});
