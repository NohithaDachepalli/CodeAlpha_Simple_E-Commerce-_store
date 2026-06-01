import { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const categories = [
    {
      title: 'General',
      items: [
        {
          q: 'What is ShopEase?',
          a: 'ShopEase is a premium, modern e-commerce platform offering carefully curated tech gadgets, home essentials, fashion pieces, and lifestyle items with quick delivery and safe payment options.'
        },
        {
          q: 'Do I need an account to place an order?',
          a: 'While you can browse products and add them to your cart, you will need to register a free account to complete checkout. This allows you to track orders and view your transaction history.'
        }
      ]
    },
    {
      title: 'Shipping & Delivery',
      items: [
        {
          q: 'How long does delivery take?',
          a: 'Orders are processed within 1-2 business days. Standard shipping takes 3-5 business days, and express shipping takes 1-2 business days depending on your location.'
        },
        {
          q: 'How much does shipping cost?',
          a: 'Shipping is free for all orders over $99. For orders below $99, a flat standard shipping fee of $8.00 applies.'
        },
        {
          q: 'Do you ship internationally?',
          a: 'Currently, we support nationwide shipping. We are working on expanding our services to international destinations soon.'
        }
      ]
    },
    {
      title: 'Payments & Security',
      items: [
        {
          q: 'What payment methods do you accept?',
          a: 'We support multiple payment methods for your convenience, including Credit/Debit Cards, UPI, and Cash on Delivery (COD).'
        },
        {
          q: 'Is my payment information secure?',
          a: 'Absolutely. We use industry-standard HTTPS encryption and secure payment gateways. We never store your full card details or CVV on our servers.'
        }
      ]
    },
    {
      title: 'Returns & Refunds',
      items: [
        {
          q: 'What is your return policy?',
          a: 'We offer a 30-day return policy for unused products in their original packaging. You can initiate a return by contacting our customer support team.'
        },
        {
          q: 'How long does a refund take?',
          a: 'Once we receive and inspect your returned item, your refund will be processed and credited back to your original payment method within 5-7 business days.'
        }
      ]
    }
  ];

  const toggle = (globalIndex) => {
    setOpenIndex(openIndex === globalIndex ? null : globalIndex);
  };

  let globalCounter = 0;

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="text-center">
        <HelpCircle className="mx-auto text-emerald-600 dark:text-emerald-500" size={48} />
        <h1 className="mt-4 text-4xl font-extrabold tracking-normal text-slate-900 dark:text-white">
          Frequently Asked Questions
        </h1>
        <p className="mt-3 text-lg text-slate-600 dark:text-slate-400">
          Everything you need to know about our services, shipping, and returns.
        </p>
      </div>

      <div className="mt-12 space-y-8">
        {categories.map((category) => (
          <div key={category.title} className="space-y-4">
            <h2 className="text-xl font-bold border-b border-slate-200 pb-2 text-slate-800 dark:border-slate-800 dark:text-slate-200">
              {category.title}
            </h2>
            <div className="space-y-3">
              {category.items.map((item) => {
                const currentIndex = globalCounter++;
                const isOpen = openIndex === currentIndex;

                return (
                  <div
                    key={item.q}
                    className="panel overflow-hidden transition-all duration-300 border border-slate-200 hover:border-emerald-500/50 dark:border-slate-800 dark:hover:border-emerald-500/30"
                  >
                    <button
                      type="button"
                      onClick={() => toggle(currentIndex)}
                      className="flex w-full items-center justify-between p-5 text-left font-semibold text-slate-900 dark:text-slate-100"
                    >
                      <span>{item.q}</span>
                      {isOpen ? (
                        <ChevronUp className="text-emerald-600" size={18} />
                      ) : (
                        <ChevronDown className="text-slate-400" size={18} />
                      )}
                    </button>
                    
                    {isOpen && (
                      <div className="bg-slate-50/50 p-5 pt-0 text-sm leading-relaxed text-slate-600 dark:bg-slate-900/30 dark:text-slate-300 border-t border-slate-100 dark:border-slate-800/50 animate-fadeIn">
                        <p className="mt-4">{item.a}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;
