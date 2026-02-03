import express from 'express';

const app = express();

export const errorMiddleware = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";

    res.status(err.statusCode).json({
        success: false,
        message: err.message,
        statusCode: err.statusCode,
    });
};

app.get('/crash', (req, res) => {
    throw new Error("Code Crashed")
});

app.get('/error', (req, res) => {
    throw new Error("Something went wrong")
});

app.get('/timeout', (req, res) => {
    throw new Error("Request timeout")
});

app.get('/notfound', (req, res) => {
    throw new Error("Resource not found")
});


// Error handling middleware (must be last)
app.use(errorMiddleware);

app.listen(3000, () => {
    console.log("Server running on port 4000");
});