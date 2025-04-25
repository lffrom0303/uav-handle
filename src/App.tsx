import "./App.css";
import { useMap } from "./hooks";
import Panels from "./components/panels";
function App() {
  const { viewerRef } = useMap();
  return (
    <div className="w-screen h-screen">
      <div ref={viewerRef} className="w-full h-full" />
      <Panels />
    </div>
  );
}

export default App;
