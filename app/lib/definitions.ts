import { UploadFile } from "antd";
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
}

export interface ListParams {
	pageNo: number;
	pageSize: number;
	sortBy?: string;
	sortDir?: 'asc' | 'desc';
	categoryId: string;
	filter: string;
}

export const initialListParams: ListParams = {
	pageNo: 0,
	pageSize: Number(process.env.NEXT_PUBLIC_PAGE_SIZE),
	sortBy: 'createdDate',
	sortDir: 'desc',
	categoryId: '',
	filter: ''
}

export interface FileUpload extends UploadFile {
	fileContent: string;
}

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
}

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

export interface SearchParams {
	categoryId: string;
	filter: string;
}

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
}

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
	src: string;
	images?: FileUpload[];
	category?: Category;
	imagesPreview?: { src: string, alt: string }[];
	link?: string;
	currency_code?: string;
	content?: string;
	status?: TTranslationStatus;
	home?: boolean;
	fileContent?: string;
	username?: string;
	userAvatar?: string;
	userId?: string;
}

export type TTranslationStatus = 'PENDING' | 'SUCCESS' | 'NONE' | 'ALL';

export interface TranslationStatus {
	label: string;
	value: TTranslationStatus;
}

export interface DataTableState {
	loading?: boolean;
	data: DataType[];
	totalRecord?: number;
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
	fileContent?: string;
}

export interface HomeData {
	products: Product[],
	patterns?: Pattern[],
	freePatterns: Pattern[],
	banners: Banner[],
	blogs: Post[]
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

// -------------------------- User --------------------------

export interface User {
	id?: number | string;
	name?: string;
	email: string;
	imageUrl?: string;
	provider?: string;
	emailVerified?: boolean;
	role?: string;
	phone?: string;
	birthDate?: string;
	gender?: string;
	backgroundImageUrl?: string;
	collections?: Collection[];
	recentComments?: Comment[];
	password?: string;
	createdDate?: string;
	lastModifiedDate?: string;
}

//------------------------Blogs--------------------------

export interface Post {
	id?: React.Key,
	title: string,
	content: string,
	createdDate: string,
	files?: FileUpload[],
	src?: string,
	is_home?: boolean,
	fileContent?: string
}

// -------------------------- Collection --------------------------

export interface Collection {
	id: string;
	name?: string;
	description?: string;
	totalPatterns?: number;
	avatar?: string;
	createdDate?: string;
	userId?: string;
}

// -------------------------- Comment --------------------------

export interface Comment {
	id: string;
	content: string;
	createdDate: string;
}

export interface ResponseData {
	code: number,
	data: any,
	success: boolean,
	message: string,
	error: string
}

export interface IResponseList<T> {
	data: T[],
	totalRecords: number
}

export interface CommentData {
	id: string;
	content: string;
	createdDate: string;
	userId: string;
	username: string;
	userAvatar: string;
	parentId?: string | null;
	replies: CommentData[];
	replyCount: number;
	mentionedUserId?: string;
	mentionedUsername?: string;
}

export interface PaginatedResponse<T> {
	content: T[];
	pageNo: number;
	pageSize: number;
	totalElements: number;
	totalPages: number;
	last: boolean;
}
