import React, { useState } from "react";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import "./style.css";
import { useEffect } from "react";

const Table = ({ fakeData }) => {
  //

  const [sortIssues, setSortIssues] = useState(false);
  const [sortName, setSortName] = useState(false);
  const [sortStars, setSortStars] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    setData(fakeData);
  }, [fakeData]);
  //

  const sortByName = () => {
    setSortName(false);
    setSortStars(false);
    setSortName(true);

    fakeData.sort((a, b) => {
      const nameA = a.name.toUpperCase();
      const nameB = b.name.toUpperCase();
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
    });
  };
  const sortByIssues = () => {
    setSortName(false);
    setSortStars(false);
    setSortIssues(true);

    fakeData.sort((a, b) => {
      if (a.issues < b.issues) {
        return -1;
      }
      if (a.issues > b.issues) {
        return 1;
      }
    });
  };
  const sortByStars = () => {
    setSortName(false);
    setSortIssues(false);
    setSortStars(true);
    fakeData.sort((a, b) => {
      if (a.stars < b.stars) {
        return -1;
      }
      if (a.stars > b.stars) {
        return 1;
      }
    });
  };
  return (
    <div className="leftContent">
      <h3>name of Organization</h3>
      <div className="inputs">
        <div className="column-input">
          <label htmlFor="filterByName">Filter repository by name</label>
          <input placeholder="type of filter" id="filterByName" type="text" />
        </div>
        <div className="column-input">
          <label>filter by number of issues</label>
          <div className="row-input">
            <input className="min" placeholder="min" type="text" />
            <input className="max" placeholder="max" type="text" />
          </div>
        </div>
      </div>
      <table>
        <thead>
          <tr id="tableHeader">
            <th onClick={() => sortByName()} className="column1 filterHeader">
              <span>
                {" "}
                Repository
                {sortName && <ArrowDropDownIcon />}
              </span>
            </th>
            <th
              onClick={() => sortByIssues()}
              className="column1-2 filterHeader"
            >
              <span>Issues {sortIssues && <ArrowDropDownIcon />}</span>
            </th>
            <th
              onClick={() => sortByStars()}
              className="column1-2 filterHeader"
            >
              <span>Stars {sortStars && <ArrowDropDownIcon />}</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {data?.map((e) =>
            e.map((e) => (
              <tr key={Math.random() * 100}>
                <td className="column1">{e.name}</td>
                <td className="column1-2">{e.issues}</td>
                <td className="column1-2">{e.stars}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
