"use client";
import { Input, Flex, Col, Pagination, Empty, Row, Spin } from "antd";
import React, { useMemo, useState, useCallback } from "react";
import { SegmentedValue } from "antd/es/segmented";
import { useTranslations } from "next-intl";
import {
  ALL_ITEM,
  TRANSLATION_STATUS,
  TRANSLATION_OPTIONS,
} from "@/app/lib/constant";
import {
  DataType,
  Pattern,
  Post,
  Product,
  TabsItem,
  TDirection,
} from "@/app/lib/definitions";
import { mapTabsData, onScrollBody, debounce } from "@/app/lib/utils";
import ProductCard from "../product-card";
import FreePatternStatus from "../free-pattern-status";
import BlogCard from "../blog-card";
import FreePatternCard from "../free-pattern-card";
import CategoryMenu from "./categoryMenu";
import DirectionGroup from "./DirectionGroup";
import ListViewItem from "../list-view-item";
import "../../ui/components/viewTable.scss";

export interface ViewTableProps {
  dataSource: DataType[];
  mode: "Pattern" | "Product" | "Blog";
  total?: number;
  pageSize?: number;
  onPageChange: (page: number, pageSize: number) => void;
  onSearch?: (value: string) => void;
  pageIndex?: number;
  loading?: boolean;
  onReadDetail: (key: React.Key) => void;
  isShowTabs?: boolean;
  itemsTabs?: DataType[];
  onTabChange?: (key: React.Key) => void;
  onStatusFilter?: (value: SegmentedValue) => void;
  isShowStatusFilter?: boolean;
}

const ViewTable = ({
  dataSource,
  total = 0,
  pageSize = 12,
  onPageChange,
  onSearch,
  pageIndex = 0,
  itemsTabs = [],
  isShowTabs,
  mode,
  loading,
  isShowStatusFilter,
  onTabChange,
  onReadDetail,
  onStatusFilter,
}: ViewTableProps) => {
  const [direction, setDirection] = useState<TDirection>("horizontal");
  const { Search } = Input;

  const t = useTranslations("App");
  const tViewTable = useTranslations("ViewTable");

  const debouncedSearch = useCallback(
    debounce((value: string) => {
      if (onSearch instanceof Function) {
        onSearch(value);
        onScrollBody(".data-list");
      }
    }, 500),
    [onSearch]
  );

  const debouncedStatusChange = useCallback(
    debounce((value: SegmentedValue) => {
      if (onStatusFilter instanceof Function) {
        onStatusFilter(value);
      }
    }, 500),
    [onStatusFilter]
  );

  const onSearchBtn = (value: string) => {
    debouncedSearch(value);
  };

  const onChangeStatus = (value: SegmentedValue) => {
    debouncedStatusChange(value);
  };

  const onChange = (page: number, pageSize: number) => {
    if (onPageChange instanceof Function) {
      onPageChange(page, pageSize);
      onScrollBody(".data-list");
    }
  };

  const onClickMenu = (key: React.Key) => {
    if (onTabChange instanceof Function) {
      onTabChange(key);
    }
  };

  const items = useMemo(
    () => [
      {
        label: ALL_ITEM.key,
        key: ALL_ITEM.key,
      },
      ...mapTabsData(itemsTabs || []),
    ],
    [itemsTabs]
  );

  const getCardItem = useMemo(() => {
    const renderCardItem = (item: DataType) => {
      switch (mode) {
        case "Product":
          return (
            <ProductCard
              loading={loading}
              product={item as Product}
              onReadDetail={() => onReadDetail(item.key)}
            />
          );
        case "Pattern":
          return (
            <FreePatternCard
              loading={loading}
              pattern={item as Pattern}
              onReadDetail={() => onReadDetail(item.key)}
            />
          );
        default:
          return (
            <BlogCard
              item={item as Post}
              onReadDetail={() => onReadDetail(item.key)}
            />
          );
      }
    };
    return renderCardItem;
  }, [mode, loading, onReadDetail]);

  return (
    <div className="data-list">
      <div className="view-toolbar">
        <div className="search-wrap">
          <Search
            allowClear
            className="view-toolbar__search"
            placeholder={tViewTable("search_placeholder")}
            onSearch={onSearchBtn}
          />

          <div className="view-toolbar__controls">
            {isShowStatusFilter && (
              <FreePatternStatus
                className="large-screen"
                defaultValue={TRANSLATION_STATUS.ALL}
                onChange={onChangeStatus}
                options={TRANSLATION_OPTIONS}
              />
            )}

            <DirectionGroup direction={direction} setDirection={setDirection} />
          </div>
        </div>

        {isShowStatusFilter && (
          <FreePatternStatus
            className="small-screen"
            defaultValue={TRANSLATION_STATUS.ALL}
            onChange={onChangeStatus}
            options={TRANSLATION_OPTIONS}
          />
        )}

        {isShowTabs && items && (
          <CategoryMenu
            items={items as TabsItem[]}
            onClickMenu={(key) => onClickMenu(key)}
          />
        )}
      </div>

      <Spin spinning={loading} tip={t("loading")}>
        {direction === "vertical" ? (
          <Flex vertical className="list-view" gap={16}>
            {dataSource &&
              dataSource.map((item, index) => (
                <div
                  className="list-view-item"
                  key={item.key || `list-view-item-${index}`}
                >
                  <ListViewItem
                    data={item}
                    onReadDetail={() => onReadDetail(item.key)}
                  />
                </div>
              ))}
          </Flex>
        ) : (
          <Row
            gutter={[
              { xs: 12, sm: 16, xl: 24 },
              { xs: 20, sm: 24, xl: 28 },
            ]}
          >
            {dataSource &&
              dataSource.map((item, index) => (
                <Col
                  className="col-data"
                  key={item.key || `freepattern_${index}`}
                  xs={mode === "Blog" ? 24 : 12}
                  sm={mode === "Blog" ? 12 : 8}
                  lg={mode === "Blog" ? 8 : 6}
                >
                  {getCardItem(item)}
                </Col>
              ))}
          </Row>
        )}

        {dataSource?.length > 0 ? (
          <Pagination
            className="pagination"
            responsive
            total={total}
            {...(pageIndex !== -1 ? { current: pageIndex + 1 } : {})}
            pageSize={pageSize}
            showSizeChanger
            showQuickJumper
            showTotal={(total, range) =>
              `${range[0]}-${range[1]} of ${total} items`
            }
            onChange={onChange}
          />
        ) : (
          <Empty
            imageStyle={{ height: 80 }}
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        )}
      </Spin>
    </div>
  );
};

export default ViewTable;
