import React from 'react';
import { TableProps } from 'antd';
import { filter } from 'lodash';
import { ColumnsType } from 'antd/es/table';
import { useTranslations } from 'next-intl';
import { Button, Image, Space, Table } from 'antd';

import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { computePaging, getCurrentDate, showConfirmDelete } from '@/app/lib/utils';
import { DataType } from '@/app/lib/definitions';
import { IMAGE_FALLBACK } from '@/app/lib/constant';

interface DataTableProps extends TableProps<DataType> {
  pageSize?: number;
  pageIndex?: number;
  onEditRecord: (key: React.Key, record?: any) => void;
  onDeleteRecord: (key: React.Key) => void;
  customColumns?: ColumnsType<DataType>;
  isShowImage?: boolean;
  visiblePagination?: boolean;
  totalPageSize?: number;
  onPageChange?: (page: number, pageSize: number) => void;
  onShowSizeChange?: (current: number, size: number) => void;
  onTableChange?: (pagination: any, filters: any, sorter: any, extra: any) => void;
}

const DataTable = ({
  dataSource,
  customColumns,
  isShowImage,
  visiblePagination,
  totalPageSize,
  pageSize = 0,
  pageIndex = 0,
  onEditRecord,
  onDeleteRecord,
  onPageChange,
  onShowSizeChange,
  onTableChange,
  ...restProps
}: DataTableProps) => {

  const t = useTranslations('DataTable');

  const colNumberIndex = {
    title: '#',
    align: 'center',
    key: 'numberIndex',
    render: (_value: any, _row: any, index: number) => computePaging({ pageIndex, pageSize, currentIndex: index }),
    width: '80px',
  };

  const defaultColumns = [
    colNumberIndex,
    {
      title: t('name'),
      dataIndex: 'name',
    },
    {
      title: t('created_date'),
      dataIndex: 'createdDate',
      render: ((value: any) => (
        value ? getCurrentDate(value) : null
      ))
    },
    {
      title: t('action'),
      dataIndex: 'action',
      key: 'x',
      width: '110px',
      render: (_: any, record: DataType) =>
        dataSource && dataSource.length > 0 ?
          <>
            <Button
              style={{ marginRight: '10px' }}
              shape='circle'
              icon={<EditOutlined />}
              onClick={() => onEditRecord(record.key, record)}
            />
            <Button
              shape='circle'
              icon={<DeleteOutlined />}
              onClick={() => showConfirmDelete(record.key, () => onDeleteRecord(record.key))}
            />

          </> : null
    },
  ];

  const newColumns: any =
    customColumns ?
      [
        colNumberIndex,
        (isShowImage ?

          {
            title: t('image'),
            dataIndex: 'imgUrl',
            width: '120px',
            render: (_: any, rd: DataType) =>
              <Image
                width={88}
                src={rd.src}
                fallback={IMAGE_FALLBACK}
                alt={rd.name || 'image fallback'}
              />
          } : {}),
        {
          title: t('name'),
          dataIndex: 'name',
        },
        ...customColumns,
        {
          title: t('action'),
          dataIndex: 'action',
          key: 'x',
          width: '120px',
          render: (_: any, record: DataType) =>
            dataSource && dataSource.length > 0 ?
              <Space className='justify-center' size='small' wrap style={{ width: '100%' }}>
                <Button
                  shape='circle'
                  icon={<EditOutlined />}
                  onClick={() => onEditRecord(record.key)}
                />
                <Button
                  shape='circle'
                  icon={<DeleteOutlined />}
                  onClick={() => showConfirmDelete(record.key, () => onDeleteRecord(record.key))}
                />
              </Space> : null
        }] : [...defaultColumns];

  const paginationProps = visiblePagination ? {
    pageSizeOptions: [10, 20, 50],
    showSizeChanger: true,
    showQuickJumper: true,
    pageSize,
    ...(pageIndex !== - 1 ? { current: pageIndex + 1 } : {}), // if not use value = -1
    ...(totalPageSize !== -1 ? { total: totalPageSize } : {}),
    ...(onPageChange ? { onchange: onPageChange } : {}),
    ...(onShowSizeChange ? { onShowSizeChange } : {}),
    showTotal: (total: number, range: any) => `${range[0]}-${range[1]} of ${total} items`
  } : false;
	return (
		<Table
			bordered
			dataSource={dataSource}
			columns={filter(newColumns, col => Object.keys(col).length !== 0)}
			pagination={paginationProps}
			onChange={onTableChange}
			{...restProps}
    />
  );
};

export default DataTable;
