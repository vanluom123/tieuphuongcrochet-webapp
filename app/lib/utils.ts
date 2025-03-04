import { DefaultOptionType } from 'rc-tree-select/lib/TreeSelect';
import moment from 'moment';
import { SegmentedValue } from 'antd/es/segmented';
import { RadioChangeEvent } from 'antd';
import { filter, findIndex, forEach, isEmpty, map } from 'lodash';

import { modal, notification } from './notify';
import { Banner, Category, DataType, FileUpload, Filter, Paging, TabsItem, TBannerType, TTranslationStatus } from './definitions';
import { ALL_ITEM, FILTER_LOGIC, FILTER_OPERATION, TRANSLATION_STATUS, TRANSLATION_STATUS_COLOR } from './constant';
import uploadFile from './service/uploadFilesSevice';

export const checkMobile = () => {
    let check = false;
    (function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true; })(navigator.userAgent || navigator.vendor);
    return check;
};

export const mobileAndTabletCheck = function () {
    let check = false;
    (function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true; })(navigator.userAgent || navigator.vendor);
    return check;
};

export const setCookie = (cookieName: string, cookieValue: string, expiresHour: number) => {
    const d = new Date();
    d.setTime(d.getTime() + expiresHour * 60 * 60 * 1000);
    const expires = `expries=${d.toUTCString()}`;
    document.cookie = `${cookieName}=${cookieValue};${expires};path=/`;
}

export const getCookie = (cookieName: string) => {
    const match = document.cookie.match(new RegExp(`(^| )${cookieName}=([^;]+)`));
    if (match) return match[2];
    return '';
}
export const deleteAllCookies = () => {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i += 1) {
        const cookie = cookies[i];
        const eqPos = cookie.indexOf('=');
        const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
    }
};

export const getBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
    });

export const getCurrentDate = (d: Date | number | string, formatDate = 'DD/MM/YYYY') => moment(d).format(formatDate);

export const getFileNameAndExt = (name: string) => {
    if (!name) {
        return { fileName: '', ext: '' };
    }
    const lastDot = name.lastIndexOf('.');
    const fileName = name.substring(0, lastDot);
    const ext = name.substring(lastDot + 1);

    return {
        fileName,
        ext,
    };
};

export const genBlobName = (originFileName: string, rootBlobFolder: string, uid: string) => {
    const currentDate = getCurrentDate(new Date())
    const { ext } = getFileNameAndExt(originFileName);
    const blobName = `image/${currentDate}/${rootBlobFolder}/${uid}.${ext}`;
    return blobName;
};

export function computePaging({ pageSize, pageIndex, currentIndex }: Paging) {
    return (pageIndex * pageSize) + 1 + currentIndex;
}

export const mapTreeData = (data: Category[]): DefaultOptionType[] => {
    const result = data.map((item: Category) => {
        const { children, ...rest } = item;
        let newItem: DefaultOptionType = {
            name: rest.name,
            key: rest.id,
            title: rest.name,
            value: rest.id as string | number,
        }
        if (children && children.length > 0) {
            newItem = {
                ...newItem,
                children: mapTreeData(children as Category[]),
            };
        }
        return newItem;
    });
    return result;
};

export const getElement = (name: string) => {
    return document.querySelector(name) as HTMLDivElement;
}

export const DragScroll = (name: string) => {
    const slider = getElement(name); // Type assertion
    let isDown: boolean = false; // Type declaration
    let startX: number; // Type declaration
    let scrollLeft: number; // Type declaration

    slider.addEventListener('mousedown', (e: MouseEvent) => { // Type for the event
        isDown = true;
        slider?.classList.add('active');
        startX = e.pageX - slider.offsetLeft;
        scrollLeft = slider.scrollLeft;
    });

    slider.addEventListener('mouseleave', () => {
        isDown = false;
        slider.classList.remove('active');
    });

    slider.addEventListener('mouseup', () => {
        isDown = false;
        slider.classList.remove('active');
    });

    slider.addEventListener('mousemove', (e: MouseEvent) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - slider.offsetLeft;
        const walk = (x - startX) * 3; //scroll-fast
        slider.scrollLeft = scrollLeft - walk;
    });
}

export const mapDataToSelectOption = (data: { name: string, id: string }[]) => {
    return map(data, (item) => {
        return {
            label: item.name,
            value: item.id,

        };
    });
};

export const getAvatar = (images: FileUpload[]) => {
    if (!images || images.length < 1) return '';
    const imgObject = filter(images, img => !isEmpty(img.fileContent))?.[0];
    if (imgObject) {
        return imgObject.fileContent || '';
    }
};

export const showConfirmDelete = (data: unknown, onDelete: (data: unknown) => void) => {
    modal.confirm({
        title: 'Do you want to delete this item?',
        okText: 'Yes',
        cancelText: 'No',
        async onOk() {
            await onDelete(data);
        },
    });
}

export const getBannersByType = (banners: Banner[], type: TBannerType) => {
    return filter((banners), b => (b.bannerType?.name) === type) || [];
}

export const getDateFormatted = (dateString: string | number | Date, locale: 'en' | 'vi' = 'en') => {
    const date = new Date(dateString)
    const year = new Intl.DateTimeFormat(locale, { year: 'numeric' }).format(date);
    const month = new Intl.DateTimeFormat(locale, { month: 'short' }).format(date);
    const day = new Intl.DateTimeFormat(locale, { day: '2-digit' }).format(date);
    const hour = new Intl.DateTimeFormat(locale, { hour: '2-digit' }).format(date);
    const minute = new Intl.DateTimeFormat(locale, { minute: '2-digit' }).format(date);

    return `${day} ${month}, ${year} - ${hour}:${minute}`
}

/**
 * Get the document's vertical scroll position
 */
export const _scrollTop = function () {
    return Math.max(
        document.body.scrollTop,
        document.documentElement.scrollTop
    );
};

export function addScrollClasses(name: string) {

    const items = document.querySelectorAll(name);
    if (items?.length < 1) return;

    let i = 0;
    forEach(items, (item) => {
        const scrollTop = _scrollTop();
        const divider = getElement('.header-divider');
        const dividerMarginT = window.getComputedStyle(divider)?.marginTop?.split('p')[0];
        const dividerHeight = parseInt(dividerMarginT) * 2;

        const HEGHT_ADD_CLASS = (checkMobile() || mobileAndTabletCheck()) ? -dividerHeight : dividerHeight;

        const triggerPosition = (item as HTMLDivElement)?.offsetTop + HEGHT_ADD_CLASS;

        if (scrollTop >= triggerPosition) {
            item?.classList.add('scrolling');
            i++;
        }
    });

    return i === items.length;
};

export const addScrollClass = (element: HTMLElement) => {
    let added = false;
    const scrollTop = _scrollTop();
    const elTop = element?.offsetTop;

    if (scrollTop > elTop / 6) {
        element?.classList.add('scrolling')
        added = true;
    }
    return added;
}

export const animationHeader = (name?: string) => {
    const element = getElement(name || '.scroll-animate');

    // <-- Mobile or tablet
    if (checkMobile() || mobileAndTabletCheck()) {
        setTimeout(() => {
            element?.classList.add('scrolling');
        }, 0);
        return () => element?.classList.remove('scrolling');
    }

    // <-- DOM-Window, extends DOM-EventTarget
    const win: Window = window;
    const onScroll: EventListener = () => {
        const added = addScrollClass(element);
        if (added) {
            win.removeEventListener("scroll", onScroll)
        }
    };

    win.addEventListener("scroll", onScroll);
    return () => win.removeEventListener("scroll", onScroll);
}


export const animationHome = () => {
    const items = document.querySelectorAll('.scroll-animate');
    if (checkMobile() || mobileAndTabletCheck()) {
        items[0]?.classList.add('scrolling');
    }

    // <-- DOM-Window, extends DOM-EventTarget
    const win: Window = window;
    const onScrollHome: EventListener = () => {
        const added = addScrollClasses('.scroll-animate');
        if (added) {
            win.removeEventListener("scroll", onScrollHome);
        }
    };

    win.addEventListener("scroll", onScrollHome);
    return () => win.removeEventListener("scroll", onScrollHome);
}

export function mapImagesPreview(images: FileUpload[]) {
    const list = map(images, img => ({ src: img.fileContent, alt: img.fileName }));
    return filter(list, l => !isEmpty(l.src));
}

export const onScrollBody = (name: string) => {
    const topHeight = getElement(name)?.offsetTop;
    window.scrollTo(0, topHeight);
}

export const checkPdfFile = (fileName: string): boolean => {
    const ext = fileName.substring(fileName.lastIndexOf('.') + 1);
    return ext === 'pdf';
};

export function filterByText(value: string, ...keys: string[]): Filter {
    if (!value) return {} as Filter;
    return {
        filterLogic: FILTER_LOGIC.ANY,
        filterCriteria: map(keys, (key) => (
            {
                key: key,
                operation: FILTER_OPERATION.LIKE,
                value
            })
        )
    }
}


export const mapNameFilters = (filters: Filter[], name: string, obFilter: Filter): Filter[] => {
    let tempFilters: Filter[] = [...filters];

    const index = findIndex(tempFilters, f => f.name === name);

    if (index > -1) {
        if (!obFilter || Object.keys(obFilter).length < 1) {

            tempFilters.splice(index, 1)

        } else {
            tempFilters[index] = {
                name,
                ...obFilter
            };
        }
    } else {
        tempFilters = [
            ...tempFilters,
            {
                name,
                ...obFilter
            }
        ]
    }

    return tempFilters;
}

export const getFilters = (filter: Filter[]) => {
    return map(filter, t => {
        const newFilter: Filter = {
            filterLogic: t.filterLogic,
            filterCriteria: t.filterCriteria
        }
        return newFilter
    })
}

export const getCategoryFilter = (key: React.Key) => {
    const categoryFilter: Filter = (key === ALL_ITEM.key || !key) ? {} as Filter :
        {
            name: 'category',
            filterLogic: FILTER_LOGIC.ALL,
            filterCriteria: [
                {
                    key: 'category.id',
                    value: [`${key}`],
                    operation: FILTER_OPERATION.IN
                }
            ],
        };
    return categoryFilter;
}

export const getRadioFilter = (e: RadioChangeEvent): Filter => {
    const value = e.target.value;

    if (value === ALL_ITEM.key) {
        return {} as Filter;
    }

    return {
        name: 'isHome',
        filterLogic: FILTER_LOGIC.ALL,
        filterCriteria: [
            {
                key: 'isHome',
                value: value,
                operation: FILTER_OPERATION.EQUAL
            }
        ]
    }
}


export const getStatusFilter = (value: SegmentedValue): Filter => {
    const statusFilter: Filter = value === TRANSLATION_STATUS.ALL ? {} as Filter :
        {
            name: 'statusFilter',
            filterLogic: FILTER_LOGIC.ALL,
            filterCriteria: [
                {
                    key: 'status',
                    value,
                    operation: FILTER_OPERATION.EQUAL
                }
            ],
        };
    return statusFilter;
}

export const getStatusColor = (status: TTranslationStatus) => {

    return status ? TRANSLATION_STATUS_COLOR[status] : TRANSLATION_STATUS_COLOR.NONE;
}

export const mapTabsData = (data: DataType[]): TabsItem[] => {
    const result = map(data, c => {
        const { children, name, key, icon } = c;

        let newTab: TabsItem = {
            label: name.toLowerCase(),
            key: key || 'N/A',
            icon: icon,
        };

        if (children && children.length > 0) {
            newTab = {
                ...newTab,
                children: mapTabsData(children as DataType[])
            } as TabsItem;
        }
        return newTab;
    });

    return result;
}

export const uploadImageToServer = async (currentImages: FileUpload[] = [], prevImages: FileUpload[] = []) => {

    // Filter out images that are removed
    const deletedImages = prevImages.filter(item => currentImages.findIndex(img => img.fileName === item.fileName) < 0) || [];
    // Delete images that are removed
    if (deletedImages.length > 0) {
        const res: string[] = await uploadFile.delete(deletedImages.map(img => img.fileName || ''));
        console.log('delete images', res);

        if (res.length > 0) {
            notification.error({ message: 'Error!', description: 'Delete file failed!' });
            return;
        }
    }

    // Filter out images that was uploaded
    const uploadedImages = [];
    // Filter out images that are already uploaded
    let filesRes: FileUpload[] = [];

    const formData = new FormData();

    for (let i = 0; i < currentImages.length; i++) {
        const image = currentImages[i];
        if (image.fileContent || !image.originFileObj) {
            uploadedImages.push(image);
            continue;
        }

        formData.append('files', image.originFileObj as File);
        const res: FileUpload[] = await uploadFile.upload(formData);
        if (res?.length > 0) {
            filesRes = [...res];
        } else {
            notification.error({ message: '!Error', description: 'Upload image failed' });
            break;
        }
    }

    return [...uploadedImages, ...filesRes];
}

export const uid = () => new Date().getTime().toString(36) + Math.random().toString(36).substring(2);

export const scrollHorizional = () => {
    const scrollContainer = document.querySelector(".horizontal-scroll") as HTMLElement;
    if (scrollContainer) {
        let isDown = false;
        let startX: number;
        let scrollLeft: number;
        scrollContainer.addEventListener("mousedown", (e) => {
            isDown = true;
            scrollContainer.classList.add("active");
            startX = e.pageX - scrollContainer.offsetLeft;
            scrollLeft = scrollContainer.scrollLeft;
        });

        scrollContainer.addEventListener("mouseleave", () => {
            isDown = false;
            scrollContainer.classList.remove("active");
        });

        scrollContainer.addEventListener("mouseup", () => {
            isDown = false;
            scrollContainer.classList.remove("active");
        });

        scrollContainer.addEventListener("mousemove", (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - scrollContainer.offsetLeft;
            const walk = (x - startX) * 2; // Adjust scroll speed
            scrollContainer.scrollLeft = scrollLeft - walk;
        });
    }
}

/** Utility function for handling notifications */
export const showNotification = (type: "success" | "error", message: string, description: string) => {
    if (!notification) {
        console.error("Notification object is undefined!");
        return;
    }

    setTimeout(() => {
        notification[type]({ message, description });
    }, 0);
};
