import {Form, Input, Modal} from 'antd';
import {useTranslations} from 'next-intl';
import {Collection} from '@/app/lib/definitions';
import {useEffect, useState} from 'react';
import {createUpdateCollection, fetchCollectionDetail} from '@/app/lib/service/profileService';

const {Item} = Form;

interface CollectionFormModalProps {
    modalData: {
        open: boolean;
        id: string;
    };
    setModalData: (data: { open: boolean; id: string; }) => void;
}

const initialState = {
    loading: false,
    collection: {} as Collection
}

const CollectionFormModal = ({modalData, setModalData}: CollectionFormModalProps) => {
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
            setState(prevState => ({...prevState, loading: true}));

            fetchCollectionDetail(modalData.id).then(collection => {
                form.setFieldsValue(collection);
                setState(prevState => ({
                    ...prevState,
                    collection
                }));
            });
        }
    }, [modalData.id, modalData.open, form]);

    const onHandleCancel = () => {
        form.resetFields();
        setModalData({open: false, id: ''});
    }

    const onHandleOk = () => {
        form.submit();
    }

    const onSubmitForm = async (name: string) => {
        setState(prevState => ({...prevState, loading: true}));

        try {
            const res = await createUpdateCollection(name);
            if (res?.id) {
                form.resetFields();
                setModalData({open: false, id: ''});
            }
        } catch (error) {
            console.error('Error creating/updating collection:', error);
        } finally {
            setState(prevState => ({...prevState, loading: false}));
        }
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
            <Form
                form={form}
                layout="vertical"
                onFinish={onSubmitForm}
            >
                <Item
                    name="name"
                    label={t('collections.name')}
                    rules={[{required: true, message: t('collections.nameRequired')}]}
                >
                    <Input/>
                </Item>
            </Form>
        </Modal>
    );
};

export default CollectionFormModal;
