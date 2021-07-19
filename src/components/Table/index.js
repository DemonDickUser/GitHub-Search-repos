import React, { useState } from "react";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import "./style.css";
import { useEffect } from "react";
import { Tooltip } from "../Reusables";
import { Input } from "../Reusables";

const Table = ({ fakeData }) => {
  //

  const [sortIssues, setSortIssues] = useState(false);
  const [sortName, setSortName] = useState(false);
  const [sortStars, setSortStars] = useState(false);
  const [maxData, setMaxData] = useState(null);
  const [minData, setMinData] = useState(null);
  const [filterErr, setFilterErr] = useState(false);
  const [data, setData] = useState([]);
  const [filtRepo, setFiltRepo] = useState(null);

  //

  useEffect(() => {
    setTimeout(() => {
      setData(fakeData);
    }, 5000);
    setMaxData();
    setMinData();
  }, [fakeData]);
  //

  const sortByName = () => {
    if (sortName) {
      let reversedData = data.map((e) => e.reverse());
      setData(reversedData);
      return;
    }

    setSortIssues(false);
    setSortStars(false);

    //
    data.map((e) =>
      e.sort((a, b) => {
        const nameA = a.name.toUpperCase();
        const nameB = b.name.toUpperCase();
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
      })
    );
    setSortName(true);
  };
  //

  const sortByIssues = () => {
    //

    if (sortIssues) {
      let reversedData = data.map((e) => e.reverse());
      setData(reversedData);
      return;
    }

    setSortName(false);
    setSortStars(false);
    setSortIssues(true);

    data.map((e) =>
      e.sort((a, b) => {
        if (a.issues < b.issues) {
          return -1;
        }
        if (a.issues > b.issues) {
          return 1;
        }
      })
    );
    setData(data);
  };
  //

  const sortByStars = () => {
    //

    if (sortStars) {
      let reversedData = data.map((e) => e.reverse());
      setData(reversedData);
      return;
    }
    setSortName(false);
    setSortIssues(false);
    setSortStars(true);
    data.map((e) =>
      e.sort((a, b) => {
        //

        if (a.stars < b.stars) {
          return -1;
        }

        //...

        if (a.stars > b.stars) {
          return 1;
        }
      })
    );
    setData(data);
  };

  //

  useEffect(() => {
    const filtedData = fakeData.map((e) =>
      e.filter((e) => {
        if (e.name.match(filtRepo)) {
          return e;
        }
      })
    );
    setData(filtedData);
  }, [filtRepo]);

  //--------get inputs as integers
  const maxFilter = (e) => {
    setMaxData(parseInt(e.target.value));
  };
  const minFilter = (e) => {
    setMinData(parseInt(e.target.value));
  };

  //-------runs when max min value is changes
  useEffect(() => {
    //

    if (maxData > minData) {
      //-------filter if no error

      setFilterErr(false);

      //

      const data = fakeData.map((e) =>
        //
        e.filter((e) => {
          if (maxData !== undefined && minData !== undefined) {
            return e.issues >= minData && e.issues <= maxData;
          }
          if (maxData === undefined && minData !== undefined) {
            return e.issues >= minData;
          }
          if (maxData !== undefined && minData === undefined) {
            return e.issues <= maxData;
          }
        })
      );
      setData(data);
    }
    if (
      (minData === undefined && maxData === undefined) ||
      (minData === null && maxData === null) ||
      (minData === 0 && maxData === 0) ||
      (minData === "" && maxData === "")
    ) {
      setFilterErr(false);
      setData(fakeData);
      return;
    }

    //-----error-with-max-min

    if (maxData < minData) {
      setFilterErr(true);
    }
  }, [minData, maxData]);

  return (
    <div className="leftContent">
      <h3>name of Organization</h3>
      <div className="inputs">
        <div className="column-input">
          <label htmlFor="filterByName">Filter repository by name</label>
          <Input
            onChange={(e) => {
              setFiltRepo(e.target.value);
            }}
            placeholder="type of filter"
            id="filterByName"
            type="text"
          />
          {filtRepo && fakeData && (
            <Tooltip tip="Search for an organization first" />
          )}
        </div>
        <div className="column-input">
          <label>filter by number of issues</label>
          <div className="row-input">
            <Input
              onChange={minFilter}
              className="min"
              placeholder="min"
              type="number"
            />
            {filterErr && <Tooltip tip="Conflicting min and max values" />}
            <Input
              onChange={maxFilter}
              className="max"
              placeholder="max"
              type="number"
            />
          </div>
        </div>
      </div>
      <table>
        <thead>
          <tr id="tableHeader">
            <th onClick={() => sortByName()} className="column1 filterHeader">
              <span>
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
          {!filterErr &&
            data?.map((e) =>
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
