import { CURRENCY } from "@/app/lib/constant";
import { Currency } from "@/app/lib/definitions";
import React, { useMemo } from "react";
interface Props {
	price?: number;
	currency_code?: string;
}


const FormattedCurrency = ({ price, currency_code }: Props) => {

	const formattedPrice = useMemo(() => {
		if (!price) return '';
		if (!currency_code || currency_code === CURRENCY.VND) {
			return new Intl.NumberFormat('vi-VN', {
				style: 'currency',
				currency: 'VND',
				minimumFractionDigits: 0,
			}).format(price || 0);
		}

		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: currency_code,
			minimumFractionDigits: 0,
		}).format(price || 0);
	}, [price, currency_code]);


	return (
		<div className='price-wrap'>
			{formattedPrice}
		</div>
	)
}

export default FormattedCurrency;
