import Link from "next/link";
import React from "react";
import { useTranslations } from "next-intl";
import  styles from '../../ui/components/btnReadMore.module.scss';

interface ReadMoreBtnProps {
	path: string;
	className?: string;
}

const ReadMoreBtn = ({ path, className = '' }: ReadMoreBtnProps) => {
	const t = useTranslations("Btn");
	const classess = `${styles.readmoreBtn} ${className}`;

	return (
		<div className={classess}>
			<Link href={path} >
				{t('readMore')}
			</Link>
		</div>
	)
}

export default ReadMoreBtn;
