import React, { useEffect, useState } from "react";
import "./App.css";
import useInterSection from "./useIntersection";

const fakeFetch = (delay = 1000) => new Promise(res => setTimeout(res, delay));

const ListItem = ({ number }) =>
  <div className="ListItem">
    <span>
      {number}
    </span>
  </div>;

function App() {
  const [state, setState] = useState({ itemCount: 0, isLoading: false });
  /* fake async fetch */
  const fetchItems = async () => {
    setState(prev => ({ ...prev, isLoading: true }));
    await fakeFetch();
    setState(prev => ({ itemCount: prev.itemCount + 10, isLoading: false }));
  };
  /* initial fetch */
  useEffect(() => {
    fetchItems();
  }, []);
  const [_, setRef] = useInterSection(async (entry, observer) => {
    observer.unobserve(entry.target);
    await fetchItems();
    observer.observe(entry.target);
  }, {});
  const { itemCount, isLoading } = state;
  if (!itemCount) return null;
  return (
    <div className="App">
      {[...Array(itemCount)].map((_, i) => {
        return <ListItem key={i} number={i} />;
      })}
      <div ref={setRef} className="Loading">
        {isLoading && "Loading..."}
      </div>
    </div>
  );
}

export default App;
