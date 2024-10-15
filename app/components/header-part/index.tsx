import React from "react";
import { Divider, Flex } from "antd";
import { useTranslations } from "next-intl";
interface HeaderPartProps {
	titleId: string;
	descriptionId: string;
	isShowDivider?: boolean;
};

const HeaderPart = ({ titleId, descriptionId, isShowDivider }: HeaderPartProps) => {
	const t = useTranslations();

	return (
		<div className="header-part responsive text-box">
			{isShowDivider && <Divider className="header-divider" />}
			{titleId && <div className="header-title animation-wrap">
				<Flex justify='center' >
					<h2 className="title">{t(titleId)}</h2>
				</Flex>
				<Flex justify='center' className="description">
					{descriptionId && t(descriptionId)}
				</Flex>
			</div>}
		</div>
	)
}

export default HeaderPart;
