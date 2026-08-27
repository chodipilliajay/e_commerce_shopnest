import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    shippingInfo: {
        address: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        country: { type: String, required: true },
        pinCode: { type: Number, required: true },
        phoneNo: { type: String, required: true },
    },
    orderItems: [
        {
            name: { type: String, required: true },
            quantity: { type: Number, required: true },
            image: { type: String, required: true },
            price: { type: Number, required: true },
            product: { type: mongoose.Schema.ObjectId, ref: 'Product', required: true },
        },
    ],
    user: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
    paymentInfo: {
        id: { type: String },
        status: { type: String },
    },
    paidAt: { type: Date },
    itemsPrice: { type: Number, required: true, default: 0 },
    taxPrice: { type: Number, required: true, default: 0 },
    shippingPrice: { type: Number, required: true, default: 0 },
    totalPrice: { type: Number, required: true, default: 0 },
    orderStatus: {
        type: String,
        enum: ['Processing', 'Shipped', 'Delivered'],
        default: 'Processing',
    },
    deliveredAt: { type: Date },
}, { timestamps: true });

export default mongoose.model('Order', orderSchema);
