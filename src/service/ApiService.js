import { programId } from "../util/Constants";
import React, { Component } from "react";
import { useDataQuery } from "@dhis2/app-runtime";
export const getUserOu = {
  ou: {
    resource:
      "me.json?fields=id,organisationUnits[id,name,level,children[id,name,level,children[id,name,level]]]",
  },
};

export const getTrackedEntitties = {
  trackedEntitties: {
    resource: "trackedEntityInstances/query.json",
    params: ({ ouIds }) => ({
      ou: `${ouIds}`,
      program: programId,
      ouMode: "SELECTED",
      order: "created:desc",
      paging: false,
    }),
  },
};
export const getTrackedEntityProgramData = {
  teProgramData: {
    resource: "trackedEntityInstances",
    params: ({ teiIds }) => ({
      trackedEntityInstance: `${teiIds}`,
      program: programId,
      fields: [
        "attributes[attribute,displayName,value,valueType],enrollments[enrollment,events[event,dataValues[dataElement,value]]]",
        "orgUnit",
      ],
    }),

    //"&fields=attributes[attribute,displayName,value,valueType],enrollments[enrollment,events[event,dataValues[dataElement,value]]],orgUnit",
  },
};

const getProgramsToAssign = {
  apesProgram: {
    resource: "dataStore/apesBlockPrograms/apesBlockPrograms.json",
  },
};

const getProgramDetails = {
  programDetails: {
    resource: "programs.json",
    params: ({ ids }) => ({
      fields: "*",
      filter: `id:in:[${ids}]`,
      paging: false,
    }),
  },
};

const assignOrgsToPrograms = {
  resource: "metadata.json",
  type: "create",
  data: ({ data }) => data,
};

// const getProgramAttributes = {
//   programAttributes: {
//     resource:
//       "programs/" +
//       id +
//       ".json?fields=id,name,programStages[id],programTrackedEntityAttributes[id,name,trackedEntityAttribute[id,name]]",
//   },
// };

class Api extends Component {
  pullSingleTPro(id) {
    return {
      resource: "trackedEntityInstances",
      params: ({ teiIds }) => ({
        trackedEntityInstance: `${id}`,
        program: programId,
        fields: [
          "attributes[attribute,displayName,value,valueType],enrollments[enrollment,events[event,dataValues[dataElement,value]]]",
          "orgUnit",
        ],
      }),

      //"&fields=attributes[attribute,displayName,value,valueType],enrollments[enrollment,events[event,dataValues[dataElement,value]]],orgUnit",
    };
  }
}

export default new Api();
