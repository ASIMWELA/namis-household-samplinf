import React, { useState, useEffect } from "react";
import {
  getUserOu,
  getTrackedEntitties,
  getTrackedEntityProgramData,
} from "../service/ApiService";
import { useDataQuery } from "@dhis2/app-runtime";
import { message } from "antd";
import CommonFunctions from "../util/CommonFunctions";
import Api from "../service/ApiService";

const HouseHoldListing = () => {
  const [ouIds, setOuIds] = useState();
  const [orgUnits, setOrgUnits] = useState();
  const [teiIds, setTeiIds] = useState();
  const [arrayedIds, setArrayedIds] = useState();
  const [allTeis, setAllTeis] = useState([]);
  const [hsId, setHis] = useState();
  const { loading: ouLoading, data: ouData } = useDataQuery(getUserOu, {
    onComplete: (data) => {
      setOuIds(CommonFunctions.prepOuIDs(data.ou));
      setOrgUnits(data.ou);
    },
    onError: (err) => {
      message.error("Something went wrong. Please try again");
    },
  });

  const { loading: teLoading, refetch: refetchTe } = useDataQuery(
    getTrackedEntitties,
    {
      variables: {
        ouIds: ouIds,
      },
      onComplete: (data) => {
        const teis = CommonFunctions.prepareTei(
          data.trackedEntitties,
          orgUnits
        );

        const teiIds = CommonFunctions.prepareTeiIds(teis);
        setTeiIds(teiIds);
        setAllTeis(teis);
      },
      onError: (err) => {
        message.error("Something went wrong. Please try again");
      },
    }
  );

  const { loading: teiProgramDataLoading, refetch: refetchTeiProgramData } =
    useDataQuery(getTrackedEntityProgramData, {
      variables: { teiIds: teiIds },
      onComplete: (data) => {
        const pulledD = data?.teProgramData?.trackedEntityInstances;

        CommonFunctions.prepareTeiCategory(allTeis, pulledD);
      },
    });

  useEffect(() => {
    if (ouIds) {
      refetchTe({ ouIds: ouIds });
    }
  }, [ouIds]);

  useEffect(() => {
    if (teiIds) {
      const ids = teiIds.split(";").slice(0, -1);
      setArrayedIds(ids);

      //  refetchTeiProgramData({ teiIds: teiIds });
    }
  }, [teiIds]);

  useEffect(() => {
    if (teiIds) {
      refetchTeiProgramData({ teiIds });
    }
  }, [teiIds]);

  return <div>Hello</div>;
};

export default HouseHoldListing;
