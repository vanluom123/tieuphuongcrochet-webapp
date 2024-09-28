'use client'

import React from 'react';
import { Button, Col, Form, Input, Row, Space } from 'antd';
import emailjs from '@emailjs/browser';


import { notification } from '../lib/notify';
import { REGEX } from '../lib/constant';

const Contact = () => {
    const service_ID = 'service_7v8jlqr';
    const template_ID = 'template_usd1qy4';
    const public_KEY = 'FUxGmh_olTTCGh57P';
    const [form] = Form.useForm();

    // const onSendEmail = (value: any) => {
    //     const templateParams = {
    //         from_name: value.name,
    //         from_email: value.email,
    //         message: value.content,
    //         subject: ((value.subject) as string).toUpperCase()
    //     };

    //     emailjs
    //         .send(
    //             service_ID,
    //             template_ID,
    //             templateParams,
    //             public_KEY
    //         )
    //         .then(
    //             () => {
    //                 notification.success({
    //                     message: <FormattedMessage id='notification.success' />,
    //                     description: <FormattedMessage id='contact_form.success' />,
    //                 });

    //                 // Clears the form after sending the email
    //                 form.resetFields();
    //             },
    //             (error) => {
    //                 console.log('error send contact mail', error);
    //                 notification.success({
    //                     message: <FormattedMessage id='notification.error' />,
    //                     description: <FormattedMessage id='contact_form.error' />,
    //                 })
    //             }
    //         );
    // };

    return (
        <Space direction='vertical' size={40} style={{ width: '100%' }}>
            Contact page
            {/* <Row gutter={30} className="contact-page scroll-animate">
                <Col xs={24} md={12} className='animation-wrap'>
                    <h1 className="content-title">
                        <FormattedMessage id='contact_title' />
                    </h1>
                    <p className="content-text">
                        <FormattedMessage id='contact_content' />
                    </p>
                </Col>
                <Col xs={24} md={12}>
                    <h2 className='align-center'>
                        <FormattedMessage id='contact_form_title' />
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
                                    message: <FormattedMessage id='placeholder_input_name' />
                                }]}
                        >
                            <Input placeholder='Name' />
                        </Form.Item>
                        <Form.Item name='email'
                            rules={[
                                {
                                    required: true,
                                    message: <FormattedMessage id='placeholder_input_email' />
                                },
                                {
                                    pattern: new RegExp(REGEX.EMAIL),
                                    message: <FormattedMessage id='error_msg_incorrect_email' />
                                },
                            ]}>
                            <Input placeholder='Email' />
                        </Form.Item>
                        <Form.Item name='subject'
                            rules={[
                                {
                                    required: true,
                                    message: <FormattedMessage id='placeholder_input_title' />
                                }]}
                        >
                            <Input placeholder='Subject' />
                        </Form.Item>
                        <Form.Item name='content'
                            rules={[
                                {
                                    required: true,
                                    message: <FormattedMessage id='placeholder_input_content' />
                                }]}>
                            <Input.TextArea rows={4} placeholder='Messages' />
                        </Form.Item>
                        <div className='align-center'>
                            <Button className='btn-border' type='primary' htmlType='submit'>
                                <FormattedMessage id='btn_send' />
                            </Button>
                        </div>
                    </Form>
                </Col>
            </Row> */}
            {/* <Divider children={
                <h1 className='align-center'>
                    <FormattedMessage id='contact_via' />
                </h1>} /> */}
            <Row className='justify-center' gutter={[{ xs: 36, md: 16, lg: 48 }, { xs: 36, md: 16, lg: 48 }]}>
                {/* {(SOCIALS || []).map(({ social, src, url, ...rest }, index) =>
                    <Col key={`social_${index}`} xs={12} md={6}>
                        <SocialBox social={social} src={src} url={url} {...rest} />
                    </Col>
                )} */}
            </Row>
        </Space>
    );
};

export default Contact;
