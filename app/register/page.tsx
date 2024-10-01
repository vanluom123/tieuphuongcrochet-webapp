'use client'

import React, { useState } from "react";

import { Form, Input, Button, Row, Col, Flex } from 'antd';
import logo from '@/public/logo.png';
import { User } from "../lib/definitions";
import Link from "next/link";
import { ROUTE_PATH, REGEX, API_ROUTES } from "../lib/constant";
import Image from "next/image";
import fetchData from "../api/fetchData";
import { useRouter } from "next/navigation";
import '../ui/components/register.scss';

const RegisterPage = () => {

    const [isDisable, setIsDisable] = useState(false);
    const [form] = Form.useForm();
    const router = useRouter();

    const onCancel = () => {
        router.push(ROUTE_PATH.LOGIN);
    }

    const onSubmitRegister = async (values: User) => {
        console.log("values", values);
        setIsDisable(true);
        const res = await fetchData({
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
                            <Image src={logo} alt='Tiệm len Tiểu Phương' width={150} height={150} />
                        </Link>
                    </Flex>
                    <Flex vertical className="header-title" align="center">
                        <h2 className="title">Register account</h2>
                        <h3>Đã có tài khoản? <Link href={ROUTE_PATH.LOGIN}>Sign in!</Link></h3>
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
                                    label='Full name'
                                    name="name"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please input your fullname'
                                        },
                                    ]}
                                >
                                    <Input
                                        maxLength={100}
                                        placeholder="Fullname"
                                    />
                                </Form.Item>
                                <Form.Item
                                    name="email"
                                    label='Email'
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please input your email'
                                        },
                                        {
                                            pattern: new RegExp(REGEX.EMAIL),
                                            message: 'Please input format email',
                                        },
                                    ]}
                                >
                                    <Input maxLength={100} placeholder="Email" />
                                </Form.Item>
                                <Form.Item
                                    name="password"
                                    label='Password'
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please input your password'
                                        },
                                        {
                                            pattern: new RegExp(REGEX.PASSWORD),
                                            message: 'Format password incorrect',
                                        },
                                    ]}
                                >
                                    <Input.Password
                                        placeholder="Password"
                                        autoComplete="current-password"
                                    />
                                </Form.Item>
                                <Form.Item
                                    name="rePassword"
                                    label='Re-password'
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please input your pagssword again'
                                        },
                                        {
                                            validator: async (_, value) => {
                                                if (!value || form.getFieldValue('password') === value) {
                                                    return Promise.resolve();
                                                }
                                                throw new Error('Do not match password above')
                                            }
                                        },
                                    ]}
                                >
                                    <Input.Password autoComplete="current-password" />
                                </Form.Item>
                                <div className="note">
                                    <p>
                                        <strong>Note:</strong>
                                    </p>
                                    <div>
                                        <p>- <span style={{ color: '#ff4d4f' }}>(*)</span>: required field</p>
                                        <p>- Password must contain at least 8 characters, including at least 1 uppercase letter, 1 special character, lowercase letter and number.</p>
                                    </div>
                                </div>
                                <div>
                                    <Button className='btn-border' type="primary" htmlType="submit" style={{ width: '100%', marginBottom: 8 }} disabled={isDisable}>
                                        Submit
                                    </Button>
                                    <Button className='btn-border' type="default" style={{ width: '100%' }} onClick={() => onCancel()} disabled={isDisable}>
                                        Cancel
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