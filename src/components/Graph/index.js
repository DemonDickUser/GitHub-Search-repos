import React, { useEffect, useState } from "react";
import Chart from "react-google-charts";
import { DropDown, Loading, Select } from "../Reusables";
import "./style.css";

const Graph = ({ fakeData }) => {
  //

  const [scatterData, setScatterData] = useState(null);
  const [timelineData, setTimelineData] = useState(null);
  const [graphType, setGraphType] = useState(false);
  const [chooseGraph, setChooseGraph] = useState(false);
  const [loadindGraph, setLoadindGraph] = useState(true);

  useEffect(() => {
    setLoadindGraph(true);

    setTimeout(() => {
      //prepare data for a specific graph

      const preData = () => {
        if (graphType) {
          const getYear = (date) => {
            return date.slice(0, 4);
          };

          const getMonth = (date) => {
            if (date.slice(5, 7).startsWith("0")) {
              return date.slice(6, 7);
            }
            return date.slice(5, 7);
          };

          const getDay = (date) => {
            if (date.slice(8, 10).startsWith("0")) {
              return date.slice(9, 10);
            }
            return date.slice(8, 10);
          };
          let dataArray = [
            [
              { type: "string", id: "Term" },
              { type: "string", id: "Name" },
              { type: "date", id: "Start" },
              { type: "date", id: "End" },
            ],
          ];

          //

          fakeData.forEach((e) => {
            dataArray.push([
              fakeData.indexOf(e).toString(),
              e.name,
              new Date(
                getYear(e.createdAt),
                getMonth(e.createdAt),
                getDay(e.createdAt)
              ),
              new Date(
                getYear(e.updatedAt),
                getMonth(e.updatedAt),
                getDay(e.updatedAt)
              ),
            ]);
          });
          setTimelineData(dataArray);
        } else {
          let dataArray = [
            [
              "open issues",
              "Well maintained",
              "just maintained",
              "Not Maintained",
              "",
            ],
            [1000, 1000, 1000, 1000, 1000],
          ];

          //

          fakeData?.forEach((e) => {
            if (e.issues * 0.1 > e.openIssues) {
              dataArray.push([e.openIssues, e.closedIssues, null, null, null]);
            }
            if (e.issues * 0.25 > e.openIssues) {
              dataArray.push([e.openIssues, null, e.closedIssues, null, null]);
            } else {
              dataArray.push([e.openIssues, null, null, e.closedIssues, null]);
            }
          });

          setScatterData(dataArray);
        }
      };
      preData();
      setLoadindGraph(false);
    }, 5000);
  }, [fakeData, graphType]);

  //----------useEffect-hook

  return (
    <div className="rightContent">
      <Select
        text="Select a graph"
        className="select"
        onClick={() => setChooseGraph(!chooseGraph)}
      />
      {chooseGraph && (
        <>
          <DropDown
            onClick={() => {
              setGraphType(false);
              setChooseGraph(!chooseGraph);
            }}
            className="option"
            text={"Scatter dot plot"}
          />
          <DropDown
            onClick={() => {
              setGraphType(true);
              setChooseGraph(!chooseGraph);
            }}
            className="option"
            text={"Timeline Chart"}
          />
        </>
      )}

      {loadindGraph ? (
        <Loading />
      ) : graphType ? (
        <Chart
          width={"100%"}
          chartType="Timeline"
          height={"100%"}
          loader={<div>Loading Chart</div>}
          data={timelineData}
          options={{
            showRowNumber: true,
            allowHtml: true,
            timeline: {
              singleColor: "#0085FF",
              showRowLabels: false,
            },
          }}
          rootProps={{ "data-testid": "1" }}
        />
      ) : (
        <Chart
          width={"100%"}
          height={"400px"}
          chartType="ScatterChart"
          loader={<div>Loading Chart</div>}
          data={scatterData}
          options={{
            legend: "none",
            interpolateNulls: true,
            hAxis: {
              title: "Closed issues",
              scaleType: "log",
              viewWindow: {
                max: 1000,
                min: 0,
              },
              gridlines: {
                color: "none",
              },
              ticks: [0, 1, 10, 100],
            },
            vAxis: {
              title: "Open issues",
              scaleType: "log",
              viewWindow: {
                max: 1000,
                min: 0,
              },
              gridlines: {
                color: "none",
              },
              ticks: [0, 1, 10, 100, 1000],
            },
            colors: ["green", "yellow", "red", "white"],
          }}
          rootProps={{ "data-testid": "1" }}
        />
      )}
    </div>
  );
};

export default Graph;
