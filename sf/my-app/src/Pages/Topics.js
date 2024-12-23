import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Topics = () => {
    const [topics, setTopics] = useState([]);

    useEffect(() => {
        const fetchTopics = async () => {
            const token = localStorage.getItem('accessToken');  // Patikrinkite AccessToken

            if (!token) {
                // Jei nėra tokeno, nukreipiame į login puslapį
                window.location.href = '/login';
                return;
            }

            try {
                // Apsaugota užklausa, kur Authorization galvutėje nurodysime tokeną
                const response = await axios.get('http://localhost:5133/api/topics', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setTopics(response.data);  // Gauname filmų sąrašą
            } catch (error) {
                console.error('Error fetching topics:', error);
            }
        };

        fetchTopics();
    }, []);

    return (
        <div>
            <h1>Filmai</h1>
            <ul>
                {topics.map((topic) => (
                    <li key={topic.id}>{topic.title}</li>
                ))}
            </ul>
        </div>
    );
};

export default Topics;
