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
  const [searchResult, setSearchResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAutoComplete, setShowAutoComplete] = useState(false);
  const [fData, setFData] = useState([]);
  const [dataReady, setDataReady] = useState(false);

  //

  //

  useEffect(() => {
    const fetchData = async () => {
      const octokit = new Octokit({
        auth: "Personal_access_Token",
      });
      if (searchInput !== "") {
        setLoading(true);

        try {
          const auto = await octokit.request(
            "GET /organizations?per_page={per_page}",
            {
              per_page: 99,
            }
          );

          //

          const data = auto.data?.filter((e) => e.login.includes(searchInput));
          setSearchResult(data);

          const response = await octokit.request(
            "GET /orgs/{org}",
            {
              org: searchInput,
            },
            (err) => {
              console.log(err);
            }
          );

          //

          setAutoComplete(response.data);
          setLoading(false);
          //
          return;
        } catch (err) {
          //search not found
          return;
        }
      }
    };

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
          {showAutoComplete && searchInput === "" && (
            <p
              style={{
                position: "absolute",
                top: "70px",
                left: "10px",
                backgroundColor: "#555456",
                padding: "10px",
                borderRadius: "7px",
                color: "lightgray",
              }}
            >
              Enter a search{" "}
            </p>
          )}
        </header>
        <form action="submit" method="get">
          {showAutoComplete && searchInput !== "" && (
            <Link className="autoCompleteText" to={`/${autoComplete?.name}`}>
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
                      e.forEach((e) => {
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
                              createdAt: e.created_at,
                              updatedAt: e.updated_at,
                            });
                            setDataReady(true);
                          })
                          .catch((err) => console.error(err));
                      });
                      setFData(array);
                    })
                    .catch((e) => console.error(e));
                }}
                className="list"
              />
            </Link>
          )}
          {showAutoComplete &&
            searchInput !== "" &&
            searchResult?.map((e) => {
              return (
                <Link
                  key={e.id}
                  style={{ paddingTop: "50px", marginTop: 0 }}
                  className="autoCompleteText"
                  to={`/${e.login}`}
                >
                  <DropDown
                    text={e.login}
                    style={{ color: "black" }}
                    className="list"
                    onClick={() => {
                      const uri = e?.repos_url;
                      const array = [];

                      fetch(uri)
                        .then((e) => {
                          return e.json();
                        })
                        .then((e) => {
                          e.forEach((e) => {
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
                                  createdAt: e.created_at,
                                  updatedAt: e.updated_at,
                                });
                                setDataReady(true);
                              })
                              .catch((err) => console.error(err));
                          });
                          setFData(array);
                        })
                        .catch((e) => console.error(e));
                    }}
                  />
                </Link>
              );
            })}
        </form>
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
                <h3
                  style={{
                    width: "100%",
                    height: "500px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#757575",
                  }}
                >
                  Search for an organization
                </h3>
              </Route>
            </Switch>
          </div>
        )}
      </Router>
    </div>
  );
}

export default App;
