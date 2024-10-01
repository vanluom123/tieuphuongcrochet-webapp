'use client'

import React, { useEffect } from 'react';
import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { Button, Checkbox, Col, Flex, Form, Input, Row, Space } from 'antd';
import { useRouter } from 'next/navigation';
import { signIn, useSession } from "next-auth/react";
import Link from 'next/link';
import Image from 'next/image';

import { User } from '../lib/definitions';
import logo from '@/public/logo.png';
import { ROUTE_PATH, REGEX } from '../lib/constant';
import '../ui/components/login.scss';

const Login = () => {
    const [form] = Form.useForm();
    const router = useRouter();
    const { data: session } = useSession({ required: false });

    useEffect(() => {
        if (session?.user) {
            router.push(ROUTE_PATH.ADMIN);
        }
    }, [session, router]);

    const onFinish = async (values: User) => {
        const result = await signIn('credentials', {
            email: values.email,
            password: values.password,
            redirect: false,
        });

        if (result?.error) {
            // Handle error, e.g., show an error message
            console.error('Login failed:', result.error);
        } else {
            // Redirect to the admin page on successful login
            router.push(ROUTE_PATH.ADMIN);
        }
    };

    return (
        <div className='auth-page'>
            <Flex justify='center' className='logo'>
                <Link href={ROUTE_PATH.HOME} >
                    <Image src={logo} alt='Tiệm len Tiểu Phương' width={150} height={150}/>
                </Link>
            </Flex>
            <Flex
                className="header-title"
                justify='center'>
                <h3 className="title">Login</h3>
            </Flex>
            <Row >
                <Col xs={20} sm={18} md={10}>
                    <Form
                        form={form}
                        name="normal_login"
                        className="login-form layout-wrap"
                        initialValues={{ remember: true }}
                        onFinish={onFinish}
                    >
                        <Form.Item
                            name="email"
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
                            <Input
                                maxLength={100}
                                placeholder="Email"
                                autoComplete='email'
                                prefix={<MailOutlined className="site-form-item-icon" />}
                            />
                        </Form.Item>
                        <Form.Item
                            name="password"
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
                                autoComplete="new-password"
                                prefix={<LockOutlined className="site-form-item-icon" />}
                                placeholder="Password" />
                        </Form.Item>
                        <Form.Item>
                            <Form.Item name="remember" valuePropName="checked" noStyle>
                                <Checkbox>Remember me</Checkbox>
                            </Form.Item>

                            <Link className="login-form-forgot" href="#">
                                Forgot password
                            </Link>
                        </Form.Item>
                        <Form.Item name='actions' className='actions'>
                            <Space size='small'>
                                <Button
                                    type="primary"
                                    loading={false}
                                    htmlType="submit"
                                    className="login-form-button btn-border"
                                    disabled={false}
                                >
                                    Log in
                                </Button>
                                Or <Link href={ROUTE_PATH.REGISTER}>Register now!</Link>
                            </Space>
                        </Form.Item>
                    </Form>
                </Col>

            </Row>
        </div>
    );
};

export default Login;

