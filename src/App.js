import "./App.css";
import { Octokit } from "@octokit/core";
import { useEffect, useState } from "react";
import Table from "./components/Table";
import Graph from "./components/Graph";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import dotenv from "dotenv";
import { Input } from "./components/Reusables/Form";
import { DropDown, Loading } from "./components/Reusables/Utilities";
dotenv.config();

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

  const acessToken = process.env.AUTH_TOKEN;

  const octokit = new Octokit({
    auth: acessToken,
  });

  useEffect(() => {
    //

    const fetchData = async () => {
      //

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

          //
        } catch (err) {
          //search not found.

          alert("Something went wrong, please try again.\n" + err);
        }

        try {
          const response = await octokit.request("GET /orgs/{org}", {
            org: searchInput,
          });
          setAutoComplete(response.data);
        } catch (err) {
          //no search output
        }
      }
    };

    fetchData();
    setLoading(false);
  }, [searchInput]);
  //

  // ----------functions

  const clickAutoComplete = () => {
    const uri = autoComplete?.repos_url;
    const array = [];
    fetch(uri)
      .then((e) => {
        return e.json();
      })
      .then((e) => {
        setSearchInput("");
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
            .catch(() => {
              return;
            });
        });
        setFData(array);
      })
      .catch(() => {
        return;
      });
  };

  const clickResults = (e) => {
    const uri = e?.repos_url;
    const array = [];

    fetch(uri)
      .then((e) => {
        return e.json();
      })
      .then((e) => {
        setSearchInput("");

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
            .catch(() => {
              return;
            });
        });
        setFData(array);
      })
      .catch(() => {
        return;
      });
  };

  //
  return (
    <div className="App">
      <Router>
        <div  className="header">
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
              Enter a search
            </p>
          )}
          <div className="autoCompleteText">
            {showAutoComplete && searchInput && autoComplete?.name && (
              <Link className="link" to={`/${autoComplete?.name}`}>
                <DropDown
                  text={autoComplete?.name}
                  onClick={() => clickAutoComplete()}
                  className="list"
                />
              </Link>
            )}
            {showAutoComplete &&
              searchInput &&
              searchResult?.map((e) => {
                return (
                  <Link
                    className="link"
                    key={e.id}
                    style={{ paddingTop: "50px", marginTop: 0 }}
                    to={`/${e.login}`}
                  >
                    <DropDown
                      text={e.login}
                      className="list"
                      onClick={() => clickResults(e)}
                    />
                  </Link>
                );
              })}
          </div>
        </div>
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
