import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from '../src/Components/Navbar';
import StudentDashboard from '../src/Pages/StudentDashboard';
import FacultyDashboard from '../src/Pages/FacultyDashboard';
import Summary from '../src/Pages/Summary';
import { db } from '../src/Firebase'; // <-- Import your firebase setup
import { collection, onSnapshot, doc, updateDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import { ReactLenis } from 'lenis/react'

function App() {
  const [submissions, setSubmissions] = useState([]);

  // Fetch initial data and listen for real-time updates
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'submissions'), (snapshot) => {
      const fetchedSubmissions = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setSubmissions(fetchedSubmissions);
    });

    return () => unsub(); // Unsubscribe when the component unmounts
  }, []);

  const addSubmission = async (newSubmissionData) => {
    try {
      await addDoc(collection(db, 'submissions'), {
        ...newSubmissionData,
        timestamp: serverTimestamp(),
        marks: null,
        feedback: '',
      });
      alert('Report submitted successfully!');
    } catch (e) {
      console.error('Error adding document:', e);
      alert('Failed to submit report. Please try again.');
    }
  };

  const updateSubmission = async (updatedSub) => {
    // Optimistically update the UI to improve perceived performance
    setSubmissions((prevSubmissions) =>
      prevSubmissions.map((sub) =>
        sub.id === updatedSub.id ? updatedSub : sub
      )
    );

    try {
      const submissionRef = doc(db, 'submissions', updatedSub.id);
      await updateDoc(submissionRef, updatedSub);
    } catch (e) {
      console.error('Error updating document:', e);
      alert('Failed to save changes. Please try again.');
      // The onSnapshot listener will eventually revert the UI if the update failed
    }
  };

  return (
    <Router>
      <ReactLenis root />
      <div className="min-h-screen bg-gray-100 font-sans">
        <Navbar />
        <div className="container mx-auto p-4">
          <Routes>
            <Route path="/student" element={<StudentDashboard addSubmission={addSubmission} />} />
            <Route path="/faculty" element={<FacultyDashboard submissions={submissions} updateSubmission={updateSubmission} />} />
            <Route path="/summary" element={<Summary submissions={submissions} />} />
            <Route path="/" element={<StudentDashboard addSubmission={addSubmission} />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;