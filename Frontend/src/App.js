import Graph from "./Graph";
import TissueComponent from "./TissueVis";
import './App.css'

function App(){
return(
<>
  <div className="container">
    <TissueComponent className="tissue-component" />
    <Graph className="graph-component" />
  </div>
</>


);
}

export default App