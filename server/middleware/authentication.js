import jwt from 'jsonwebtoken';

const JWT_SECRET = 'd3d8b5ffb1f83db43b61969af4a037da0889bbcc409501e4fd93b51ff79aa09dc6530759cb7290578b722a57dd8180b7d257f33f671463ea2ee24dd3913bc6d2';

// Middleware to verify JWT token
export const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Extract token from Authorization header

    if (!token) return res.status(401).json({ message: 'Access denied, token missing!' });

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Invalid token!' })

        req.user = user; // Attach user info (from the token) to the request object
        next();
    });
};