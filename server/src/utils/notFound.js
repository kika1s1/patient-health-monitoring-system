const notFound = (req, res) => {
    res.status(404).json({
        error: 'NotFound',
        message: 'The requested resource was not found.',
        details: {
            method: req.method,
            url: req.originalUrl
        }
    });
}
export default notFound;