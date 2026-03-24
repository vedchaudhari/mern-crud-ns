import { useState, useCallback } from "react";
import StudentForm from "./components/StudentForm";
import StudentList from "./components/StudentList";

function App() {
  const [selected, setSelected] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const refresh = useCallback(() => {
    setRefreshKey((k) => k + 1);
  }, []);

  const handleEdit = (student) => {
    setSelected(student);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setSelected(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelected(null);
    setIsModalOpen(false);
  };

  return (
    <div className="main-container">
      <div className="page-header">All Members</div>
      <StudentList 
        key={refreshKey} 
        onEdit={handleEdit} 
        onAddNew={handleAddNew}
      />
      
      {isModalOpen && (
        <StudentForm
          selected={selected}
          onClose={closeModal}
          refresh={refresh}
        />
      )}
    </div>
  );
}

export default App;