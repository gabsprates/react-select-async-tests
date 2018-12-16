import React from "react";
import "./index.css";
import { RESOURCES, SWAPI } from "../libs/constants";
import Async from "react-select/lib/Async";
import { ValueType } from "react-select/lib/types";

type StateType = {
  search: string;
  resource: RESOURCES;
  selected: any;
};

const debouncingTime = 500;

export default class App extends React.Component<{}, StateType> {
  private timer: number = 0;

  state = {
    search: "",
    selected: null,
    resource: RESOURCES.PEOPLE
  };

  handleResource = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      resource: e.target.value
    } as StateType);
  };

  handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log(this.state);
  };

  handleAsyncInput = (inputValue: string) => {
    clearTimeout(this.timer);
    this.setState({ search: inputValue });
    const endpoint = `${SWAPI}${this.state.resource}/?search=${inputValue}`;

    return new Promise(resolve => {
      this.timer = setTimeout(() => {
        fetch(endpoint)
          .then((data: Response) => data.json())
          .then(data =>
            data.results.map((result: any) => ({
              value: result.url,
              label: result.name || result.title
            }))
          )
          .then(results => {
            resolve(results);
          });
      }, debouncingTime);
    });
  };

  handleAsyncSelection = (selected: ValueType<any>) => {
    if (!selected) return;

    fetch(selected.value)
      .then((data: Response) => data.json())
      .then(data => {
        this.setState({ selected: data });
      });
  };

  componentWillUnmount = () => {
    clearTimeout(this.timer);
  };

  render() {
    return (
      <div className="container">
        <form onSubmit={this.handleSubmit}>
          <label>
            <p>search term:</p>
            <Async
              onChange={this.handleAsyncSelection}
              loadOptions={this.handleAsyncInput}
            />
          </label>

          <button type="submit">log it!</button>

          <div className="resources">
            {Object.entries(RESOURCES).map(([key, value]) => (
              <label key={key}>
                <input
                  type="radio"
                  name="resource"
                  value={value}
                  checked={value === this.state.resource}
                  onChange={this.handleResource}
                />{" "}
                {value}
              </label>
            ))}
          </div>

          {this.state.selected ? (
            <div>{JSON.stringify(this.state.selected)}</div>
          ) : null}
        </form>
      </div>
    );
  }
}
