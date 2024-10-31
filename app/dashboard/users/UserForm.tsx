'use client';

import { Button, Col, Flex, Form, Input, Row, TreeSelect } from 'antd';

import { User } from '@/app/lib/definitions';
import { useEffect, useState } from 'react';
import { cloneDeep } from 'lodash';
import { ROUTE_PATH } from '@/app/lib/constant';
import { useRouter } from 'next/navigation';
import { fetchUserDetail, updateUser } from '@/app/lib/service/userService';

interface UserFormProps {
    params?: {
        id: string
    }
}
const UserForm = ({ params }: UserFormProps) => {
    const [form] = Form.useForm();
    const { Item } = Form;
    const router = useRouter();

    const [state, setState] = useState({
        loading: false,
        user: {} as User,
    })

    useEffect(() => {
        if (params?.id) {
            setState(prevState => ({ ...prevState, loading: true }));
            fetchUserDetail(params.id).then((user) => {
                if (user && user.email) {
                    const tempData = cloneDeep(user);
                    const newUser = {
                        ...tempData,
                    };
                    form.setFieldsValue(newUser);
                    setState(prevState => ({ ...prevState, user: newUser }));
                }
            }).finally(() => {
                setState(prevState => ({ ...prevState, loading: false }));
            });
        }
    }, [params?.id]);

    const onSubmitForm = (values: User) => {
        let sendData = { ...values }
        if (params?.id) {
            sendData = {
                ...sendData,
                id: params.id
            }
        }
        const callback = () => {
            form.resetFields();
            router.push(ROUTE_PATH.DASHBOARD_USERS);
        };
        if (params?.id) {
            updateUser(params.id, sendData).then(callback);
        }
    }

    const onCancel = () => {
        form.resetFields();
        router.back();
    }

    const roleTreeData = [
        {
            title: 'Admin',
            value: 'ADMIN',
        },
        {
            title: 'User',
            value: 'USER',
        },
    ];

    return (
        <div>
            <Flex justify="center">
                <h1>{params?.id ? 'Update the user' : 'Create a new user'}</h1>
            </Flex>
            <Form layout="vertical"
                name='CUserForm'
                form={form}
                onFinish={onSubmitForm}
                className="form-wrap"
            >
                <Row gutter={48}>
                    <Col xs={20} md={12}>
                        <Item
                            name="name"
                            label="Name:"
                            rules={[{ required: true, message: 'Please enter name' }]}
                        >
                            <Input placeholder="Enter name" />
                        </Item>
                    </Col>
                    <Col xs={20} md={12}>
                        <Row gutter={24}>
                            <Col span={12}>
                                <Item
                                    name="role"
                                    label="Role:"
                                    rules={[{ required: true, message: 'Please enter the role' }]}
                                >
                                    <TreeSelect
                                        placeholder="Select a role"
                                        treeData={roleTreeData}
                                    />
                                </Item>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Flex justify='center' gap={24}>
                    <Button className="btn-form" type="primary" htmlType="submit">
                        Submit
                    </Button>
                    <Button className="btn-form" onClick={onCancel}>Cancel</Button>
                </Flex>
            </Form>
        </div>
    );
};

export default UserForm;