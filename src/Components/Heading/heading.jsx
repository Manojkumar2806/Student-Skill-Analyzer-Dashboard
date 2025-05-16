import { Link, useLocation } from 'react-router-dom';
import './index.css';

const Heading = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  
  return (
    <div className="nav-container">
      <ul className="nav-list">
        <li className={currentPath === '/overalDashboard' ? 'active' : ''}>
          <Link to="/overalDashboard">All</Link>
          <span className="indicator"></span>          
        </li>
        <li className={currentPath === '/DSA' ? 'active' : ''}>
          <Link to="/DSA">DS A</Link>
          <span className="indicator"></span>
        </li>
        <li className={currentPath === '/DSB' ? 'active' : ''}>
          <Link to="/DSB">DS B</Link>
          <span className="indicator"></span>
        </li>
      </ul>
    </div>
  );
};

export default Heading;