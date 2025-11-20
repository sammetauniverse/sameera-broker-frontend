import { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/users/login/', { username, password });
            localStorage.setItem('access_token', res.data.access);
            localStorage.setItem('refresh_token', res.data.refresh);
            navigate('/leads');
        } catch (err) {
            alert('Login failed! Check credentials.');
        }
    };

    return (
        <div className="container mt-5" style={{ maxWidth: '400px' }}>
            <div className="card p-4">
                <h3 className="text-center">Broker Login</h3>
                <form onSubmit={handleLogin}>
                    <div className="mb-3">
                        <label>Username</label>
                        <input className="form-control" onChange={e => setUsername(e.target.value)} />
                    </div>
                    <div className="mb-3">
                        <label>Password</label>
                        <input type="password" className="form-control" onChange={e => setPassword(e.target.value)} />
                    </div>
                    <button className="btn btn-primary w-100">Login</button>
                </form>
            </div>
        </div>
    );
}

export default Login;
