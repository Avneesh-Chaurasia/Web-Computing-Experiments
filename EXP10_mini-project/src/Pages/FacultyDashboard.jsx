import { } from 'react';

const FacultyDashboard = ({ submissions, updateSubmission }) => {
  // No need for editingId or editedData states in this simplified version.

  const handleUpdate = (id, field, value) => {
    // Find the original submission object.
    const originalSub = submissions.find(sub => sub.id === id);
    if (!originalSub) return;

    // Create the updated object with the new value for the specified field.
    const updatedSub = { ...originalSub, [field]: value };
    
    // Pass the updated object to the parent component.
    updateSubmission(updatedSub);
  };

  return (
    <div className="max-w-5xl mx-auto my-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Faculty Dashboard</h1>
      <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Roll No.</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Experiment</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Marks</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Feedback</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {submissions.map((sub) => (
              <tr key={sub.id}>
                <td className="px-6 py-4 whitespace-nowrap">{sub.studentName}</td>
                <td className="px-6 py-4 whitespace-nowrap">{sub.rollNumber}</td>
                <td className="px-6 py-4 whitespace-nowrap">{sub.experimentTitle}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="number"
                    defaultValue={sub.marks}
                    onBlur={(e) => handleUpdate(sub.id, 'marks', parseInt(e.target.value) || 0)}
                    className="w-20 border rounded p-1"
                  />
                </td>
                <td className="px-6 py-4">
                  <textarea
                    defaultValue={sub.feedback}
                    onBlur={(e) => handleUpdate(sub.id, 'feedback', e.target.value)}
                    className="w-full border rounded p-1"
                  ></textarea>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FacultyDashboard;
