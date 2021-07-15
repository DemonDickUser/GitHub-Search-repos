import React, { useEffect, useState } from "react";
import Chart from "react-google-charts";
import "./style.css";

const Graph = ({ fakeData }) => {
  //

  const [graphData, setGraphData] = useState();
  const setData = () => {
    let data = [
      ["Closed issues", "Well maintained", "just maintained", "Not Maintained"],
    ];
    fakeData.map((e) =>
      e.map((e) => {
        if (e.issues * 0.1 > e.openIssues) {
          data.push([e.openIssues, e.closedIssues, null, null]);
        }
        if (e.issues * 0.25 > e.openIssues) {
          data.push([e.openIssues, null, e.closedIssues, null]);
        } else {
          data.push([e.openIssues, null, null, e.closedIssues]);
        }
      })
    );
    data.push([0, 0, 0, 0]);

    return data;
  };

  //----------useEffect-hook

  useEffect(() => {
    setGraphData(setData());
    console.log(setData());
  }, [fakeData]);

  return (
    <div className="rightContent">
      <select>
        <option value="scatter dot plot">scatter dot plot</option>
        <option value="Pie chart">Pie chart</option>
      </select>
      <Chart
        width={"600px"}
        height={"400px"}
        chartType="ScatterChart"
        loader={<div>Loading Chart</div>}
        data={graphData}
        options={{
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
            ticks: [0, 10, 100, 1000],
          },
          vAxis: {
            title: "Open issues",
            legend: "none",
            scaleType: "log",
            viewWindow: {
              max: 1000,
              min: 0,
            },
            gridlines: {
              color: "none",
            },
            ticks: [0, 10, 100, 1000],
          },
          colors: ["green", "yellow", "red"],
        }}
        rootProps={{ "data-testid": "1" }}
      />
    </div>
  );
};

export default Graph;
