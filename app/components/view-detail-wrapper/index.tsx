import { Alert, Space, Spin } from "antd";

interface ViewDetailWrapperProps {
  children: React.ReactNode;
  loading?: boolean;
  alertMessage?: string;
  alertDescription?: string;
  alertType?: "info" | "success" | "warning" | "error";
  isShowAlert?: boolean;
}

const ViewDetailWrapper = ({
  children,
  loading = false,
  alertMessage,
  alertDescription,
  alertType,
  isShowAlert = false,
}: ViewDetailWrapperProps) => {
  return (
    <Spin spinning={loading} tip="Loading...">
      <Space
        direction="vertical"
        size={24}
        style={{ width: "100%" }}
        className="view-detail-wrapper"
      >
        {isShowAlert && (
          <Alert
            className="detail-note-banner"
            showIcon
            type={alertType}
            message={alertMessage}
            description={alertDescription}
          />
        )}
        {children}
      </Space>
    </Spin>
  );
};

export default ViewDetailWrapper;
