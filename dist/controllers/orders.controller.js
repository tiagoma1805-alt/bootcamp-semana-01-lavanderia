"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersController = void 0;
class OrdersController {
    service;
    constructor(service) {
        this.service = service;
    }
    getAll = async (req, res, next) => {
        try {
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 5;
            const result = await this.service.getOrders(page, limit);
            res.status(200).json(result);
        }
        catch (error) {
            next(error);
        }
    };
    getById = async (req, res, next) => {
        try {
            const id = Number(req.params.id);
            if (isNaN(id)) {
                return res.status(400).json({ error: 'Bad Request', message: 'El ID debe ser numerico' });
            }
            const order = await this.service.getOrderById(id);
            if (!order) {
                return res.status(404).json({
                    error: 'Not Found',
                    message: `Order ${id} not found`
                });
            }
            res.status(200).json({ data: order });
        }
        catch (error) {
            next(error);
        }
    };
    create = async (req, res, next) => {
        try {
            const newOrder = await this.service.createOrder(req.body);
            res.status(201).json({ data: newOrder });
        }
        catch (error) {
            if (error.message === 'MISSING_FIELDS') {
                return res.status(400).json({
                    error: 'Bad Request',
                    message: 'Faltan campos obligatorios para crear la orden'
                });
            }
            next(error);
        }
    };
    update = async (req, res, next) => {
        try {
            const id = Number(req.params.id);
            if (isNaN(id)) {
                return res.status(400).json({ error: 'Bad Request', message: 'El ID debe ser numerico' });
            }
            const updated = await this.service.updateOrder(id, req.body);
            if (!updated) {
                return res.status(404).json({
                    error: 'Not Found',
                    message: `Order ${id} not found`
                });
            }
            res.status(200).json({ data: updated });
        }
        catch (error) {
            next(error);
        }
    };
    delete = async (req, res, next) => {
        try {
            const id = Number(req.params.id);
            if (isNaN(id)) {
                return res.status(400).json({ error: 'Bad Request', message: 'El ID debe ser numerico' });
            }
            const deleted = await this.service.deleteOrder(id);
            if (!deleted) {
                return res.status(404).json({
                    error: 'Not Found',
                    message: `Order ${id} not found`
                });
            }
            res.status(204).send();
        }
        catch (error) {
            next(error);
        }
    };
}
exports.OrdersController = OrdersController;
