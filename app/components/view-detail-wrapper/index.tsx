import { Alert, Space, Spin } from "antd"

interface ViewDetailWrapperProps {
    children: React.ReactNode;
    loading: boolean;
    alertMessage?: string;
    alertDescription?: string;
    alertType?: 'info' | 'success' | 'warning' | 'error';
    isShowAlert?: boolean;
}

const ViewDetailWrapper = ({
    children,
    loading,
    alertMessage,
    alertDescription,
    alertType,
    isShowAlert = false
}: ViewDetailWrapperProps) => {
    return (
        <Spin spinning={loading} tip="Loading...">
            <Space direction="vertical" size={40} style={{ width: '100%' }} className="scroll-animate">
                {isShowAlert && <Alert
                    className="animation-alert"
                    showIcon
                    type={alertType}
                    message={alertMessage}
                    description={alertDescription}
                />}
                {children}
            </Space>
        </Spin>
    )
}

export default ViewDetailWrapper;