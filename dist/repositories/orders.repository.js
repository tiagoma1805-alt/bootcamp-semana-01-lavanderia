"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersRepository = void 0;
class OrdersRepository {
    orders = [
        {
            id: 1,
            customerName: 'Carlos Mendoza',
            garmentType: 'Traje de 2 piezas',
            serviceType: 'Lavado en seco',
            price: 35000,
            status: 'en_proceso',
            isPaid: true,
            createdAt: new Date().toISOString()
        },
        {
            id: 2,
            customerName: 'Ana Gómez',
            garmentType: 'Edredón King Size',
            serviceType: 'Lavado general',
            price: 45000,
            status: 'pendiente',
            isPaid: false,
            createdAt: new Date().toISOString()
        }
    ];
    nextId = 3;
    async findAll() {
        return JSON.parse(JSON.stringify(this.orders));
    }
    async findById(id) {
        const order = this.orders.find((o) => o.id === id);
        if (!order)
            return null;
        return JSON.parse(JSON.stringify(order));
    }
    async create(dto) {
        const newOrder = {
            id: this.nextId++,
            ...dto,
            createdAt: new Date().toISOString()
        };
        this.orders.push(newOrder);
        return JSON.parse(JSON.stringify(newOrder));
    }
    async update(id, dto) {
        const index = this.orders.findIndex((o) => o.id === id);
        if (index === -1)
            return null;
        this.orders[index] = {
            ...this.orders[index],
            ...dto
        };
        return JSON.parse(JSON.stringify(this.orders[index]));
    }
    async delete(id) {
        const index = this.orders.findIndex((o) => o.id === id);
        if (index === -1)
            return false;
        this.orders.splice(index, 1);
        return true;
    }
}
exports.OrdersRepository = OrdersRepository;
