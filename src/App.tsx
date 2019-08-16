import React, { useState, Suspense } from "react";
import "bulma/css/bulma.css";
import "./App.scss";
import { withCache } from "./components/withCache";
import { createResource } from "simple-cache-provider";

const sleep = ms => new Promise(r => setTimeout(() => r(), ms));

const readShows = createResource(async function fetchNews() {
  await sleep(3000);
  const res = await fetch("https://jsonplaceholder.typicode.com/todos");
  return await res.json();
});

const Todo = ({ item }) => {
  const [checked, setChecked] = useState(false);

  return (
    <div
      onClick={() => {
        setChecked(!checked);
      }}
      className={`column is-4 todo ${checked ? "checked" : ""}`}
    >
      <input type="checkbox" checked={checked} />

      <label
        htmlFor="styled-checkbox-2"
        className={`checkbox space-left ${checked ? "checked" : ""}`}
      >
        {item.title}
      </label>
    </div>
  );
};

const Todos = withCache(props => {
  const result = readShows.read(props.cache);

  if (!result) {
    return null;
  }

  return (
    <React.Fragment>
      {result.map(item => (
        <Todo key={item.title} item={item} />
      ))}
    </React.Fragment>
  );
});

const TodoContainer = () => {
  const children = <Todos />;
  const fallback = <progress className="progress is-info" max="100" />;

  return (
    <div className="container">
      <div className="columns is-multiline">
        <Suspense fallback={fallback}>{children}</Suspense>
      </div>
    </div>
  );
};

export default class App extends React.Component {
  render() {
    return (
      <React.Fragment>
        <div className="App">
          <header className="App-header">
            <h1 className="App-title">Todo List</h1>
          </header>

          <TodoContainer />
        </div>
      </React.Fragment>
    );
  }
}
