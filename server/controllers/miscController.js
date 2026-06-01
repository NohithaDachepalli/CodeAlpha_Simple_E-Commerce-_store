import Subscriber from '../models/Subscriber.js';

export const subscribe = async (req, res) => {
  const subscriber = await Subscriber.findOneAndUpdate(
    { email: req.body.email },
    { email: req.body.email },
    { upsert: true, new: true }
  );
  res.status(201).json({ message: 'Subscribed successfully', subscriber });
};

export const contact = async (req, res) => {
  res.json({ message: 'Thanks for reaching out. Our team will respond shortly.' });
};
