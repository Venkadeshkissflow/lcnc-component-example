import React, { useState, useEffect } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { kf } from "@/sdk";

export function WorkLoadTable() {
  const { _id: appId } = kf.app;

  const [sprintInfo, setSprintInfo] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [sprintId, setSprintId] = React.useState(null);

  useEffect(() => {
    kf.context.watchParams((data) => {
      if (data.sprintId) {
        console.log("sprint id by venkadesh", data.sprintId);
        setSprintId(data.sprintId);
      }
    });
  }, []);

  function getWorkLoad(taskList) {
    const workLoad = {};
    taskList.map((taskInfo) => {
      if (taskInfo.Stackholders) {
        taskInfo.Stackholders.forEach((stackholder) => {
          const { Name: name, _id: empId } = stackholder;

          let isOldEmployee = Object.keys(workLoad).includes(empId);

          if (isOldEmployee) {
            workLoad[empId].workLoad += 1;
          } else {
            workLoad[empId] = {
              id: empId,
              name: name,
              workLoad: 1,
            };
          }
        });
      }
    });

    return workLoad;
  }

  function getAsignedFeatureCountApi() {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        apply_preference: true,
        page_number: 1,
        page_size: 10,
        _application_id: appId,
      }),
    };
    return kf.api(
      "https://development-work.kissflow.com/form/2/Ac5RzaoSc51T/Sprint_Feature_Mapping_A00/view/All_Item_View_A00/list",
      requestOptions
    );
  }

  function getSprintSpecificData(sprintInfo) {
    return sprintInfo.filter((data) => data.SprintId === sprintId);
  }

  // async function getInputParam() {
  //   let parameters = await kf.app.page.getParameter("sprintId");

  //   return parameters;
  // }

  useEffect(
    function onInit() {
      if (sprintId) {
        Promise.all([getAsignedFeatureCountApi()])
          .then((value) => {
            const [featureInfo] = value;
            console.log(featureInfo, "featureInfo");

            let featuresList = getSprintSpecificData(featureInfo?.Data);

            let featureWorkLoad = getWorkLoad(featuresList);
            setSprintInfo(featureWorkLoad);
            setIsLoading(false);
          })
          .catch((error) => {
            console.error(error, "error");
            setIsLoading(false);
          });
      }
    },
    [sprintId]
  );

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Features count</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading && <div>...loading</div>}

        {!isLoading &&
          Object.values(sprintInfo).map((employeeInfo) => (
            <TableRow key={employeeInfo.id}>
              <TableCell className="font-medium">{employeeInfo.name}</TableCell>
              <TableCell>{employeeInfo.workLoad}</TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
}
