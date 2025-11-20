import { useEffect, useState } from 'react';
import api from '../api';
import Navbar from '../components/Navbar';

function Leads() {
    const [leads, setLeads] = useState([]);

    useEffect(() => {
        api.get('/leads/').then(res => setLeads(res.data)).catch(console.error);
    }, []);

    return (
        <>
            <Navbar />
            <div className="container">
                <h2>My Leads</h2>
                <table className="table table-striped mt-3">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Phone</th>
                            <th>Status</th>
                            <th>Location</th>
                        </tr>
                    </thead>
                    <tbody>
                        {leads.map(lead => (
                            <tr key={lead.id}>
                                <td>{lead.name}</td>
                                <td>{lead.phone_number}</td>
                                <td><span className="badge bg-info">{lead.status}</span></td>
                                <td>{lead.preferred_location}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}

export default Leads;
