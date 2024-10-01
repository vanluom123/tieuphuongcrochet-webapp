import shopee from '@/public/shope.jpg';
import { TBannerType, TranslationStatus } from './definitions';

export const ROUTE_PATH = {
  HOME: '/',
  SHOP: '/shop',
  FREEPATTERNS: '/free-patterns',
  BLOG: '/blog',
  ABOUT: '/about',
  CONTACT: '/contact',
  LOGIN: '/login',
  ADMIN: '/admin',
  REGISTER: '/register',
  ADMIN_FREE_PATTERNS: '/admin/free-patterns',
  AMIN_PRODUCTS: '/admin/products',
  ADMIN_USERS: '/admin/users',
  ADMIN_SETTING: '/admin/setting',
  ADMIN_POSTS: '/admin/blogs',
  ADMIN_CATEGORY: '/admin/categories',
  CREATE: 'create-update',
  DETAIL: 'detail'
};

export const SOCIAL_LINKS = {
  FACEBOOK: 'https://www.facebook.com/tieuconuong.tiemlen/',
  SOPEE: 'https://shopee.vn/littlegirl.crochet',
  INSTAGRAM: 'https://www.instagram.com/little_girl.crochet/',
  TIKTOK: 'https://www.tiktok.com/@xiao.fang_96',
  YOUTUBE: 'https://www.youtube.com/@littlegirl.crochet',
};


export const LANGUAGES = {
  VN: 'vi',
  EN: 'en'
};

export const CURRENCY = {
  VND: 'VND',
  USD: 'USD',
};

export const CURRENCY_LIST = [
  {
    value: CURRENCY.VND,
    label: CURRENCY.VND,
  },
  {
    value: CURRENCY.USD,
    label: CURRENCY.USD
  },
]

export const LANGUAGES_LIST = [
  { key: LANGUAGES.VN, label: 'VN' },
  { key: LANGUAGES.EN, label: 'EN' },
];

export const ROLES = {
  ADMIN: 'ADMIN',
  USER: 'USER',
};

export const LOCAL_STORAGE_NAMES = {
  SYSTEM_AUTHORITY: 'system-authority',
  ACCESS_TOKEN: 'accessToken',
};

export const COOKIE_NAMES = {
  REFRESHER_TOKEN: 'refreshToken',
  ACCESS_TOKEN: 'accessToken',
};

export const MENU_NAV = [
  { path: ROUTE_PATH.HOME, name: 'home' },
  { path: ROUTE_PATH.SHOP, name: 'shop' },
  { path: ROUTE_PATH.FREEPATTERNS, name: 'freePattern' },
  { path: ROUTE_PATH.BLOG, name: 'blog' },
  { path: ROUTE_PATH.ABOUT, name: 'about' },
  { path: ROUTE_PATH.CONTACT, name: 'contact' },
];

// set the breadcrumb key follow BannerType
export const BREADCRUMB: { path: string, name: string, key: TBannerType }[] = [
  { path: ROUTE_PATH.HOME, name: 'home', key: 'Home' },
  { path: ROUTE_PATH.SHOP, name: 'shop', key: 'Shop' },
  { path: ROUTE_PATH.FREEPATTERNS, name: 'freePattern', key: 'Free pattern' },
  { path: ROUTE_PATH.BLOG, name: 'blog', key: 'Blog' },
  { path: ROUTE_PATH.ABOUT, name: 'about', key: 'About' },
  { path: ROUTE_PATH.CONTACT, name: 'contact', key: 'Contact' },
  { path: ROUTE_PATH.DETAIL, name: 'detail', key: '' },
  { path: ROUTE_PATH.CREATE, name: 'create', key: '' },
];

export const BANNER_TYPES_DEFAULT: TBannerType[] = [
  'About', "Advertisement", "Blog", "Contact", "Free pattern", "Home", "Pattern", "Product", "Shop"
]

export const REGEX = {
  PHONE_NUMBER: /^(0|\+?84)\d{9}$/,
  // eslint-disable-next-line no-control-regex
  EMAIL:
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  EMAIL_AIA:
    /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@aia\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i,
  IDENTIFY: /^[0-9]{9}$/,
  POLICY_NUMBER: /^[a-zA-Z]{1}[0-9]{9}$/,
  BILLING: /^[0-9]{7}$/,
  NUMBER: /^\d+$/,
  FW_POLNUM: /^[C|U][0-9]{9}$/,
  VN_TEXT_ONLY:
    /^[a-zA-Z 0-9\.\,\+\-\;\&\_\\\)\(\/\" a|à|á|ạ|ả|ã â|ầ|ấ|ậ|ẩ|ẫ ă|ằ|ắ|ặ|ẳ|ẵ đ e|è|é|ẹ|ẻ|ẽ ê|ề|ế|ệ|ể|ễ i|ì|í|ị|ỉ|ĩ o|ò|ó|ọ|ỏ|õ ô|ồ|ố|ộ|ổ|ỗ ơ|ờ|ớ|ợ|ở|ỡ u|ù|ú|ụ|ủ|ũ ư|ừ|ứ|ự|ử|ữ y|ỳ|ý|ỵ|ỷ|ỹ]*$/,
  ID_NO: /^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/,
  VN_NAME:
    /^[a-zA-Z0-9 aàáạảã âầấậẩẫ ăằắặẳẵ đ eèéẹẻẽ êềếệểễ iìíịỉĩ oòóọỏõ ôồốộổỗ ơờớợởỡ uùúụủũ ưừứựửữ yỳýỵỷỹ]*$/i,
  MULTI_EMAIL:
    /^([A-Za-z0-9\.|-|_]*[@]{1}[A-Za-z0-9\.|-|_]*[.]{1}[a-z]{2,5})(;[A-Za-z0-9\.|-|_]*[@]{1}[A-Za-z0-9\.|-|_]*[.]{1}[a-z]{2,5})*?$/,
  PASSWORD:
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&*\-_!+=\[\]{}|\\:',.?/`~"();])(?!.*@\.)[A-Za-z\d@#$%^&*\-_!+=\[\]{}|\\:',.?/`~"();]{8,}$/,
  USERNAME: /^(\d|\w)+$/,
};

export const ALL_ITEM = {
  label: 'tab.all',
  key: 'all'
};


export const SOCIALS = [
  {
    social: 'Shopee',
    src: shopee,
    url: SOCIAL_LINKS.SOPEE,
    textColor: '#fa5330',
  },
  { social: 'Facebook', textColor: '#0866ff' },
  {
    social: 'Instagram',
    textColor: '#e42a81',
    url: SOCIAL_LINKS.INSTAGRAM,
  },
  { social: 'Tiktok', url: SOCIAL_LINKS.TIKTOK },
];

export const FOOTER_LINK = [
  { name: 'home', path: ROUTE_PATH.HOME },
  { name: 'shop', path: ROUTE_PATH.SHOP },
  { name: 'freePattern', path: ROUTE_PATH.FREEPATTERNS },
  { name: 'blog', path: ROUTE_PATH.BLOG },
  { name: 'about', path: ROUTE_PATH.ABOUT },
  { name: 'contact', path: ROUTE_PATH.CONTACT },
];


export const OPERATOR = {
  GREATER_THAN: 'GREATER_THAN',
  LESS_THAN: 'LESS_THAN',
  EQUALS: 'EQUALS',
  LIKE: 'LIKE',
  NOT_EQUALS: 'NOT_EQUALS',
  IN: 'IN',
}

export const IMAGE_FALLBACK = `data:image/png;base64,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`;

export const FILTER_OPERATION = {
  GREATER_THAN: 'GREATER_THAN',
  LESS_THAN: 'LESS_THAN',
  EQUAL: 'EQUAL',
  LIKE: 'LIKE',
  NOT_EQUAL: 'NOT_EQUAL',
  IN: 'IN',
}

export const DEFAULT_CHART_EDITOR = '<blockquote><p>&nbsp; <a href="https://mycollection.shop/tiemlentieuconuong">Một số shop len, và phụ kiện móc len, phụ kiện trang trí, decore bàn, chụp hình,…. mình đã &nbsp;mua </a>→ <a href="https://mycollection.shop/tiemlentieuconuong">Len và phụ kiện</a></p></blockquote><blockquote><h2><strong>* </strong>Ký hiệu/ crochet symbols</h2><p>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp;<strong>MR </strong>= <strong>Magic Ring</strong>, nghĩa là <strong>vòng tròn ma thuật</strong>.</p><p><strong>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp;X = sc =&nbsp;</strong> Single crochet = mũi đơn</p><p><strong>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp;V = inc = increase = </strong>Double crochet = 2 mũi đơn chung chân</p><p><strong>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp;W= triple </strong>crochet = 3 mũi đơn chung chân</p><p><strong>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp;A = dec = decrease =</strong> giảm mũi (2 mũi đơn chụm đầu)</p><p><strong>&nbsp; &nbsp; &nbsp; &nbsp; Ch </strong>= Chain stitch = mũi bính</p><p><strong>&nbsp; &nbsp; &nbsp; &nbsp; S = sl = slsc = </strong>Slip stitch = Móc mũi trượt</p><p>&nbsp; &nbsp; &nbsp; &nbsp;<strong> T = hdc </strong>= half double crochet = Mũi nửa kép</p><p><strong>&nbsp; &nbsp; &nbsp; &nbsp; F = dc = </strong>double crochet = mũi kép đơn</p><p><strong>&nbsp; &nbsp; &nbsp; &nbsp;E = tr =</strong> treble crochet = mũi kép đôi</p><p>&nbsp; &nbsp; &nbsp; &nbsp;<strong>FLO </strong>= Front loop only: móc vào cạnh trước của mũi&nbsp;</p><p>&nbsp; &nbsp; &nbsp;&nbsp;<strong>BLO </strong>= Back loop only: móc vào cạnh sau của mũi&nbsp;</p><p>&nbsp; &nbsp; &nbsp; &nbsp;<strong>K: skip sitch = bỏ qua 1 mũi</strong></p><p>&nbsp; &nbsp; &nbsp; &nbsp;&nbsp;<strong>[….]</strong> = number of stitches in one round &nbsp;= số mũi trong 1 vòng</p><p>&nbsp; &nbsp; &nbsp; &nbsp;&nbsp;<strong>R </strong>= Round = Vòng</p><p>&nbsp; &nbsp; &nbsp; &nbsp; Vd: &nbsp;<strong>R1: 6x = 6 sc in a magic ring =</strong> Vòng 1: Móc 6 mũi đơn vào vòng tròn ma thuật.</p></blockquote><p>&nbsp;</p>';

export const FILTER_LOGIC = {
  ALL: 'ALL',
  ANY: 'ANY'
}

export const TRANSLATION_STATUS = {
  NONE: 'NONE',
  PENDING: 'PENDING',
  SUCCESS: 'SUCCESS',
  ALL: 'ALL'
};

export const TRANSLATION_STATUS_COLOR = {
  ALL: 'default',
  NONE: 'default',
  PENDING: 'processing',
  SUCCESS: 'success'
};

export const TRANSLATION_OPTIONS: TranslationStatus[] = [
  {
    label: "ALL",
    value: 'ALL',
  },
  {
    label: 'PENDING',
    value: 'PENDING',
  },
  {
    label: 'SUCCESS',
    value: 'SUCCESS',
  },
]


export const API_ROUTES = {
	HOME: '/home',
	PRODUCT: '/product',
	PATTERN: '/pattern',
	FREE_PATTERN: '/free-pattern',
	BLOG: '/blog',
	USER: '/users',

	// Category
	CATEGORY: '/category',
	// Get sub categories
	SUB_CATEGORY: '/category/get-sub-categories',
	// Get parent categories
	PARENT_CATEGORY: '/category/get-parent-categories',
	ALL_CATEGORY: '/category/get-all-categories',

	// Common CRUD
	CREATE: 'create',
	DETAIL: 'detail',
	UPDATE: 'update',
	DELETE: 'delete',
	PAGINATION: 'pagination',

	// Auth
	LOGIN: '/auth/login',
	SIGNUP: '/auth/signup',
	LOGOUT: '/auth/login',
	RESET_PASSWORD: '/auth/login',
	REFRESH_TOKEN: 'auth/refresh-token',
	UPLOAD_FILE: 'firebase-storage/upload-file',
	DELETE_MULTIPLE_FILES: 'firebase-storage/delete-multiple-files',

	//Setting
	CU_BANNER_TYPE : '/bannerType/createOrUpdate',
	D_BANNER_TYPE : '/bannerType/delete',
	BANNER_TYPE : '/bannerType/getAll',
	CU_BANNER: '/banner/batchInsertOrUpdate',
	GETT_ALL_BANNER: '/banner/getAll',
}
