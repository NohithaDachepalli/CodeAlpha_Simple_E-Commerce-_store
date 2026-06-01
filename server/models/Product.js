import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true, trim: true }
  },
  { timestamps: true }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: { type: String, required: true, index: true },
    price: { type: Number, required: true, min: 0 },
    image: { type: String, required: true },
    stock: { type: Number, required: true, min: 0 },
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    featured: { type: Boolean, default: false },
    reviews: [reviewSchema]
  },
  { timestamps: true }
);

export default mongoose.model('Product', productSchema);
