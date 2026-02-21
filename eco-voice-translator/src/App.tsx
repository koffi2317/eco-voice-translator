import { useState } from "react";
import Presentation from "./Presentation";
import Translation from "./Translation";



function App() {
  const [page, setPage] = useState<"presentation" | "translation">("presentation");

  const handleStart = () => {
    setPage("translation");
  };

  return page === "presentation" ? (
    <Presentation onStart={handleStart} />
  ) : (
    <Translation />
  );
}

export default App;