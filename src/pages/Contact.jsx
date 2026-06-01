import { useState } from 'react';
import toast from 'react-hot-toast';
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';
import api from '../services/api.js';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return toast.error('Please enter your name');
    if (!form.email.trim()) return toast.error('Please enter your email');
    if (!form.message.trim() || form.message.trim().length < 10) {
      return toast.error('Message must be at least 10 characters long');
    }

    setLoading(true);
    try {
      const { data } = await api.post('/contact', form);
      toast.success(data.message || 'Thank you for reaching out!');
      setForm({ name: '', email: '', message: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const contactDetails = [
    {
      icon: Mail,
      title: 'Email Us',
      content: 'support@shopease.dev',
      description: 'We reply within 24 hours'
    },
    {
      icon: Phone,
      title: 'Call Us',
      content: '+1 (800) 555-0199',
      description: 'Mon-Fri from 9am to 6pm'
    },
    {
      icon: MapPin,
      title: 'Visit Us',
      content: '100 Innovation Way, Suite 400',
      description: 'San Francisco, CA 94107'
    },
    {
      icon: Clock,
      title: 'Business Hours',
      content: '9:00 AM - 6:00 PM EST',
      description: 'Monday to Friday'
    }
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold tracking-normal text-slate-900 dark:text-white">
          Get in Touch
        </h1>
        <p className="mt-3 text-lg text-slate-600 dark:text-slate-400">
          Have questions or need assistance? We are here to help you.
        </p>
      </div>

      <div className="mt-12 grid gap-8 lg:grid-cols-12">
        {/* Left Side: Contact Form */}
        <div className="panel p-6 shadow-sm border border-slate-200 dark:border-slate-800 lg:col-span-7">
          <h2 className="text-xl font-bold mb-6 text-slate-900 dark:text-white">
            Send us a Message
          </h2>
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                Your Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                className="input mt-1.5"
                placeholder="John Doe"
                value={form.name}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                className="input mt-1.5"
                placeholder="john@example.com"
                value={form.email}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                className="input mt-1.5 min-h-[140px] resize-y"
                placeholder="How can we help you?"
                value={form.message}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
            <button
              type="submit"
              className="btn-primary w-full py-3 text-base font-semibold"
              disabled={loading}
            >
              {loading ? (
                'Sending Message...'
              ) : (
                <>
                  <Send size={16} />
                  Send Message
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Side: Contact Details & Mock Map */}
        <div className="space-y-6 lg:col-span-5">
          <div className="grid gap-4 sm:grid-cols-2">
            {contactDetails.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="panel p-4 flex flex-col gap-2 border border-slate-200 dark:border-slate-800">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-950/50">
                    <Icon className="text-emerald-600 dark:text-emerald-500" size={20} />
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white mt-1">
                    {item.title}
                  </h3>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    {item.content}
                  </p>
                  <p className="text-xs text-slate-500">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Styled Mock SVG Map */}
          <div className="panel p-4 border border-slate-200 dark:border-slate-800 overflow-hidden relative h-56 bg-slate-100 dark:bg-slate-900 flex items-center justify-center">
            <svg
              className="absolute inset-0 h-full w-full opacity-30 dark:opacity-20 text-emerald-600"
              xmlns="http://www.w3.org/2000/svg"
              width="100%"
              height="100%"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              <defs>
                <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                  <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
              <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="5,5" />
              <circle cx="50" cy="50" r="25" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3,3" />
            </svg>
            <div className="relative z-10 flex flex-col items-center text-center">
              <MapPin className="text-rose-500 animate-bounce" size={32} fill="currentColor" fillOpacity={0.2} />
              <span className="mt-2 font-bold text-slate-900 dark:text-white text-sm">Our Corporate Headquarters</span>
              <span className="text-xs text-slate-500">San Francisco, CA</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
