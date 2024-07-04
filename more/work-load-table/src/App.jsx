import { WorkLoadTable } from "./landing/components/table.jsx";
import { DefaultLandingComponent } from "./landing/index.jsx";

import { Button } from "@/components/ui/button";

function App() {
  return (
    <div className="rootDiv">
      {/* This is a default placeholder component, 
					remove this and add your own component */}
      {/* <DefaultLandingComponent /> */}
      <WorkLoadTable />
    </div>
  );
}

export default App;
