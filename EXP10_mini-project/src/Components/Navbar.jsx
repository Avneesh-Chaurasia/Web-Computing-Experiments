import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-gray-800 p-4 text-white shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">Student Report Submission System</h1>
        <ul className="flex space-x-4">
          <li><Link to="/student" className="hover:text-gray-300">Student</Link></li>
          <li><Link to="/faculty" className="hover:text-gray-300">Faculty</Link></li>
          <li><Link to="/summary" className="hover:text-gray-300">Summary</Link></li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
