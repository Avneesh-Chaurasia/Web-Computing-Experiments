import { useEffect, useState } from 'react';

const Summary = ({ submissions }) => {
  const [averageScore, setAverageScore] = useState(0);

  useEffect(() => {
    // Filter out submissions that have not yet been graded.
    const gradedSubmissions = submissions.filter(sub => sub.marks !== null && sub.marks !== undefined);

    if (gradedSubmissions.length > 0) {
      const totalMarks = gradedSubmissions.reduce((sum, sub) => sum + sub.marks, 0);
      const avg = totalMarks / gradedSubmissions.length;
      setAverageScore(avg.toFixed(2));
    } else {
      // Handle the case where no submissions have been graded yet.
      setAverageScore(0);
    }
  }, [submissions]);

  return (
    <div className="max-w-5xl mx-auto my-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Student Summary</h1>
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-2">Student Average Score:</h2>
        <p className="text-4xl font-bold text-blue-600">{averageScore}</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Roll Number</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Experiment</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Marks</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {submissions.map((sub) => (
              <tr key={sub.id}>
                <td className="px-6 py-4 whitespace-nowrap">{sub.studentName}</td>
                <td className="px-6 py-4 whitespace-nowrap">{sub.rollNumber}</td>
                <td className="px-6 py-4 whitespace-nowrap">{sub.experimentTitle}</td>
                <td className="px-6 py-4 whitespace-nowrap">{sub.marks || 'Not Graded'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Summary;
