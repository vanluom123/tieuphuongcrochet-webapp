import { Button, MenuProps, Dropdown, Modal, Avatar } from "antd";
import {
  UserOutlined,
  LogoutOutlined,
  DashboardOutlined,
  LoginOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import { signOut, useSession } from "next-auth/react";
import { ROUTE_PATH, USER_ROLES } from "@/app/lib/constant";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import "../../ui/navigation.scss";

const UserAccount = () => {
  const { data: session } = useSession();
  const t = useTranslations("UserAccount");
  const router = useRouter();

  const userAvatar = session?.user.imageUrl;
  const userId = session?.user.id;

  const items: MenuProps["items"] = [
    {
      key: "user_profile",
      label: t("profile"),
      icon: <UserOutlined />,
      onClick: () => {
        router.push(`${ROUTE_PATH.PROFILE}/${userId}`);
      },
    },
    ...(session?.user?.role === USER_ROLES.ADMIN
      ? [
          {
            key: "dashboard",
            label: t("dashboard"),
            icon: <DashboardOutlined />,
            onClick: () => {
              router.push(ROUTE_PATH.DASHBOARD);
            },
          },
        ]
      : []),
    {
      key: "logout",
      label: t("logout"),
      icon: <LogoutOutlined />,
      onClick: () => {
        Modal.confirm({
          title: t("logout_confirm"),
          onOk: () => {
            signOut({ callbackUrl: ROUTE_PATH.LOGIN });
          },
        });
      },
    },
  ];

  const loginMenu = [
    {
      key: "login",
      label: t("sign_in"),
      icon: <LoginOutlined />,
      onClick: () => {
        router.push(ROUTE_PATH.LOGIN);
      },
    },
    {
      key: "register",
      label: t("register"),
      icon: <UserAddOutlined />,
      onClick: () => {
        router.push(ROUTE_PATH.REGISTER);
      },
    },
  ];

  return (
    <span className="user-menu">
      <Dropdown
        arrow
        menu={{ items: session?.user?.email ? items : loginMenu }}
      >
        <Button
            shape="circle"
            className="user-menu-icon"
            icon={
                userAvatar ? (
                <Avatar src={userAvatar} size={32} />
                ) : (
                <Avatar
                    style={{ backgroundColor: "#fc8282" }}
                    icon={<UserOutlined />}
                    size={32}
                />
                )
          }
        />
      </Dropdown>
    </span>
  );
};

export default UserAccount;
