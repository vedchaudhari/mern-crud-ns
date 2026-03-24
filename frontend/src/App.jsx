import { useState, useCallback } from "react";
import StudentForm from "./components/StudentForm";
import StudentList from "./components/StudentList";

function App() {
  const [selected, setSelected] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [triggerRefresh, setTriggerRefresh] = useState({ timestamp: 0, isNew: false });

  const refresh = useCallback((isNew = false) => {
    setTriggerRefresh({ timestamp: Date.now(), isNew });
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
        triggerRefresh={triggerRefresh}
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