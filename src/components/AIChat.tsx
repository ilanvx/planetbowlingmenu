import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Send, X, Bot } from 'lucide-react';

interface Message {
  text: string;
  isBot: boolean;
}

interface MenuItem {
  name: string;
  price: number;
  description: string;
  category: string;
  aliases?: string[];
}

const menuData: MenuItem[] = [
  // משקאות קלים
  { name: 'מים', price: 10, description: 'מים מינרלים', category: 'משקאות', aliases: ['מים מינרלים', 'בקבוק מים'] },
  { name: 'מים בטעמים', price: 12, description: 'מים בטעמים שונים', category: 'משקאות', aliases: ['מים בטעם'] },
  { name: 'קולה', price: 12, description: 'קוקה קולה', category: 'משקאות', aliases: ['קוקה קולה', 'קוקה-קולה', 'coca cola'] },
  { name: 'קולה זירו', price: 12, description: 'קוקה קולה זירו', category: 'משקאות', aliases: ['זירו', 'דיאט קולה', 'קולה דיאט'] },
  { name: 'ספרייט', price: 12, description: 'ספרייט מוגז', category: 'משקאות', aliases: ['sprite'] },
  { name: 'ספרייט זירו', price: 12, description: 'ספרייט זירו', category: 'משקאות', aliases: ['ספרייט דיאט'] },
  { name: 'פאנטה', price: 12, description: 'פאנטה', category: 'משקאות', aliases: ['fanta'] },
  { name: 'תפוזים', price: 12, description: 'מיץ תפוזים טבעי', category: 'משקאות', aliases: ['מיץ תפוזים', 'תפוזינה'] },
  { name: 'תות בננה', price: 12, description: 'מיץ תות בננה', category: 'משקאות', aliases: ['מיץ תות', 'שייק תות'] },
  { name: 'לימונענע', price: 12, description: 'לימונדה עם נענע', category: 'משקאות', aliases: ['לימונדה', 'לימון נענע'] },
  { name: 'ענבים', price: 12, description: 'מיץ ענבים', category: 'משקאות', aliases: ['מיץ ענבים'] },
  { name: 'פיוזטי', price: 12, description: 'תה קר בטעם אפרסק', category: 'משקאות', aliases: ['תה קר', 'fuzetea'] },
  { name: 'סודה', price: 10, description: 'סודה מוגזת', category: 'משקאות', aliases: ['מים מוגזים'] },
  { name: 'קפה קר', price: 14, description: 'קפה קר', category: 'משקאות', aliases: ['אייס קפה', 'ice coffee'] },
  { name: 'ברד', price: 10, description: 'ברד בטעמים', category: 'משקאות', aliases: ['ברד בטעם', 'קרח מרוסק'] },
  { name: 'XL', price: 12, description: 'משקה אנרגיה', category: 'משקאות', aliases: ['אקסל', 'משקה אנרגיה'] },

  // בירות
  { name: 'טובורג', price: 24, description: 'בירה מהחבית', category: 'בירות', aliases: ['tuborg'] },
  { name: 'קורונה', price: 24, description: 'בירת קורונה', category: 'בירות', aliases: ['corona'] },
  { name: 'סטלה', price: 24, description: 'בירת סטלה', category: 'בירות', aliases: ['stella'] },
  { name: 'קסטיל רוז', price: 26, description: 'בירת קסטיל רוז', category: 'בירות', aliases: ['kasteel'] },
  { name: 'קרלסברג שליש', price: 22, description: 'בירה מהחבית', category: 'בירות', aliases: ['carlsberg'] },
  { name: 'קרלסברג חצי', price: 28, description: 'בירה מהחבית', category: 'בירות', aliases: ['carlsberg'] },

  // מאכלים
  { 
    name: 'פיצה זוגית', 
    price: 34, 
    description: 'פיצה עם רוטב עגבניות וגבינה צהובה. תוספות: חצי מגש 4₪, מגש שלם 8₪ (זיתים ירוקים/תירס/פטריות)', 
    category: 'מאכלים',
    aliases: ['פיצה', 'pizza']
  },
  { 
    name: 'נאצ\'וס אישי', 
    price: 21, 
    description: 'נאצ\'וס במנה אישית, מגיע עם רוטב סלסה רגיל \\ חריף לבחירה', 
    category: 'מאכלים',
    aliases: ['נאצוס קטן', 'נאצוס יחיד', 'nachos']
  },
  { 
    name: 'נאצ\'וס זוגי', 
    price: 29, 
    description: 'נאצ\'וס במנה זוגית, מגיע עם רוטב סלסה רגיל וחריף', 
    category: 'מאכלים',
    aliases: ['נאצוס גדול', 'נאצוס משפחתי']
  },
  { 
    name: 'פרעצל', 
    price: 10, 
    description: 'פרעצל שוקולד או מלוח לבחירה', 
    category: 'מאכלים',
    aliases: ['בייגלה', 'pretzel']
  }
];

export function AIChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const findMenuItem = (text: string): MenuItem[] => {
    text = text.toLowerCase();
    return menuData.filter(item => {
      const searchTerms = [
        item.name.toLowerCase(),
        ...(item.aliases?.map(alias => alias.toLowerCase()) || []),
        item.category.toLowerCase()
      ];
      return searchTerms.some(term => text.includes(term));
    });
  };

  const generateResponse = (text: string): string => {
    text = text.toLowerCase();
    
    // בדיקת ברכות
    if (text.includes('שלום') || text.includes('היי') || text.includes('הי ') || text.includes('hey') || text.includes('hello')) {
      return 'היי! אשמח לעזור לך עם התפריט שלנו. מה תרצה לדעת?';
    }

    if (text.includes('תודה') || text.includes('thanks')) {
      return 'בשמחה! אם תצטרך עוד משהו, אני כאן.';
    }

    // חיפוש פריטים בתפריט
    const items = findMenuItem(text);

    // שאלות על מחירים
    if (text.includes('מחיר') || text.includes('עולה') || text.includes('כמה') || text.includes('price')) {
      if (items.length > 0) {
        if (items.length === 1) {
          const item = items[0];
          return `${item.name} עולה ${item.price}₪. ${item.description}`;
        } else {
          return items.map(item => `${item.name}: ${item.price}₪`).join('\n');
        }
      }
    }

    // מידע על פריטים ספציפיים
    if (items.length > 0) {
      if (items.length === 1) {
        const item = items[0];
        return `${item.name} - ${item.description}. המחיר הוא ${item.price}₪`;
      } else {
        return `מצאתי כמה פריטים שיכולים להתאים:\n${items.map(item => `${item.name} (${item.price}₪)`).join('\n')}`;
      }
    }

    // שאלות על קטגוריות
    if (text.includes('משקאות') || text.includes('לשתות') || text.includes('drink')) {
      return 'יש לנו מבחר משקאות: משקאות קלים כמו קולה, ספרייט ופאנטה, מיצים טבעיים כמו תפוזים ולימונענע, וגם משקאות מיוחדים כמו XL וקפה קר. כל המשקאות הקלים עולים 12₪, חוץ ממים (10₪) וקפה קר (14₪).';
    }

    if (text.includes('אוכל') || text.includes('לאכול') || text.includes('food')) {
      return 'בתפריט שלנו תמצאו: פיצה זוגית (34₪) עם אפשרות לתוספות, נאצ\'וס במנה אישית (21₪) או זוגית (29₪) עם רטבים, ופרעצל טעים (10₪) בגרסת שוקולד או מלוח.';
    }

    if (text.includes('בירה') || text.includes('בירות') || text.includes('beer')) {
      return 'יש לנו מבחר בירות איכותיות: טובורג (24₪), קורונה (24₪), סטלה (24₪), קסטיל רוז (26₪), וקרלסברג מהחבית (שליש - 22₪, חצי - 28₪).';
    }

    if (text.includes('המלצה') || text.includes('מומלץ') || text.includes('recommend')) {
      return 'הפיצה הזוגית שלנו (34₪) מאוד פופולרית! היא מגיעה עם רוטב עגבניות וגבינה צהובה, ואפשר להוסיף תוספות. הנאצ\'וס הזוגי (29₪) גם מעולה לשיתוף!';
    }

    // תשובת ברירת מחדל
    return 'אשמח לעזור! אני יכול לספר לך על המשקאות, הבירות והמאכלים שלנו. מה מעניין אותך?';
  };

  const handleSend = () => {
    if (!input.trim()) return;

    setMessages(prev => [...prev, { text: input, isBot: false }]);
    const response = generateResponse(input);
    setTimeout(() => {
      setMessages(prev => [...prev, { text: response, isBot: true }]);
    }, 500);
    setInput('');
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-full shadow-lg"
        aria-label="צ'אט עם הבוט"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-16 right-0 bg-gray-900/95 backdrop-blur-sm rounded-lg shadow-xl w-80 sm:w-96 max-h-[500px] flex flex-col"
          >
            <div className="p-4 border-b border-gray-700 flex items-center gap-2">
              <Bot className="w-5 h-5 text-purple-400" />
              <span className="font-medium">בוט התפריט</span>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 && (
                <div className="text-gray-400 text-center">
                  היי! אני כאן לעזור לך עם התפריט. מה תרצה לדעת?
                </div>
              )}
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      msg.isBot
                        ? 'bg-gray-800 text-white'
                        : 'bg-purple-600 text-white'
                    }`}
                    style={{ whiteSpace: 'pre-line' }}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t border-gray-700">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="שאל אותי על התפריט..."
                  className="flex-1 bg-gray-800 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button
                  onClick={handleSend}
                  className="bg-purple-600 hover:bg-purple-700 text-white p-2 rounded-lg"
                  aria-label="שלח"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}