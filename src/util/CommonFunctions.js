// import Api from "../dhis/api";

import { message } from "antd";
class CommonFunctions {
  //prepare org block units IDs
  prepOuIDs(orgUnits) {
    let preparedOUs = [];
    orgUnits.organisationUnits.forEach((epa) => {
      epa.children.forEach((section) => {
        section.children.forEach((block) => {
          preparedOUs.push(block.id);
        });
      });
    });

    return this.prepOuIDsDHISComp(preparedOUs);
  }
  prepOuIDsDHISComp(ous) {
    let string = "";
    ous.forEach((id) => {
      string += id + ";";
    });
    return string;
  }
  getDate() {
    var today = new Date();
    var day = today
      .getDate()
      .toLocaleString("en-US", { minimumIntegerDigits: 2, useGrouping: false });
    var month = (today.getMonth() + 1).toLocaleString("en-US", {
      minimumIntegerDigits: 2,
      useGrouping: false,
    });
    var year = today.getFullYear();
    return year + "-" + month + "-" + day;
  }
  //split name
  splitName(name) {
    let nameToSplit = name.split(" - ");
    return nameToSplit[nameToSplit.length - 1];
  }

  camelCase(str) {
    let c = str.toLowerCase().split("_");
    if (c.length == 1) {
      return c[0];
    } else if (c.length == 2) {
      return c[0] + (c[1].charAt(0).toUpperCase() + c[1].slice(1));
    } else {
      return (
        c[0] +
        (c[1].charAt(0).toUpperCase() + c[1].slice(1)) +
        (c[2].charAt(0).toUpperCase() + c[2].slice(1))
      );
    }
  }
  prepareTei(teiInstances, ou) {
    let trackedEntityInstances = [];
    let name = "";
    ou.organisationUnits.forEach((epa) => {
      epa.children.forEach((section) => {
        section.children.forEach(function (block, x) {
          trackedEntityInstances.push({ block: block.name, households: [] });
          for (let i = 0; i < teiInstances.rows.length; i++) {
            if (block.name == teiInstances.rows[i][4]) {
              if (teiInstances.rows[i][8] == "") {
                name = "No Name";
              } else {
                name = teiInstances.rows[i][8];
              }
              trackedEntityInstances[x].households.push({
                serial: i + 1,
                id: teiInstances.rows[i][0],
                name: name,
              });
            }
          }
        });
      });
    });

    // for (let i = 0; i < teiInstances.rows.length; i++) {
    //     if (teiInstances.rows[i][8] == "") {
    //         name = 'No Name'
    //     } else {
    //         name = teiInstances.rows[i][8]
    //     }
    //     trackedEntityInstances.push({'serial': i+1, 'id':teiInstances.rows[i][0],'name':name})
    // }
    return trackedEntityInstances;
  }

  prepareTeiIds(teiInstances) {
    let idConcatenated = "";
    teiInstances.map((insta) => {
      insta.households.map((household) => {
        idConcatenated += household.id + ";";
      });
    });
    return idConcatenated;
  }

  prepareTeiCategory(tei, programDetails) {
    let crops = [];
    let prepData = [];
    let livestocks = [];
    let fisheries = [];
    let horticultureHH = [];
    let pineapple = [];
    let banana = [];
    let focusDataElements = [
      "q2qVtSfrYkN",
      "tKsCpPkGeG8",
      "Hfl6qe1ClKg",
      "H7njEjkGf3R",
      "eWKyudJoI8p",
      "JGTnKUDoCTi",
    ];

    let restructuredTrackedEntities = [];
    tei.forEach((trakedEntity) => {
      let trakedEntityHouseholdIds = [];
      trakedEntity.households.forEach((houseHold) => {
        trakedEntityHouseholdIds.push(houseHold.id);
      });
      restructuredTrackedEntities.push({
        ...trakedEntity,
        householdIds: trakedEntityHouseholdIds,
      });
    });

    restructuredTrackedEntities.forEach((entity) => {
      entity.households.forEach((household) => {
        programDetails.forEach((programDetail) => {
          if (
            entity.householdIds.includes(programDetail.trackedEntityInstance)
          ) {
            programDetail.enrollments.forEach((enrollment) => {
              enrollment.events.forEach((event) => {
                event.dataValues.forEach((dataValue) => {
                  if (
                    focusDataElements[0] === dataValue.dataElement &&
                    eval(dataValue.value)
                  ) {
                    entity.otherAttributes = programDetail.attributes;
                    crops.push(entity);
                  }
                  if (
                    focusDataElements[1] === dataValue.dataElement &&
                    eval(dataValue.value)
                  ) {
                    household.otherAttributes = programDetail.attributes;
                    livestocks.push(entity);
                  }
                  if (
                    focusDataElements[2] === dataValue.dataElement &&
                    eval(dataValue.value)
                  ) {
                    entity.otherAttributes = programDetail.attributes;
                    fisheries.push(entity);
                  }
                  //general horticulture crops
                  if (
                    focusDataElements[3] === dataValue.dataElement &&
                    eval(dataValue.value)
                  ) {
                    entity.otherAttributes = programDetail.attributes;
                    horticultureHH.push(entity);
                  }
                  //pineapple
                  if (
                    focusDataElements[4] === dataValue.dataElement &&
                    eval(dataValue.value)
                  ) {
                    entity.otherAttributes = programDetail.attributes;
                    pineapple.push(entity);
                  }
                  //banana
                  if (
                    focusDataElements[5] === dataValue.dataElement &&
                    eval(dataValue.value)
                  ) {
                    entity.otherAttributes = programDetail.attributes;
                    banana.push(entity);
                  }
                });
              });
            });
          }
        });
      });
    });

    let dinstinctCrops = [...new Set(crops.map((crop) => crop))];
    let dinstinctlivestockHH = [
      ...new Set(livestocks.map((livestock) => livestock)),
    ];
    let dinstinctHorticultureHH = [
      ...new Set(horticultureHH.map((horticulture) => horticulture)),
    ];

    let dinstinctBananaHH = [...new Set(banana.map((banana) => banana))];
    let dinstinctPineAppleHH = [
      ...new Set(pineapple.map((pineapple) => pineapple)),
    ];
    prepData.push({
      allHorticulture: dinstinctHorticultureHH,
      banana: dinstinctBananaHH,
      pineapple: dinstinctPineAppleHH,
      crops: dinstinctCrops,
      livestockHouseholds: dinstinctlivestockHH,
    });

    console.log(prepData);
  }
  // async prepareTeiCategory(tei) {
  //   let prepData = [];
  //   let crops = [];
  //   let livestocks = [];
  //   let fisheries = [];
  //   let horticultureHH = [];
  //   let pineapple = [];
  //   let banana = [];
  //   let focusDataElements = [
  //     "q2qVtSfrYkN",
  //     "tKsCpPkGeG8",
  //     "Hfl6qe1ClKg",
  //     "H7njEjkGf3R",
  //     "eWKyudJoI8p",
  //     "JGTnKUDoCTi",
  //   ];

  //   for (let i = 0; i < tei.length; i++) {
  //     if (entity.households.length == 0) {
  //     } else {
  //       for (let w = 0; w < tei[i].households.length; w++) {
  //         let teiMeta = Api.getTrackedEntityProgramData(
  //           tei[i].households[w].id
  //         );
  //         let data = await teiMeta;

  //         /** checking all the enlroments insterd of the frist on and checkin all the event
  //          *
  //          * this can be optmised
  //          *
  //          */
  //         for (let x = 0; x < data.enrollments.length; x++) {
  //           for (let y = 0; y < data.enrollments[x].events.length; y++) {
  //             for (
  //               let z = 0;
  //               z < data.enrollments[x].events[y].dataValues.length;
  //               z++
  //             ) {
  //               let dataValue = data.enrollments[x].events[y].dataValues[z];

  //               if (
  //                 focusDataElements[0] === dataValue.dataElement &&
  //                 eval(dataValue.value)
  //               ) {
  //               entity.otherAttributes = data.attributes;
  //                 crops.push(tei[i]);
  //               }
  //               if (
  //                 focusDataElements[1] === dataValue.dataElement &&
  //                 eval(dataValue.value)
  //               ) {
  //                 tei[i].households[w].otherAttributes = data.attributes;
  //                 livestocks.push(tei[i]);
  //               }
  //               if (
  //                 focusDataElements[2] === dataValue.dataElement &&
  //                 eval(dataValue.value)
  //               ) {
  //                 tei[i].otherAttributes = data.attributes;
  //                 fisheries.push(tei[i]);
  //               }
  //               //general horticulture crops
  //               if (
  //                 focusDataElements[3] === dataValue.dataElement &&
  //                 eval(dataValue.value)
  //               ) {
  //                 tei[i].otherAttributes = data.attributes;
  //                 horticultureHH.push(tei[i]);
  //               }
  //               //pineapple
  //               if (
  //                 focusDataElements[4] === dataValue.dataElement &&
  //                 eval(dataValue.value)
  //               ) {
  //                 tei[i].otherAttributes = data.attributes;
  //                 pineapple.push(tei[i]);
  //               }
  //               //banana
  //               if (
  //                 focusDataElements[5] === dataValue.dataElement &&
  //                 eval(dataValue.value)
  //               ) {
  //                 tei[i].otherAttributes = data.attributes;
  //                 banana.push(tei[i]);
  //               }
  //             }
  //           }
  //         }
  //       }
  //     }
  //   }
  //   // console.log(crops);

  //   let dinstinctFarmingHH = [...new Set(crops.map((crop) => crop))];
  //   let dinstinctlivestockHH = [
  //     ...new Set(livestocks.map((livestock) => livestock)),
  //   ];
  //   let dinstinctHorticultureHH = [
  //     ...new Set(horticultureHH.map((horticulture) => horticulture)),
  //   ];

  //   // console.log(dinstinctFarmingHH);

  //   prepData.push({
  //     allHorticulture: dinstinctHorticultureHH,
  //     banana: banana,
  //     pineapple: pineapple,
  //     crops: dinstinctFarmingHH,
  //     livestockHouseholds: dinstinctlivestockHH,
  //   });
  //   return prepData;
  // }
  // async enrollmentFunctionHorticulture(program, household) {
  //   let attributes = await Api.getProgramAttributes(program.id);
  //   let attributesTopush = [];

  //   attributes.programTrackedEntityAttributes.forEach((element) => {
  //     household.otherAttributes.forEach((attribute) => {
  //       if (attribute.displayName == element.trackedEntityAttribute.name) {
  //         attributesTopush.push({
  //           attribute: element.trackedEntityAttribute.id,
  //           value: attribute.value,
  //         });
  //       }
  //     });
  //   });
  //   let attributeId =
  //     attributes.programTrackedEntityAttributes[0].trackedEntityAttribute.id;
  //   let firstProgramStageId = attributes.programStages[0].id;

  //   let trackedEntityInstance = await Api.getTrackedEntity(household.id);
  //   // trackedEntityInstance.attributes.push({"attribute": attributeId,"value": household.name})
  //   trackedEntityInstance.attributes = attributesTopush;

  //   message.info("Enlroling to " + attributes.name);

  //   //put
  //   let updateEntity = await Api.updateTrackedEntity(
  //     household.id,
  //     trackedEntityInstance
  //   );

  //   if (updateEntity.httpStatus == "OK") {
  //     message.success(household.name + " Updated");
  //     //if its ok

  //     //enrollment
  //     let enrollmentLoad = {
  //       trackedEntityInstance: household.id,
  //       program: program.id,
  //       status: "ACTIVE",
  //       orgUnit: trackedEntityInstance.orgUnit,
  //       enrollmentDate: this.getDate(),
  //       incidentDate: this.getDate(),
  //     };

  //     let enrollment = await Api.enrollment(enrollmentLoad);

  //     if (enrollment.httpStatus == "OK") {
  //       message.success(household.name + " enrolled");

  //       let event = {
  //         events: [
  //           {
  //             trackedEntityInstance: household.id,
  //             program: program.id,
  //             programStage: firstProgramStageId,
  //             orgUnit: trackedEntityInstance.orgUnit,
  //             enrollment: enrollment.response.importSummaries[0].reference,
  //             dueDate: this.getDate(),
  //             status: "SCHEDULE",
  //           },
  //         ],
  //       };
  //       let eventResponse = await Api.scheduleEvents(event);

  //       if (eventResponse.httpStatus == "OK") {
  //         message.success(household.name + " Assigned");
  //       } else {
  //         message.error(household.name + " not assign Assigned");
  //       }
  //     } else if (enrollment.httpStatus == "Conflict") {
  //       message.warning(household.name + " already Assigned");
  //       return;
  //     } else {
  //       message.error(household.name + " not  enrolled");
  //     }
  //   } else {
  //     message.error(household.name + " not updated");
  //   }
  // }

  async horticultureEnrollment(programs, householdList) {
    for (let household of householdList.pineappleBananaHH) {
      for (let program of programs.bananaPineapple) {
        await this.enrollmentFunctionHorticulture(program, household);
      }
    }

    for (let household of householdList.generalHorticultureHH) {
      for (let program of programs.generalHolticulture) {
        await this.enrollmentFunctionHorticulture(program, household);
      }
    }
  }

  containsObject(obj, list) {
    var i;
    for (i = 0; i < list.length; i++) {
      if (list[i].attribute == obj.attribute && list[i].value == obj.value) {
        return true;
      }
    }

    return false;
  }

  // async landingProgram(programId, householdList, programSpecificHouseholds) {
  //   for (let element of householdList) {
  //     let attributes = await Api.getProgramAttributes(programId);

  //     let attributesTopush = [];

  //     attributes.programTrackedEntityAttributes.forEach((ele) => {
  //       if ("otherAttributes" in element) {
  //         element.otherAttributes.forEach((attribute) => {
  //           if (attribute.displayName == ele.trackedEntityAttribute.name) {
  //             attributesTopush.push({
  //               attribute: ele.trackedEntityAttribute.id,
  //               value: attribute.value,
  //             });
  //           }
  //         });
  //       } else {
  //         let attributeId =
  //           attributes.programTrackedEntityAttributes[0].trackedEntityAttribute
  //             .id;
  //         let temp = { attribute: attributeId, value: element.name };

  //         if (!this.containsObject(temp, attributesTopush)) {
  //           attributesTopush.push({
  //             attribute: attributeId,
  //             value: element.name,
  //           });
  //         }
  //       }
  //     });

  //     let firstProgramStageId = attributes.programStages[0].id;

  //     if (programSpecificHouseholds.indexOf(element) == -1) {
  //       let trackedEntityInstance = await Api.getTrackedEntity(element.id);
  //       trackedEntityInstance.attributes = attributesTopush;

  //       message.info("Enlroling to " + attributes.name);
  //       //put
  //       let updateEntity = await Api.updateTrackedEntity(
  //         element.id,
  //         trackedEntityInstance
  //       );

  //       if (updateEntity.httpStatus == "OK") {
  //         message.success(element.name + " Updated");
  //         //if its ok

  //         //enrollment
  //         let enrollmentLoad = {
  //           trackedEntityInstance: element.id,
  //           program: programId,
  //           status: "ACTIVE",
  //           orgUnit: trackedEntityInstance.orgUnit,
  //           enrollmentDate: this.getDate(),
  //           incidentDate: this.getDate(),
  //         };

  //         let enrollment = await Api.enrollment(enrollmentLoad);

  //         if (enrollment.httpStatus == "OK") {
  //           // if (1){

  //           message.success(element.name + " enrolled");

  //           let event = {
  //             events: [
  //               {
  //                 trackedEntityInstance: element.id,
  //                 program: programId,
  //                 programStage: firstProgramStageId,
  //                 orgUnit: trackedEntityInstance.orgUnit,
  //                 enrollment: enrollment.response.importSummaries[0].reference,
  //                 dueDate: this.getDate(),
  //                 status: "SCHEDULE",
  //               },
  //             ],
  //           };
  //           let eventResponse = await Api.scheduleEvents(event);

  //           if (eventResponse.httpStatus == "OK") {
  //             message.success(element.name + " Assigned");
  //           } else {
  //             message.error(element.name + " not assign Assigned");
  //           }
  //         } else if (enrollment.httpStatus == "Conflict") {
  //           message.warning(element.name + " already Assigned");
  //         } else {
  //           message.error(element.name + " not  enrolled");
  //         }
  //       } else {
  //         message.error(element.name + " not updated");
  //       }
  //     }
  //   }
  // }

  // async programEnrolloment(
  //   programIds,
  //   programSpecificHouseholds,
  //   landingProgramId,
  //   autoFillPayload
  // ) {
  //   //get programm details
  //   let livestockId = await Api.getLivestockForms();
  //   for (let index = 0; index < livestockId.length; index++) {
  //     let programId = livestockId[index];

  //     let attributes = await Api.getProgramAttributes(programId);
  //     let attributeId =
  //       attributes.programTrackedEntityAttributes[0].trackedEntityAttribute.id;

  //     // let firstProgramStageId = attributes.programStages[0].id
  //     // let attributeId = attributes.programTrackedEntityAttributes[0].trackedEntityAttribute.id

  //     for (let element of programSpecificHouseholds) {
  //       let attributesTopush = [];

  //       attributes.programTrackedEntityAttributes.forEach((ele) => {
  //         if ("otherAttributes" in element) {
  //           element.otherAttributes.forEach((attribute) => {
  //             if (attribute.displayName == ele.trackedEntityAttribute.name) {
  //               attributesTopush.push({
  //                 attribute: ele.trackedEntityAttribute.id,
  //                 value: attribute.value,
  //               });
  //             }
  //           });
  //         } else {
  //           let attributeId =
  //             attributes.programTrackedEntityAttributes[0]
  //               .trackedEntityAttribute.id;

  //           let temp = {
  //             attribute: attributeId,
  //             value: element.household.name,
  //           };
  //           if (!this.containsObject(temp, attributesTopush)) {
  //             attributesTopush.push({
  //               attribute: attributeId,
  //               value: element.household.name,
  //             });
  //           }
  //         }
  //       });
  //       let trackedEntityInstance = await Api.getTrackedEntity(
  //         element.household.id
  //       );

  //       trackedEntityInstance.attributes = attributesTopush;

  //       message.info("Enrolling to " + attributes.name);
  //       //put

  //       let updateEntity = await Api.updateTrackedEntity(
  //         element.household.id,
  //         trackedEntityInstance
  //       );

  //       if (updateEntity.httpStatus == "OK") {
  //         message.success(element.household.name + " Updated");
  //         //if its ok

  //         //enrollment
  //         let enrollmentLoad = {
  //           trackedEntityInstance: element.household.id,
  //           program: programId,
  //           status: "ACTIVE",
  //           orgUnit: trackedEntityInstance.orgUnit,
  //           enrollmentDate: this.getDate(),
  //           incidentDate: this.getDate(),
  //         };

  //         let enrollment = await Api.enrollment(enrollmentLoad);

  //         if (enrollment.httpStatus == "OK") {
  //           message.success(element.household.name + " enrolled");
  //           for (let m = 0; m < attributes.programStages.length; m++) {
  //             let firstProgramStageId = attributes.programStages[m].id;
  //             let event = {
  //               events: [
  //                 {
  //                   trackedEntityInstance: element.household.id,
  //                   program: programId,
  //                   programStage: firstProgramStageId,
  //                   orgUnit: trackedEntityInstance.orgUnit,
  //                   enrollment:
  //                     enrollment.response.importSummaries[0].reference,
  //                   dueDate: this.getDate(),
  //                   status: "SCHEDULE",
  //                 },
  //               ],
  //             };
  //             let eventResponse = await Api.scheduleEvents(event);

  //             /***
  //              * if the program is form A1- A6
  //              * all housh should be enlored in this program
  //              * only those with livestork to be true
  //              *
  //              * to do
  //              *
  //              * ids of program, programStage and dataelement value to be dynamic
  //              */
  //             if (programId == landingProgramId) {
  //               let newEVent = await Api.getId();
  //               let newEVentId = newEVent.codes[0];

  //               let payloadWithValuses = {
  //                 event: newEVentId,
  //                 program: programId,
  //                 programStage: firstProgramStageId,
  //                 orgUnit: trackedEntityInstance.orgUnit,
  //                 trackedEntityInstance: element.household.id,
  //                 status: "COMPLETED",
  //                 dueDate: this.getDate(),
  //                 eventDate: this.getDate(),
  //                 completedDate: this.getDate(),
  //               };
  //               payloadWithValuses.dataValues = autoFillPayload;

  //               let eventResponseLivestork = await Api.putEvent(
  //                 newEVentId,
  //                 payloadWithValuses
  //               );

  //               if (eventResponseLivestork.httpStatus == "OK") {
  //                 message.success(element.household.name + " ---- Assigned");
  //               }
  //             }

  //             if (eventResponse.httpStatus == "OK") {
  //               message.success(element.household.name + " Assigned");
  //             } else {
  //               message.error(element.household.name + " not assign Assigned");
  //             }
  //           }
  //         } else if (enrollment.httpStatus == "Conflict") {
  //           message.warning(element.household.name + " already Assigned");
  //         } else {
  //           message.error(element.household.name + " not  enrolled");
  //         }
  //       } else {
  //         message.error(element.household.name + " not updated");
  //       }
  //     }
  //     if (programIds.length == index + 1) {
  //       alert("Enlroments complete");
  //     }
  //   }
  //  }
  horticultureSampling(allHorticultureHH) {
    function randomNumber(min, max) {
      const r = Math.random() * 100;
      return Math.floor(r) % max;
    }
    let randomIndex = [];
    if (allHorticultureHH.length < 3) {
      for (var i = 0; i < allHorticultureHH.length; i++) {
        randomIndex.push(i);
      }
    } else {
      while (randomIndex.length != 3) {
        let rand = randomNumber(0, allHorticultureHH.length);

        if (randomIndex.indexOf(rand) == -1) {
          randomIndex.push(rand);
        }
      }
    }
    let sampledHH = [];
    for (let index = 0; index < randomIndex.length; index++) {
      sampledHH.push(allHorticultureHH[randomIndex[index]]);
    }

    return sampledHH;
  }
}
export default new CommonFunctions();
