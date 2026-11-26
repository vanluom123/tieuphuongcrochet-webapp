import React, { memo, useEffect, useState } from 'react'
import { Alert, Button, Divider, Form, Input, Modal, Space } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { includes, map } from 'lodash'
import DataTable from '@/app/components/data-table'
import { BANNER_TYPES_DEFAULT } from '@/app/lib/constant'
import { DataType, IBannerType, TBannerType } from '@/app/lib/definitions'
import { createUpdateBannerType, deleteBannerType } from '@/app/lib/service/settingService'
import '../../ui/bannerTypes.scss'
import styles from './SettingPage.module.scss'

interface ModalForm {
  open: boolean
  id: string | number
  name?: TBannerType
}

interface TypeBannerModalProps {
  openCUModal: ModalForm
  setOpenCUModal: (value: ModalForm) => void
  onRefresh: () => void
}

const CUTypeModal = ({ openCUModal, setOpenCUModal, onRefresh }: TypeBannerModalProps) => {
  const [form] = Form.useForm()

  useEffect(() => {
    if (openCUModal.id) {
      const formData: IBannerType = {
        name: openCUModal.name || '',
      }
      form.setFieldsValue(formData)
    }
  }, [form, openCUModal.name, openCUModal.id])

  const onSubmit = () => {
    form
      .validateFields()
      .then(async (values: IBannerType) => {
        const sendData = openCUModal.id ? { ...values, id: openCUModal.id } : values
        await createUpdateBannerType(sendData)
        setOpenCUModal({ open: false, id: '' })
        form.resetFields()
        onRefresh()
      })
      .catch(() => {})
  }

  const onCancel = () => {
    setOpenCUModal({ open: false, id: '', name: '' })
    form.resetFields()
  }

  const validateName = (name: string) => {
    if (includes(BANNER_TYPES_DEFAULT, name)) {
      return Promise.resolve()
    }
    return Promise.reject(new Error('Vui lòng nhập tên thuộc một trong các tên bên trên!'))
  }

  return (
    <Modal
      title={openCUModal.id ? 'Cập nhật loại banner' : 'Tạo loại banner mới'}
      open={openCUModal.open}
      onOk={onSubmit}
      onCancel={onCancel}
      okText="Lưu"
      cancelText="Hủy"
    >
      <Space direction="vertical" style={{ width: '100%' }}>
        <Alert
          showIcon
          message="Vui lòng nhập tên thuộc một trong các tên bên dưới!"
          type="warning"
          description={
            <Space wrap>
              {map(BANNER_TYPES_DEFAULT, (b, index) => (
                <React.Fragment key={b}>
                  <span>{b}</span>
                  {index < BANNER_TYPES_DEFAULT.length - 1 ? <Divider type="vertical" /> : null}
                </React.Fragment>
              ))}
            </Space>
          }
        />
        <Form name="CUTypeForm" layout="vertical" form={form}>
          <Form.Item
            name="name"
            label="Tên loại banner"
            rules={[
              { required: true, message: 'Vui lòng nhập tên' },
              {
                validator: (_, value) => validateName(value),
              },
            ]}
          >
            <Input placeholder="Nhập tên loại banner" />
          </Form.Item>
        </Form>
      </Space>
    </Modal>
  )
}

interface BannerTypeProps {
  bannerTypes: DataType[]
  onRefresh: () => void
  loading: boolean
}

const BannerType = ({ bannerTypes, onRefresh, loading }: BannerTypeProps) => {
  const [openCUModal, setOpenCUModal] = useState<ModalForm>({ open: false, id: '' })

  const onDeleteRecord = async (id: string | number) => {
    await deleteBannerType(id as string)
    onRefresh()
  }

  const onEditRecord = (id: string | number, values: IBannerType) => {
    setOpenCUModal({ open: true, id, name: values.name })
  }

  return (
    <>
      <div>
        <div className={styles.toolbar}>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setOpenCUModal({ open: true, id: '' })}
          >
            Tạo loại banner
          </Button>
        </div>
        <DataTable
          loading={loading}
          dataSource={bannerTypes}
          onDeleteRecord={onDeleteRecord}
          onEditRecord={onEditRecord}
        />
      </div>
      {openCUModal.open ? (
        <CUTypeModal
          openCUModal={openCUModal}
          setOpenCUModal={setOpenCUModal}
          onRefresh={onRefresh}
        />
      ) : null}
    </>
  )
}

export default memo(BannerType)
