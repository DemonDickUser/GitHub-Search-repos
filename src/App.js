import "./App.css";
import { Octokit } from "@octokit/core";
import { useEffect, useState } from "react";
import Table from "./components/Table";
import Graph from "./components/Graph";
import { DropDown, Input, Loading } from "./components/Reusables";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

function App() {
  //
  const [searchInput, setSearchInput] = useState("");
  const [autoComplete, setAutoComplete] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAutoComplete, setShowAutoComplete] = useState(false);
  const [fData, setFData] = useState([]);
  const [dataReady, setDataReady] = useState(false);

  //

  //
  const octokit = new Octokit({
    auth: "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",
  });

  const fetchData = async () => {
    if (searchInput !== "") {
      setLoading(true);

      try {
        const response = await octokit.request("GET /orgs/{org}", {
          org: searchInput,
        });
        //

        setAutoComplete(response.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
      }
    }
  };

  useEffect(() => {
    fetchData();
    setLoading(false);
  }, [searchInput]);
  //

  // ----------functions

  //
  return (
    <div className="App">
      <Router>
        <header className="header">
          <Input
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
        {showAutoComplete && searchInput !== "" && (
          <Link to={`/${autoComplete?.name}`}>
            <div className="autoCompleteText">
              <DropDown
                text={autoComplete?.name}
                onClick={() => {
                  const uri = autoComplete?.repos_url;
                  const array = [];
                  fetch(uri)
                    .then((e) => {
                      return e.json();
                    })
                    .then((e) => {
                      e.map((e) => {
                        //----closed issues url

                        const url = `${e.issues_url.slice(
                          0,
                          e.issues_url.length - 9
                        )}?state=closed`;

                        const fetchClosedIssues = async () => {
                          const dataFetch = await fetch(url);
                          const response = await dataFetch.json();
                          return response.length;
                        };

                        fetchClosedIssues()
                          .then((closedIssues) => {
                            array.push({
                              openIssues: e.open_issues,
                              issues: e.open_issues + closedIssues,
                              closedIssues: closedIssues,
                              name: e.full_name,
                              stars: e.stargazers_count,
                            });
                            setDataReady(true);
                          })
                          .catch((err) => console.error(err));
                      });
                      setFData(array);
                    })
                    .catch((e) => console.error(e));
                }}
                key={autoComplete?.id}
                className="list"
              />
            </div>
          </Link>
        )}
        {loading ? (
          <Loading />
        ) : (
          <div className="bodyContainer">
            <Switch>
              <Route path={"/:id"}>
                <Table loading={dataReady} fakeData={[fData]} />
                <Graph fakeData={fData} />
              </Route>
              <Route path={"/"}>
                <Table fakeData={[]} />
                <Graph fakeData={[]} />
              </Route>
            </Switch>
          </div>
        )}
      </Router>
    </div>
  );
}

export default App;
