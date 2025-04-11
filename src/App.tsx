import { Route, Routes } from "react-router";
import Home from "./page.tsx";
import Layout from "./Layout.tsx";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
      </Route>
    </Routes>
  );
}

export default App;
