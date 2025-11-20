import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        navigate('/login');
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
            <div className="container">
                <Link className="navbar-brand" to="/dashboard">Broker Portal</Link>
                <div className="collapse navbar-collapse">
                    <ul className="navbar-nav me-auto">
                        <li className="nav-item">
                            <Link className="nav-link" to="/leads">My Leads</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/inventory">Inventory</Link>
                        </li>
                    </ul>
                    <button onClick={handleLogout} className="btn btn-danger btn-sm">Logout</button>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
