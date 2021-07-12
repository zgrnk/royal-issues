import React from 'react';
import Issue from "./components/Issue";
import { useGetIssues } from "./hooks/Server";

function App() {
  const issues = useGetIssues();

  const loadingDiv = (
    <div className="flex justify-center items-center w-screen h-screen">
      <div className="text-xl text-blue-700">Loading...</div>
    </div>
  );

  return (
    <div className="App font-sans text-gray-900">
      <Grid>
        {issues ? issues.map((issue, i) => <Issue key={i} data={issue}/>) : loadingDiv}
      </Grid>
    </div>
  );
}

function Grid({children}) {
  return (
    <div className="flex flex-wrap w-screen h-screen justify-center items-center">
        {children}
    </div>
  );
}

export default App;
