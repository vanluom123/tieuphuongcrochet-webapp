'use client'

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { Form, Input, Button, Row, Col, Flex } from 'antd';
import { useRouter } from "next/navigation";
import Image from "next/image";

import logo from '@/public/logo.png';
import { User } from "../lib/definitions";
import Link from "next/link";
import { ROUTE_PATH, REGEX, API_ROUTES } from "../lib/constant";
import apiService from "../lib/service/apiService";
import '../ui/components/register.scss';

const RegisterPage = () => {

    const [isDisable, setIsDisable] = useState(false);
    const [form] = Form.useForm();
    const router = useRouter();
    const t = useTranslations('Register');

    const onCancel = () => {
        router.push(ROUTE_PATH.LOGIN);
    }

    const onSubmitRegister = async (values: User) => {
        console.log("values", values);
        setIsDisable(true);
        const res = await apiService({
            baseUrl: process.env.NEXT_PUBLIC_API_URL,
            endpoint: API_ROUTES.SIGNUP,
            method: 'POST',
            data: values,
        }).catch((error) => {
            console.log("error", error);
            setIsDisable(false);
            return;
        });

        if (res == null) {
            setIsDisable(false);
            return;
        }

        router.push(ROUTE_PATH.LOGIN);
    }

    return (
        <div className="register-container">
            <div className="auth-page">
                <Flex vertical align="center" className="auth-content">
                    <Flex justify='center' className='logo'>
                        <Link href={ROUTE_PATH.HOME} >
                            <Image src={logo} alt='Tiểu Phương Crochet' width={150} height={150} priority/>
                        </Link>
                    </Flex>
                    <Flex vertical className="header-title" align="center">
                        <h2 className="title">{t('title')}  </h2>
                        <h3>{t('account_exist')} <Link href={ROUTE_PATH.LOGIN}>{t('btn_sign_in')}</Link></h3>
                    </Flex>
                    <Row justify="center" style={{ width: '100%' }}>
                        <Col xs={24} sm={22} md={20} lg={18} xl={16}>
                            <Form
                                form={form}
                                name="register"
                                layout="vertical"
                                autoComplete="off"
                                onFinish={onSubmitRegister}
                            >
                                <Form.Item
                                    label={t('input_fullname')}
                                    name="name"
                                    rules={[
                                        {
                                            required: true,
                                            message: t('error_msg_required_fullname')
                                        },
                                    ]}
                                >
                                    <Input
                                        maxLength={100}
                                        placeholder={t('input_fullname')}
                                    />
                                </Form.Item>
                                <Form.Item
                                    name="email"
                                    label={t('input_email')}
                                    rules={[
                                        {
                                            required: true,
                                            message: t('error_msg_required_email')
                                        },
                                        {
                                            pattern: new RegExp(REGEX.EMAIL),
                                            message: t('error_msg_incorrect_email'),
                                        },
                                    ]}
                                >
                                    <Input maxLength={100} placeholder={t('input_email')} />
                                </Form.Item>
                                <Form.Item
                                    name="password"
                                    label={t('input_password')}
                                    rules={[
                                        {
                                            required: true,
                                                message: t('error_msg_required_password')
                                        },
                                        {
                                            pattern: new RegExp(REGEX.PASSWORD),
                                            message: t('error_msg_incorrect_password'),
                                        },
                                    ]}
                                >
                                    <Input.Password
                                        placeholder={t('input_password')}
                                        autoComplete="current-password"
                                    />
                                </Form.Item>
                                <Form.Item
                                    name="rePassword"
                                    label={t('input_confirm_password')}
                                    rules={[
                                        {
                                            required: true,
                                            message: t('error_msg_required_confirm_password')
                                        },
                                        {
                                            validator: async (_, value) => {
                                                if (!value || form.getFieldValue('password') === value) {
                                                    return Promise.resolve();
                                                }
                                                    throw new Error(t('error_msg_not_match_confirm_password'))
                                            }
                                        },
                                    ]}
                                >
                                    <Input.Password autoComplete="current-password" />
                                </Form.Item>
                                <div className="note">
                                    <p>
                                        <strong>{t('note_title')}:</strong>
                                    </p>
                                    <div>
                                        <p>- <span style={{ color: '#ff4d4f' }}>(*)</span>: {t('note_content_1')}</p>
                                        <p>- {t('note_content_2')}</p>
                                    </div>
                                </div>
                                <div>
                                    <Button className='btn-border' type="primary" htmlType="submit" style={{ width: '100%', marginBottom: 8 }} disabled={isDisable}>
                                                {t('btn_register')}
                                    </Button>
                                    <Button className='btn-border' type="default" style={{ width: '100%' }} onClick={() => onCancel()} disabled={isDisable}>
                                        {t('btn_cancel')}
                                    </Button>
                                </div>
                            </Form>
                        </Col>
                    </Row>
                </Flex>
            </div>
        </div>
    )
}

export default RegisterPage;