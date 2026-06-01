import Product from '../models/Product.js';

export const getProducts = async (req, res) => {
  const pageSize = Number(req.query.limit) || 8;
  const page = Number(req.query.page) || 1;
  const keyword = req.query.search
    ? { name: { $regex: req.query.search, $options: 'i' } }
    : {};
  const category = req.query.category ? { category: req.query.category } : {};
  const price = {};
  if (req.query.minPrice) price.$gte = Number(req.query.minPrice);
  if (req.query.maxPrice) price.$lte = Number(req.query.maxPrice);

  const sortMap = {
    newest: { createdAt: -1 },
    priceLow: { price: 1 },
    priceHigh: { price: -1 },
    rating: { rating: -1 }
  };

  const query = {
    ...keyword,
    ...category,
    ...(Object.keys(price).length ? { price } : {})
  };

  const count = await Product.countDocuments(query);
  const products = await Product.find(query)
    .sort(sortMap[req.query.sort] || sortMap.newest)
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  const categories = await Product.distinct('category');
  res.json({ products, page, pages: Math.ceil(count / pageSize), count, categories });
};

export const getProductById = async (req, res) => {
  const product = await Product.findById(req.params.id).populate('reviews.user', 'name');
  if (!product) return res.status(404).json({ message: 'Product not found' });

  const related = await Product.find({
    _id: { $ne: product._id },
    category: product.category
  }).limit(4);

  res.json({ product, related });
};

export const createProduct = async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json(product);
};

export const updateProduct = async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json(product);
};

export const deleteProduct = async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json({ message: 'Product deleted' });
};

export const addReview = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });

  const alreadyReviewed = product.reviews.find((review) => review.user.toString() === req.user._id.toString());
  if (alreadyReviewed) return res.status(400).json({ message: 'Product already reviewed' });

  product.reviews.push({
    user: req.user._id,
    name: req.user.name,
    rating: Number(req.body.rating),
    comment: req.body.comment
  });
  product.numReviews = product.reviews.length;
  product.rating = product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length;

  await product.save();
  res.status(201).json({ message: 'Review added' });
};
