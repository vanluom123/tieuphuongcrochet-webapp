'use client'
import React from 'react';
import { Button, Col, Divider, Form, Input, notification, Row, Space } from 'antd';
import emailjs from '@emailjs/browser';
import SocialBox from '@/app/components/social-box';
import { REGEX, SOCIALS } from '@/app/lib/constant';
import { useTranslations } from 'next-intl';
import '../../ui/contact.scss';

const Contact = () => {
  const service_ID = 'service_7v8jlqr';
  const template_ID = 'template_usd1qy4';
  const public_KEY = 'FUxGmh_olTTCGh57P';
  const [form] = Form.useForm();

  const t = useTranslations("Contact");

  // Define a type for the form values
  interface ContactFormValues {
    name: string;
    email: string;
    subject: string;
    content: string;
  }

  const onSendEmail = (value: ContactFormValues) => {
    const templateParams = {
      from_name: value.name,
      from_email: value.email,
      message: value.content,
      subject: value.subject.toUpperCase()
    };

    emailjs
      .send(
        service_ID,
        template_ID,
        templateParams,
        public_KEY
      )
      .then(
        () => {
          notification.success({
            message: t('Form.success'),
            description: t('Form.success'),
          });

          // Clears the form after sending the email
          form.resetFields();
        },
        (error) => {
          notification.success({
            message: t('Form.error'),
            description: t('Form.error'),
          })
        }
      );
  };

  return (
    <Space direction='vertical' size={40} style={{ width: '100%' }}>
      <Row gutter={30} className="contact-page scroll-animate">
        <Col xs={24} md={12} className='animation-wrap'>
          <h1 className="content-title">
            {t('title')}
          </h1>
          <p className="content-text">
            {t('description')}
          </p>
        </Col>
        <Col xs={24} md={12}>
          <h2 className='align-center'>
            {t('Form.title')}
          </h2>
          <Form
            className='form-contact'
            name='contactForm'
            form={form}
            onFinish={onSendEmail}
          >
            <Form.Item name='name'
              rules={[
                {
                  required: true,
                  message: t('Form.input_name')
                }]}
            >
              <Input placeholder='Name' />
            </Form.Item>
            <Form.Item name='email'
              rules={[
                {
                  required: true,
                    message: t('Form.input_email')
                },
                {
                  pattern: new RegExp(REGEX.EMAIL),
                  message: t('Form.error_msg_incorrect_email')
                },
              ]}>
              <Input placeholder='Email' />
            </Form.Item>
            <Form.Item name='subject'
              rules={[
                {
                  required: true,
                  message: t('Form.input_title')
                }]}
            >
              <Input placeholder='Subject' />
            </Form.Item>
            <Form.Item name='content'
              rules={[
                {
                  required: true,
                  message: t('Form.input_content')
                }]}>
              <Input.TextArea rows={4} placeholder='Messages' />
            </Form.Item>
            <div className='align-center'>
              <Button className='btn-border' type='primary' htmlType='submit'>
                {t('Form.btn_send')}
              </Button>
            </div>
          </Form>
        </Col>
      </Row>
      <Divider>
        <h1 className='align-center'>
          {t('Form.via')}
        </h1>
      </Divider>
      <Row className='justify-center' gutter={[{ xs: 36, md: 16, lg: 48 }, { xs: 36, md: 16, lg: 48 }]}>
        {(SOCIALS || []).map(({ social, src, url, ...rest }, index) =>
          <Col key={`social_${index}`} xs={12} md={6}>
            <SocialBox social={social} src={src} url={url} {...rest} />
          </Col>
        )}
      </Row>
    </Space>
  );
};

export default Contact;
