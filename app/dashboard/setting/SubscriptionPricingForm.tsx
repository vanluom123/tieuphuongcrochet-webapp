'use client'

import React, { useEffect, useState } from 'react'
import { Button, Col, Form, Input, Row, Spin } from 'antd'
import { fetchSettings, updateSetting } from '@/app/lib/service/settingService'
import styles from './SettingPage.module.scss'

const SubscriptionPricingForm: React.FC = () => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const loadSettings = async () => {
      setLoading(true)
      try {
        const settings = await fetchSettings()
        const monthly = settings?.find((s) => s.key === 'PAYMENT_MONTHLY_PRICE')?.value || '9.99'
        const yearly = settings?.find((s) => s.key === 'PAYMENT_YEARLY_PRICE')?.value || '99.99'
        form.setFieldsValue({
          PAYMENT_MONTHLY_PRICE: monthly,
          PAYMENT_YEARLY_PRICE: yearly,
        })
      } catch (error) {
        console.error('Failed to fetch settings:', error)
      } finally {
        setLoading(false)
      }
    }
    loadSettings()
  }, [form])

  const onFinish = async (values: {
    PAYMENT_MONTHLY_PRICE: string | number
    PAYMENT_YEARLY_PRICE: string | number
  }) => {
    setSubmitting(true)
    try {
      await updateSetting({
        key: 'PAYMENT_MONTHLY_PRICE',
        value: values.PAYMENT_MONTHLY_PRICE.toString(),
      })
      await updateSetting({
        key: 'PAYMENT_YEARLY_PRICE',
        value: values.PAYMENT_YEARLY_PRICE.toString(),
      })
    } catch (error) {
      console.error('Failed to update settings:', error)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Spin spinning={loading}>
      <Form form={form} layout="vertical" className={styles.pricingForm} onFinish={onFinish}>
        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              name="PAYMENT_MONTHLY_PRICE"
              label="Giá hàng tháng"
              rules={[{ required: true, message: 'Vui lòng nhập giá hàng tháng' }]}
            >
              <Input type="number" step="0.01" addonAfter="USD" placeholder="9.99" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              name="PAYMENT_YEARLY_PRICE"
              label="Giá hàng năm"
              rules={[{ required: true, message: 'Vui lòng nhập giá hàng năm' }]}
            >
              <Input type="number" step="0.01" addonAfter="USD" placeholder="99.99" />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={submitting}>
            Lưu cấu hình giá
          </Button>
        </Form.Item>
      </Form>
    </Spin>
  )
}

export default SubscriptionPricingForm
