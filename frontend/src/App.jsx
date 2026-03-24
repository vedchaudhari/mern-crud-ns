import { useState, useCallback } from "react";
import StudentForm from "./components/StudentForm";
import StudentList from "./components/StudentList";

function App() {
  const [selected, setSelected] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const refresh = useCallback(() => {
    setRefreshKey((k) => k + 1);
  }, []);

  return (
    <>
      <StudentForm
        selected={selected}
        clear={() => setSelected(null)}
        refresh={refresh}
      />
      <StudentList key={refreshKey} setSelected={setSelected} />
    </>
  );
}

export default App;