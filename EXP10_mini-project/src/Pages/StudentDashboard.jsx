import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { signInAnonymously, onAuthStateChanged } from "firebase/auth";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { app, db, auth } from "../Firebase";  // ✅ import from firebase.js


// --- Neobrutalist Color & Style Constants ---
const PRIMARY_COLOR = 'bg-yellow-300';
const ACCENT_COLOR = 'bg-black';
const TEXT_COLOR = 'text-black';
const BORDER_STYLE = 'border-4 border-black';
const SHADOW_STYLE = 'shadow-[8px_8px_0_0_#000]';

// --- Animations ---
const headerVariants = {
  hidden: { y: -100, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 120, damping: 20 } },
};

const formVariants = {
  hidden: { x: -50, opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { type: 'spring', stiffness: 100, delay: 0.2 } },
};

const inputHover = {
  scale: 1.01,
  boxShadow: '4px 4px 0 0 #000',
};

const modalVariants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: { scale: 1, opacity: 1, transition: { type: 'spring', stiffness: 200, damping: 20 } },
  exit: { scale: 0.5, opacity: 0, transition: { duration: 0.3 } },
};

// --- Reusable Modal Component ---
const MessageModal = ({ onClose, title, message, bgColor, accentColor }) => (
  <motion.div
    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-70"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    <motion.div
      className={`${bgColor} p-8 md:p-12 ${BORDER_STYLE} ${SHADOW_STYLE} max-w-lg w-full text-center font-mono`}
      variants={modalVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <h2 className="text-4xl font-extrabold mb-4 text-black">{title}</h2>
      <p className="text-lg mb-6">{message}</p>
      <motion.button
        onClick={onClose}
        className={`${ACCENT_COLOR} ${accentColor} font-extrabold py-2 px-8 ${BORDER_STYLE} shadow-[4px_4px_0_0_#000] uppercase tracking-wider`}
        whileHover={{ scale: 1.05, boxShadow: '6px 6px 0 0 #000' }}
        whileTap={{ scale: 0.95, boxShadow: '2px 2px 0 0 #000' }}
      >
        OK
      </motion.button>
    </motion.div>
  </motion.div>
);

// --- Main Component ---
const StudentDashboard = () => {
  const [formData, setFormData] = useState({
    member1Name: '',
    member1RollNumber: '',
    member2Name: '',
    member2RollNumber: '',
    experimentTitle: '',
    observations: '',
    pdfFile: null,
  });

  const [userId, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [modalMessage, setModalMessage] = useState(null);

  // --- Firebase Auth Setup ---
  useEffect(() => {
    try {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (!user) {
          try {
            await signInAnonymously(auth);
          } catch (error) {
            console.error("Auth sign-in failed:", error);
            setModalMessage({
              type: "error",
              message: "Failed to authenticate. Please check console for details.",
            });
            return;
          }
        }

        const currentUser = auth.currentUser;
        if (currentUser && currentUser.uid) {
          setUserId(currentUser.uid);
        } else {
          setUserId(crypto.randomUUID());
        }
      });

      return () => unsubscribe();
    } catch (err) {
      console.error("Error during Firebase initialization:", err);
      setModalMessage({
        type: "error",
        message: "Initialization error. Check console for more info.",
      });
    }
  }, []);

  // --- Handlers ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    setFormData((prev) => ({ ...prev, pdfFile: file || null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;
    if (!db) {
      setModalMessage({ type: 'error', message: 'Firestore is not ready. Try reloading the page.' });
      return;
    }
    if (!userId) {
      setModalMessage({ type: 'error', message: 'User not authenticated yet. Try again shortly.' });
      return;
    }

    setIsLoading(true);
    setModalMessage(null);

    const dataToSave = {
      member1Name: formData.member1Name,
      member1RollNumber: formData.member1RollNumber,
      member2Name: formData.member2Name,
      member2RollNumber: formData.member2RollNumber,
      experimentTitle: formData.experimentTitle,
      observations: formData.observations,
      pdfFileName: formData.pdfFile ? formData.pdfFile.name : null,
      pdfFileType: formData.pdfFile ? formData.pdfFile.type : null,
      submittedBy: userId,
      timestamp: serverTimestamp(),
    };

    try {
      const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
      const reportsCollection = collection(db, "artifacts", appId, "users", userId, "lab_reports");

      await addDoc(reportsCollection, dataToSave);

      setModalMessage({
        type: 'success',
        message: `Report submitted successfully! (User ID: ${userId})`,
      });

      setFormData({
        member1Name: '',
        member1RollNumber: '',
        member2Name: '',
        member2RollNumber: '',
        experimentTitle: '',
        observations: '',
        pdfFile: null,
      });
    } catch (error) {
      console.error('Submission failed:', error);
      setModalMessage({ type: 'error', message: `Submission failed: ${error.message}` });
    } finally {
      setIsLoading(false);
    }
  };

  const closeModal = () => setModalMessage(null);

  // --- UI Rendering ---
  return (
    <div className={`min-h-screen ${PRIMARY_COLOR} ${TEXT_COLOR} flex flex-col font-mono`}>
      <AnimatePresence>
        {modalMessage && (
          <MessageModal
            onClose={closeModal}
            title={modalMessage.type === 'success' ? "✅ Submission Complete!" : "❌ Submission Error"}
            message={modalMessage.message}
            bgColor={modalMessage.type === 'success' ? "bg-green-300" : "bg-red-500"}
            accentColor={modalMessage.type === 'success' ? "text-green-300" : "text-red-500"}
          />
        )}
      </AnimatePresence>

      <motion.header
        className={`w-full p-8 ${ACCENT_COLOR} ${TEXT_COLOR} shadow-xl`}
        variants={headerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="max-w-6xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-extrabold text-yellow-300 tracking-tighter">
            LAB REPORT PORTAL 📝
          </h1>
          <p className="mt-3 text-white text-lg">
            User ID: <span className="font-bold">{userId || 'Connecting...'}</span>
          </p>
        </div>
      </motion.header>

      <main className="flex-grow max-w-6xl mx-auto p-8 w-full">
        <motion.form
          onSubmit={handleSubmit}
          className={`bg-white p-10 ${BORDER_STYLE} ${SHADOW_STYLE} space-y-8`}
          variants={formVariants}
          initial="hidden"
          animate="visible"
        >
          {/* --- Team Details --- */}
          <section>
            <h2 className="text-3xl font-extrabold mb-6 border-b-4 border-black pb-2">
              Team Details (2 Members Required)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <label className="block text-sm font-bold">
                  Student Name (Member 1)
                  <motion.input
                    type="text"
                    name="member1Name"
                    value={formData.member1Name}
                    onChange={handleChange}
                    required
                    placeholder="JANE DOE"
                    className={`mt-1 w-full px-4 py-3 bg-white ${BORDER_STYLE} focus:outline-none focus:ring-4 focus:ring-red-500`}
                    whileHover={inputHover}
                  />
                </label>
                <label className="block text-sm font-bold">
                  Roll Number (Member 1)
                  <motion.input
                    type="text"
                    name="member1RollNumber"
                    value={formData.member1RollNumber}
                    onChange={handleChange}
                    required
                    placeholder="12345"
                    className={`mt-1 w-full px-4 py-3 bg-white ${BORDER_STYLE} focus:outline-none focus:ring-4 focus:ring-red-500`}
                    whileHover={inputHover}
                  />
                </label>
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-bold">
                  Student Name (Member 2)
                  <motion.input
                    type="text"
                    name="member2Name"
                    value={formData.member2Name}
                    onChange={handleChange}
                    required
                    placeholder="JOHN SMITH"
                    className={`mt-1 w-full px-4 py-3 bg-white ${BORDER_STYLE} focus:outline-none focus:ring-4 focus:ring-red-500`}
                    whileHover={inputHover}
                  />
                </label>
                <label className="block text-sm font-bold">
                  Roll Number (Member 2)
                  <motion.input
                    type="text"
                    name="member2RollNumber"
                    value={formData.member2RollNumber}
                    onChange={handleChange}
                    required
                    placeholder="67890"
                    className={`mt-1 w-full px-4 py-3 bg-white ${BORDER_STYLE} focus:outline-none focus:ring-4 focus:ring-red-500`}
                    whileHover={inputHover}
                  />
                </label>
              </div>
            </div>
          </section>

          {/* --- Experiment Details --- */}
          <section className="space-y-8">
            <label className="block text-sm font-bold mb-2">
              Experiment Title
              <motion.input
                type="text"
                name="experimentTitle"
                value={formData.experimentTitle}
                onChange={handleChange}
                required
                placeholder="OHM'S LAW EXPERIMENT"
                className={`mt-1 w-full px-4 py-3 bg-white ${BORDER_STYLE} focus:outline-none focus:ring-4 focus:ring-red-500`}
                whileHover={inputHover}
              />
            </label>
            <label className="block text-sm font-bold mb-2">
              Observations & Data
              <motion.textarea
                name="observations"
                value={formData.observations}
                onChange={handleChange}
                required
                rows="8"
                placeholder="ENTER YOUR RAW DATA AND KEY OBSERVATIONS HERE..."
                className={`mt-1 w-full px-4 py-3 bg-white ${BORDER_STYLE} focus:outline-none focus:ring-4 focus:ring-red-500 resize-y`}
                whileHover={inputHover}
              />
            </label>
          </section>

          {/* --- PDF Upload --- */}
          <section>
            <h2 className="text-3xl font-extrabold mb-6 border-b-4 border-black pb-2">
              PDF Report Upload
            </h2>
            <label className="block text-sm font-bold mb-2">
              Upload Final PDF Document (Required)
              <motion.input
                type="file"
                name="pdfFile"
                onChange={handleFileChange}
                required
                accept=".pdf"
                className={`mt-1 w-full px-4 py-3 bg-white ${BORDER_STYLE} focus:outline-none focus:ring-4 focus:ring-red-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-none file:border-0 file:border-r-4 file:border-black
                  file:text-sm file:font-extrabold
                  file:bg-yellow-300 file:text-black
                  hover:file:bg-yellow-400 cursor-pointer transition-colors duration-150`}
                whileHover={inputHover}
              />
            </label>
            <p className="text-xs mt-2 text-gray-600">
              Only PDF files are accepted. (Note: File data is not saved to Firestore; only metadata is logged for now.)
            </p>
          </section>

          <div className="text-right">
            <motion.button
              type="submit"
              disabled={isLoading}
              className={`${ACCENT_COLOR} text-yellow-300 font-extrabold py-3 px-10 ${BORDER_STYLE} ${SHADOW_STYLE} uppercase tracking-widest disabled:opacity-50 disabled:shadow-none`}
              whileHover={!isLoading && { scale: 1.05, boxShadow: '12px 12px 0 0 #000' }}
              whileTap={!isLoading && { scale: 0.95, boxShadow: '4px 4px 0 0 #000' }}
            >
              {isLoading ? 'SAVING...' : 'SUBMIT REPORT 🚀'}
            </motion.button>
          </div>
        </motion.form>
      </main>

      <footer className={`${ACCENT_COLOR} text-white py-4 text-center text-sm ${BORDER_STYLE} border-b-0 border-l-0 border-r-0 mt-8`}>
        &copy; {new Date().getFullYear()} UNIVERSITY LAB PORTAL.
      </footer>
    </div>
  );
};

export default StudentDashboard;
