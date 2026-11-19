"use client";

import React from "react";
import { Col, Empty, Row } from "antd";
import { map } from "lodash";
import { useRouter } from "next/navigation";

import FreePatternCard from "../free-pattern-card";
import HeaderPart from "../header-part";
import { ROUTE_PATH } from "@/app/lib/constant";
import ReadMoreBtn from "../read-more";
import { Pattern } from "@/app/lib/definitions";

const FreePatternsNode = ({ patterns }: { patterns: Pattern[] }) => {
  const router = useRouter();
  const onViewPattern = (id: React.Key) => {
    router.push(`${ROUTE_PATH.FREEPATTERNS}/${id}`);
  };

  return (
    <section className="patterns home-section">
      <HeaderPart
        titleId="Home.FreePattern.title"
        descriptionId="Home.FreePattern.description"
        actionNode={
          patterns?.length > 0 ? (
            <ReadMoreBtn path={ROUTE_PATH.FREEPATTERNS} />
          ) : undefined
        }
      />
      {patterns?.length > 0 ? (
        <Row
          gutter={[
            { xs: 12, sm: 16, xl: 24 },
            { xs: 20, sm: 24, xl: 28 },
          ]}
        >
          {map(patterns, (pattern, index) => (
            <Col
              key={pattern.id || `freepattern_${index}`}
              xs={12}
              sm={8}
              lg={6}
            >
              <FreePatternCard
                pattern={pattern}
                onReadDetail={() => onViewPattern(pattern.id || "")}
              />
            </Col>
          ))}
        </Row>
      ) : (
        <Empty
          imageStyle={{ height: 80 }}
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      )}
    </section>
  );
};

export default FreePatternsNode;
