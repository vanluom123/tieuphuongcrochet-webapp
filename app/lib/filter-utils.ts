import {ALL_ITEM, TRANSLATION_STATUS} from "./constant";
import {sfEqual, sfLike, sfOr} from "spring-filter-query-builder";

export const combineFilters = ({
                            status,
                            search,
                            isHome,
                            searchFields = []
                        }: {
    status?: string;
    search?: string;
    isHome?: string;
    searchFields?: string[];
}) => {
    const filterParts = [];

    // Add status filter if exists
    if (status && status !== TRANSLATION_STATUS.ALL) {
        filterParts.push(sfEqual('status', status).toString());
    }

    // Add isHome filter if exists and not ALL
    if (isHome !== undefined && isHome !== ALL_ITEM.key) {
        filterParts.push(sfEqual('isHome', isHome).toString());
    }

    // Add search filter if exists
    if (search) {
        const searchFilterParts = searchFields.map(field => sfLike(field, search));
        const searchFilter = sfOr(searchFilterParts).toString();
        filterParts.push(searchFilter);
    }

    // Combine all filters with AND operator
    return filterParts.length > 0 ? filterParts.join(' and ') : '';
};