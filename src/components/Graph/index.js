import React, { useEffect, useState } from "react";
import Chart from "react-google-charts";
import { DropDown, Loading, Select } from "../Reusables";
import "./style.css";

const Graph = ({ fakeData }) => {
  //

  const [graphData, setGraphData] = useState();
  const [chooseGraph, setChooseGraph] = useState(false);
  const [loadindGraph, setLoadindGraph] = useState(true);

  useEffect(() => {
    setLoadindGraph(true);

    setTimeout(() => {
      preData();
      setLoadindGraph(false);
    }, 5000);
  }, [fakeData]);

  const preData = () => {
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

    fakeData?.map((e) => {
      if (e.issues * 0.1 > e.openIssues) {
        dataArray.push([e.openIssues, e.closedIssues, null, null, null]);
      }
      if (e.issues * 0.25 > e.openIssues) {
        dataArray.push([e.openIssues, null, e.closedIssues, null, null]);
      } else {
        dataArray.push([e.openIssues, null, null, e.closedIssues, null]);
      }
    });

    setGraphData(dataArray);
  };

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
          <DropDown className="option" text={"Scatter dot plot"} />
          <DropDown className="option" text={"Pie Chart"} />
        </>
      )}

      {loadindGraph ? (
        <Loading />
      ) : (
        <Chart
          width={"100%"}
          height={"400px"}
          chartType="ScatterChart"
          loader={<div>Loading Chart</div>}
          data={graphData}
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
