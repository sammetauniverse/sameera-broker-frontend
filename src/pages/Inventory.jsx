import { useEffect, useState } from 'react';
import api from '../api';
import Navbar from '../components/Navbar';

function Inventory() {
    const [properties, setProperties] = useState([]);

    useEffect(() => {
        api.get('/inventory/').then(res => setProperties(res.data)).catch(console.error);
    }, []);

    return (
        <>
            <Navbar />
            <div className="container">
                <h2>Property Inventory</h2>
                <div className="row mt-3">
                    {properties.map(prop => (
                        <div className="col-md-4 mb-4" key={prop.id}>
                            <div className="card h-100">
                                {prop.image && (
                                    <img src={prop.image} className="card-img-top" alt={prop.title} style={{height: '200px', objectFit: 'cover'}} />
                                )}
                                <div className="card-body">
                                    <h5 className="card-title">{prop.title}</h5>
                                    <p className="card-text">{prop.description}</p>
                                    <p className="fw-bold">₹ {prop.price}</p>
                                    <span className="badge bg-success">{prop.status}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

export default Inventory;
