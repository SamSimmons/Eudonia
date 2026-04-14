import { useState, useEffect } from "react";
import { ScreenFill } from "./pages/screen-fill";
import { KitchenSink } from "./pages/kitchen-sink";

const routes: Record<string, () => React.JSX.Element> = {
  "/screen-fill": ScreenFill,
  "/kitchen-sink": KitchenSink,
};

function getRoute(): string {
  return window.location.hash.replace("#", "") || "/";
}

export function App() {
  const [route, setRoute] = useState(getRoute);

  useEffect(() => {
    const onHashChange = () => setRoute(getRoute());
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const Page = routes[route];

  if (Page) return <Page />;

  return (
    <div style={{ padding: 24, fontFamily: "system-ui" }}>
      <h1>Eudonia Browser Tests</h1>
      <ul>
        {Object.keys(routes).map((path) => (
          <li key={path}>
            <a href={`#${path}`}>{path}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}
