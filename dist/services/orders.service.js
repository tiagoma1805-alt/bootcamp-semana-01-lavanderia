"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersService = void 0;
class OrdersService {
    repository;
    constructor(repository) {
        this.repository = repository;
    }
    async getOrders(page = 1, limit = 5) {
        const allOrders = await this.repository.findAll();
        const total = allOrders.length;
        const safePage = Math.max(1, page);
        const safeLimit = Math.max(1, limit);
        const startIndex = (safePage - 1) * safeLimit;
        const paginatedData = allOrders.slice(startIndex, startIndex + safeLimit);
        return {
            data: paginatedData,
            total,
            page: safePage,
            limit: safeLimit
        };
    }
    async getOrderById(id) {
        return await this.repository.findById(id);
    }
    async createOrder(dto) {
        if (!dto.customerName || !dto.garmentType || !dto.serviceType || dto.price === undefined) {
            throw new Error('MISSING_FIELDS');
        }
        return await this.repository.create(dto);
    }
    async updateOrder(id, dto) {
        return await this.repository.update(id, dto);
    }
    async deleteOrder(id) {
        return await this.repository.delete(id);
    }
}
exports.OrdersService = OrdersService;
