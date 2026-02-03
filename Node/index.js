import express from  'express'

const app = express();

// 1. Built-in Middleware - Parse JSON
app.use(express.json());

// 2. Built-in Middleware - Parse URL-encoded data
app.use(express.urlencoded({ extended: true }));

// 3. Custom Middleware - Logging
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
});

// 4. Custom Middleware - Authentication
const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization;
    if (token) {
        req.user = { id: 1, name: 'User' };
        next();
    } else {
        res.status(401).json({ error: 'Unauthorized' });
    }
};

// 5. Custom Middleware - Error Handling
const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong' });
};

// 6. Route-specific Middleware
app.get('/profile', authMiddleware, (req, res) => {
    res.json({ user: req.user });
});

// 7. Multiple Middlewares on a route
const validateInput = (req, res, next) => {
    if (!req.body.name) {
        return res.status(400).json({ error: 'Name is required' });
    }
    next();
};

app.post('/user', validateInput, (req, res) => {
    res.json({ success: true, name: req.body.name });
});

// Error handling middleware (must be last)
app.use(errorHandler);

app.listen(3000, () => {
    console.log('Server running on port 3000');
});