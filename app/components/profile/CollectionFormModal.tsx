import { Form, Input, Modal } from 'antd';
import { useTranslations } from 'next-intl';
import { Collection } from '@/app/lib/definitions';
import { useEffect, useState } from 'react';
import { createCollection, fetchCollectionDetail, updateCollection } from '@/app/lib/service/profileService';
import { notification } from '@/app/lib/notify';

const { Item } = Form;

interface CollectionFormModalProps {
    modalData: {
        open: boolean;
        id: string;
    };
    setModalData: (data: { open: boolean; id: string; }) => void;
    onRefreshData: () => void;
}

const initialState = {
    loading: false,
    collection: {} as Collection
}

const CollectionFormModal = ({ modalData, setModalData, onRefreshData }: CollectionFormModalProps) => {
    const [form] = Form.useForm();
    const t = useTranslations('Profile');
    const [state, setState] = useState(initialState);

    useEffect(() => {
        if (!modalData.open) {
            form.resetFields();
            setState(initialState);
        }
    }, [modalData.open, form]);

    useEffect(() => {
        if (modalData.id && modalData.open) {
            setState(prev => ({ ...prev, loading: true }));
            fetchCollectionDetail(modalData.id)
                .then(collection => {
                    form.setFieldsValue(collection);
                    setState(prev => ({ ...prev, collection: collection }));
                }).finally(() => setState(prev => ({ ...prev, loading: false })));
        }
    }, [modalData.id, modalData.open, form]);

    const onHandleCancel = () => {
        form.resetFields();
        setModalData({ open: false, id: '' });
    }

    const onHandleOk = () => {
        form.submit();
    }

    const onSubmitForm = async (name: string) => {
        setState(prev => ({ ...prev, loading: true }));
        const res = modalData.id
            ? await updateCollection(modalData.id, name)
            : await createCollection(name);

        form.resetFields();
        setModalData({ open: false, id: '' });
        notification[res.success ? 'success' : 'error']({
            message: res.success ? 'Success' : 'Failed',
            description: res.message
        });

        if (res.success) {
            onRefreshData();
        }

        setState(prev => ({ ...prev, loading: false }));
    }

    return (
        <Modal
            title={t('collections.add')}
            centered
            open={modalData.open}
            onOk={onHandleOk}
            onCancel={onHandleCancel}
            destroyOnClose={true}
            confirmLoading={state.loading}
        >
            <Form form={form} onFinish={({ name }) => onSubmitForm(name)}>
                <Item
                    name="name"
                    rules={[{ required: true, message: 'Please input collection name!' }]}
                >
                    <Input placeholder={t('collections.name')} />
                </Item>
            </Form>
        </Modal>
    );
};

export default CollectionFormModal;
