"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const orders_routes_1 = __importDefault(require("./routes/orders.routes"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
// Logger Middleware
app.use((req, res, next) => {
    const startTime = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - startTime;
        console.log(`[LOGGER] ${req.method} ${req.originalUrl} - Status: ${res.statusCode} (${duration}ms)`);
    });
    next();
});
// Rutas principales
app.use('/api/v1/orders', orders_routes_1.default);
// Manejador 404
app.use((_req, res) => {
    res.status(404).json({
        error: 'Not Found',
        message: 'Ruta no encontrada'
    });
});
// Manejador Global de Errores
app.use((err, _req, res, _next) => {
    console.error('[ERROR]', err.message);
    res.status(500).json({
        error: 'Internal Server Error',
        message: err.message
    });
});
exports.default = app;
