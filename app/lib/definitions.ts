import React, { ReactNode } from "react";

export interface Pagination {
	last: boolean;
	pageNo: number;
	pageSize: number;
	totalElements: number;
	totalPages: number;
}

export interface ListResponse<T> {
	contents: T[];
	last: boolean;
	pageNo: number;
	pageSize: number;
	totalElements: number;
	totalPages: number;
};

export interface ListParams {
	_pageNo: number;
	_pageSize: number;
	_sortBy?: string;
	_sortDir?: 'asc' | 'desc';
	filters: Filter[];
};

export const initialListParams: ListParams = {
	_pageNo: 0,
	_pageSize: 30,
	_sortBy: 'createdDate',
	_sortDir: 'desc',
	filters: []
};

export const initialViewTableParams: ListParams = {
	_pageNo: 0,
	_pageSize: 48,
	_sortBy: 'createdDate',
	_sortDir: 'desc',
	filters: []
};

export interface ListTablePayload<T> {
	data: T[];
	total: number;
}

export interface FileUpload {
	fileContent: string;
	fileName: string;
	url: string;
};

export interface Filter {
	name?: string;
	filterLogic: string;
	filterCriteria: FilterCriteria[];
}

export interface FilterCriteria {
	key: string;
	operation: string;
	value: string | number | string[] | number[];
}

export type UploadMode = 'directory' | 'crop' | 'normal';

export const UPLOAD_MODES = {
	DIRECTORY: 'directory',
	CROP: 'crop',
	NORMAL: 'normal'
};

// Breadcrumbs
export interface BreadCrumbItem {
	path: string;
	title: string | ReactNode;
};

// ----------------Table-----------------------

export interface DataType {
	key: React.Key;
	name: string;
	price?: number;
	author?: string;
	files?: FileUpload[];
	src?: string;
	description?: string;
	email?: string;
	children?: unknown[];
	icon?: React.ReactNode;
	images?: FileUpload[];
	currency_code?: string;
	link?: string;
	title?: string;
	content?: string;
	createdDate?: string;
	imagesPreview?: { src: string, alt: string }[];
}

export interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
	editing: boolean;
	dataIndex: string;
	// title: any;
	inputType: 'number' | 'text';
	record: DataType;
	index: number;
	children: React.ReactNode;
}

//   export interface DataTableProps extends TableProps<DataType> {
//     pageSize?: number;
//     pageIndex?: number;
//     onEditRecord: (key: React.Key, record?: any) => void;
//     onDeleteRecord: (key: React.Key) => void;
//     customColumns?: ColumnsType<DataType>;
//     isShowImage?: boolean;
//     visiblePagination?: boolean;
//     totalPageSize?: number;
//     onPageChange?: (page: number, pageSize: number) => void;
//     onShowSizeChange?: (current: number, size: number) => void;
//     onTableChange?: (pagination: any, filters: any, sorter: any, extra: any) => void;
//   }

export interface SearchParams {
	filters: Filter[];
};

//   export interface SearchTableProps {
//     onAddNew: () => void;
//     onSearch?: SearchProps['onSearch'];
//     onSearchChange?: (searchParams: SearchParams) => void;
//     textAddNew?: string;
//     loading?: boolean;
//     isShowFilter?: boolean;
//     isShowSearch?: boolean;
//     isShowAddNew?: boolean;
//     searchFields?: string[];
//     isShowStatusFilter?:boolean;
//   }

export interface Paging {
	pageSize: number;
	pageIndex: number;
	currentIndex: number
}

// Setting
export type TBannerType = 'Shop' | 'About' | 'Pattern' | 'Product' | 'Free pattern' | 'Contact' | 'Home' | 'Blog' | 'Advertisement' | '';

// Banner

export interface Banner {
	fileContent: string;
	fileName: string;
	title?: string;
	content?: string;
	url?: string;
	bannerTypeId: string;
	active?: boolean;
	id?: string;
	bannerType?: IBannerType;
	textColor?: string;
};


export interface IBannerType {
	id?: React.Key;
	name: TBannerType;
	createdDate?: string;
}

export interface SettingState {
	loading: {
		banner: boolean,
		bannerType: boolean
	};
	bannerTypes: DataType[];
	banners: Banner[];
}

// ---------------------------------- Category ----------------------------------

export interface Category {
    id?: React.Key;
    name: string;
    children?: unknown[];
    parentIds?: unknown[];
    key?: string;
};

export interface CategoryState {
    loading: boolean;
    data: DataType[];
    totalRecord: number;
}

// -------------------------- FreePattern --------------------------
export interface FreePattern {
	id: string;
	name: string;
	description: string;
	bytes: string[];
}

// -------------------------- Pattern --------------------------
export interface Menu {
    key: string;
    name: string;
    path: string;
}

export interface Pattern {
	id?: React.Key;
	name: string;
	price?: number;
	description?: string;
	files?: FileUpload[];
	author?: string;
	src?: string;
	images?: FileUpload[];
	category?: Category;
	imagesPreview?: { src: string, alt: string }[];
	link?: string;
	currency_code?: string;
	content?: string;
	status?: TTranslationStatus;
	home?:boolean
}

export interface PayloadFile {
	file: unknown;
	resolve?: unknown
}

export interface PatternPayload {
	params: Pattern;
	callback: () => void;
};

export interface PatternState {
	loading: boolean;
	data: DataType[];
	totalRecord: number;
	pattern: Pattern;
}

export type TTranslationStatus = 'PENDING' | 'SUCCESS' | 'NONE' | 'ALL';

export interface TranslationStatus {
	label: string;
	value: TTranslationStatus;
}

// -------------------------- Post --------------------------

export interface Post {
    id?: React.Key,
    title: string,
    content: string,
    createdDate: string,
    files?: FileUpload[],
    src?: string,
    is_home?:boolean
}

export interface PostPayloadFile {
    file: unknown;
    resolve?: unknown
}

export interface PostState {
    loading: boolean;
    data: DataType[];
    totalRecord: number;
    post: Post;
}

export interface PostPayload {
    params: Post;
    callback: () => void;
}

// -------------------------- Product --------------------------

export interface Product {
	id?: React.Key,
	name: string,
	price?: number,
	description?: string,
	images?: FileUpload[];
	src?: string;
	author?: string;
	currency_code?: string;
	category?: Category;
	imagesPreview?: { src: string, alt: string }[];
	link?: string;
	content?: string;
}

export interface ProductPayloadFile {
	file: unknown;
	resolve?: unknown
}

export interface HomeData {
	products: Product[],
	patterns: Pattern[],
	freePatterns: Pattern[],
	banners: Banner[],
	blogs: Post[]
};

export interface ProductState {
	loading: boolean;
	data: DataType[];
	totalRecord: number;
	product: Product;
}

export interface ProductPayload {
	params: Product;
	callback: () => void;
}

// -------------------------- Tabs --------------------------

export interface TabsItem {
    label: string;
    key: React.Key;
    icon?: React.ReactNode;
    children?: TabsItem[];
}


// -------------------------- Direction --------------------------

export type TDirection = 'horizontal' | 'vertical';
