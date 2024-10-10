export const cfgi_supported_tokens = [
	'BTC',
	'ETH',
	'BNB',
	'XRP',
	'SOL',
	'ADA',
	'LUNA',
	'AVAX',
	'DOGE',
	'DOT',
	'SHIB',
	'MATIC',
	'CRO',
	'TRX',
	'XLM',
	'LINK',
	'UNI',
	'FTM',
	'ALGO',
	'MANA',
	'LTC',
	'LEO',
	'FTT',
	'NEAR',
	'BCH',
	'ETC',
	'XMR',
	'ATOM',
	'VET',
	'HBAR',
	'FLOW',
	'ICP',
	'APE',
	'EGLD',
	'XTZ',
	'THETA',
	'XTZ',
	'THETA',
	'HNT',
	'FIL',
	'BSV',
	'AXS',
	'SAND',
	'ZEC',
	'EOS',
	'IOTA'
];

export enum CFGI_SUPPORTED_PERIODS_ENUM {
	MIN15 = 1,
	HOUR1 = 2,
	HOUR4 = 3,
	HOUR7 = '7H',
	DAY1 = 4,
	MONTH1 = '1M',
	YEAR1 = '1Y'
}

export type Option = {
	label: string;
	value: any;
	disabled?: boolean;
	requiresPremium?: boolean;
};

export const CfgiPeriods: Option[] = [
	{
		label: '24H',
		value: CFGI_SUPPORTED_PERIODS_ENUM.DAY1
	},
	{
		label: '4H',
		value: CFGI_SUPPORTED_PERIODS_ENUM.HOUR4
	},
	{
		label: '1H',
		value: CFGI_SUPPORTED_PERIODS_ENUM.HOUR1
	},
	{
		label: '15M',
		value: CFGI_SUPPORTED_PERIODS_ENUM.MIN15
	}
];
