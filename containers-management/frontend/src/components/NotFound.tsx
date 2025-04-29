import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
    return (
        <div style={styles.container}>
            <h1 style={styles.title}>404 - Page Not Found</h1>
            <p style={styles.message}>
                Oops! The page you're looking for doesn't exist.
            </p>
            <Link to="/" style={styles.link}>Go back to Home</Link>
        </div>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    container: {
        textAlign: 'center',
        padding: '50px',
    },
    title: {
        fontSize: '48px',
        marginBottom: '20px',
    },
    message: {
        fontSize: '18px',
        marginBottom: '30px',
    },
    link: {
        fontSize: '16px',
        textDecoration: 'none',
        color: '#007bff',
    },
};

export default NotFoundPage;
