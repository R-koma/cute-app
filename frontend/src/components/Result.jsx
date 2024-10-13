import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; 

const Result = () => {
    const [data, setData] = useState();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                axios.get("http://ec2-98-83-117-130.compute-1.amazonaws.com/api/cutiees")
                .then(async (res) => {
                    setData(res.data);
                })
                .catch(err => {
                    console.log(err)
                })
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const handleBackClick = () => {
        navigate('/');
    };

    return (
        <>
            <div style={{ position: 'relative', padding: '20px' }}>
            <button 
                onClick={handleBackClick} 
                style={{
                    position: 'absolute',
                    top: '20px',
                    left: '20px',
                    padding: '10px 20px',
                    backgroundColor: '#007BFF', // Bootstrap primary color
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontSize: '16px'
                }}>
                Back
            </button>
            </div>
            <div>{data}</div>

        </>
    )
}

export default Result;