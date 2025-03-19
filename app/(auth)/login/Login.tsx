// 'use client'

// import React, { useEffect, useState } from 'react';
// import { LockOutlined, MailOutlined, GoogleOutlined } from '@ant-design/icons';
// import { Button, Checkbox, Flex, Form, Input, Row, Spin } from 'antd';
// import { useRouter } from 'next/navigation';
// import { signIn, useSession } from "next-auth/react";
// import Link from 'next/link';
// import { useTranslations } from 'next-intl';

// import { User } from '@/app/lib/definitions';
// import { ROUTE_PATH, REGEX } from '@/app/lib/constant';
// import { notification } from '@/app/lib/notify';
// import '../../ui/components/login.scss';
// import ResendVerificationModal from '@/app/components/login/ResendVerificationModal';

// const Login = () => {
//     const [form] = Form.useForm();
//     const router = useRouter();
//     const { data: session, status } = useSession({ required: false });
//     const t = useTranslations('Login');

//     const [isLoading, setIsLoading] = useState(false);
//     const [isResendModalVisible, setIsResendModalVisible] = useState(false);

//     useEffect(() => {
//         if (session?.user?.email && status === 'authenticated') {
//             router.push(ROUTE_PATH.DASHBOARD);
//         }
//     }, [session, router, status]);

//     const onFinish = async (values: User) => {
//         setIsLoading(true);
//         try {
//             const result = await signIn('credentials', {
//                 email: values.email,
//                 password: values.password,
//                 redirect: false,
//             });
//             // Handle successful login
//             if (result?.error) {
//                 const description = result.status === 401 ? t('error_login_401_description') : result.error;
//                 notification.error({ message: t('error_login_title'), description });
//             }
//             setIsLoading(false);
//         } catch (error) {
//             if (error instanceof Error) {
//                 notification.error({ message: t('error_login_title'), description: error.message });
//             } else {
//                 notification.error({ message: t('error_login_title'), description: t('error_login_unknown_error') });
//             }
//             setIsLoading(false);
//         }
//     };

//     return (
//         <div className='auth-page login-page'>
//             <div className="login-form-container">
//                 <Flex justify='center' className='logo'>
//                     <Link href={ROUTE_PATH.HOME}>
//                         <span className="site-logo">-Logo</span>
//                     </Link>
//                 </Flex>
                
//                 <Flex className="header-title" justify='center'>
//                     <h3 className="title">{t('title')}</h3>
//                 </Flex>
                
//                 <Spin spinning={isLoading}>
//                     <Form
//                         form={form}
//                         name="normal_login"
//                         className="login-form"
//                         initialValues={{ remember: true }}
//                         onFinish={onFinish}
//                         disabled={isLoading}
//                     >
//                         <Form.Item
//                             name="email"
//                             rules={[
//                                 { required: true, message: t('error_msg_required_email') },
//                                 { pattern: new RegExp(REGEX.EMAIL), message: t('error_msg_incorrect_email') },
//                             ]}
//                         >
//                             <Input
//                                 maxLength={100}
//                                 placeholder={t('input_email')}
//                                 autoComplete='email'
//                                 prefix={<MailOutlined className="site-form-item-icon" />}
//                                 suffix={<Button type="text" icon={<span className="red-dot" />} />}
//                             />
//                         </Form.Item>
                        
//                         <Form.Item
//                             name="password"
//                             rules={[
//                                 { required: true, message: t('error_msg_required_password') },
//                                 { pattern: new RegExp(REGEX.PASSWORD), message: t('error_msg_incorrect_password') },
//                             ]}
//                         >
//                             <Input.Password
//                                 autoComplete="new-password"
//                                 prefix={<LockOutlined className="site-form-item-icon" />}
//                                 placeholder={t('input_password')}
//                                 suffix={<Button type="text" icon={<span className="red-dot" />} />}
//                             />
//                         </Form.Item>
                        
//                         <Form.Item>
//                             <Row justify="space-between" align="middle">
//                                 <Form.Item name="remember" valuePropName="checked" noStyle>
//                                     <Checkbox>{t('remember_me')}</Checkbox>
//                                 </Form.Item>
//                                 <Link className="login-form-forgot" href="#">
//                                     {t('forgot_password')}
//                                 </Link>
//                             </Row>
//                         </Form.Item>
                        
//                         <Form.Item>
//                             <Button 
//                                 type="primary" 
//                                 htmlType="submit" 
//                                 className="login-form-button" 
//                                 block
//                             >
//                                 {t('btn_login')}
//                             </Button>
//                         </Form.Item>
                        
//                         <div className="alternative-options">
//                             <div className="register-option">
//                                 Hoặc <Link href={ROUTE_PATH.REGISTER}>{t('btn_register')}</Link>
//                             </div>
                            
//                             <div className="resend-email-option">
//                                 <Button
//                                     type="link"
//                                     className="resend-verification-link"
//                                     onClick={() => setIsResendModalVisible(true)}
//                                 >
//                                     {t('resend_verification_email')}
//                                 </Button>
//                             </div>
//                         </div>
                        
//                         <div className="social-login">
//                             <Link
//                                 href={`${process.env.NEXT_PUBLIC_API_URL}/oauth2/authorize/google?redirect_uri=${process.env.NEXT_PUBLIC_URL}/oauth2/redirect`}
//                                 className="google-login-button"
//                             >
//                                 <Button
//                                     block
//                                     icon={<GoogleOutlined />}
//                                     size="large"
//                                     className="btn-google"
//                                 >
//                                     {t('btn_google_login')}
//                                 </Button>
//                             </Link>
//                         </div>
//                     </Form>
//                 </Spin>
                
//                 <ResendVerificationModal
//                     isOpen={isResendModalVisible}
//                     onCancel={() => setIsResendModalVisible(false)}
//                 />
//             </div>
//         </div>
//     );
// };

// export default Login;

