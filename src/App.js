import "./App.css";
import { Octokit } from "@octokit/core";
import { useEffect, useState } from "react";
import Table from "./components/Table";
import Graph from "./components/Graph";

function App() {
  //
  const [searchInput, setSearchInput] = useState("");
  const [autoComplete, setAutoComplete] = useState([]);
  const [showAutoComplete, setShowAutoComplete] = useState(false);
  const [fData, setFData] = useState([]);

  //
  const octokit = new Octokit({
    auth: process.env.REACT_APP_PAT,
  });

  const fetchData = async () => {
    if (searchInput !== "") {
      try {
        const response = await octokit.request("GET /search/issues", {
          q: searchInput,
        });
        return response;
      } catch (err) {
        console.error(err);
      }
    }
  };

  useEffect(() => {
    fetchData()
      .then((e) => setAutoComplete(e?.data.items))
      .catch((err) => console.error(err));
  }, [searchInput]);
  //

  // ----------functions

  //
  return (
    <div className="App">
      <header className="header">
        <input
          placeholder="Search Organizations"
          onFocus={() => setShowAutoComplete(true)}
          onBlur={() =>
            setTimeout(() => {
              setShowAutoComplete(false);
            }, 1000)
          }
          onChange={(e) => setSearchInput(e.target.value)}
          className="searchInput"
        />
      </header>
      {showAutoComplete && (
        <div className="autoCompleteText">
          {autoComplete?.map((e) => (
            <span
              onClick={() => {
                const uri = e.user.repos_url;
                const array = [];
                fetch(uri)
                  .then((e) => {
                    return e.json();
                  })
                  .then((e) => {
                    array.push(
                      e.map((e) => {
                        return {
                          openIssues: e.open_issues,
                          issues: e.open_issues_count,
                          closedIssues: e.open_issues_count - e.open_issues,
                          name: e.full_name,
                          stars: e.stargazers_count,
                        };
                      })
                    );
                    setFData(array);
                  })
                  .catch((e) => console.error(e));
              }}
              key={e.id}
              className="list"
            >
              {e.title}
            </span>
          ))}
        </div>
      )}
      <div className="bodyContainer">
        <Table fakeData={fData} />
        <Graph fakeData={fData} />
      </div>
    </div>
  );
}

export default App;
