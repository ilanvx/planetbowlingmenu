import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, X, Edit, Trash2, Plus, Check, ArrowLeft } from 'lucide-react';
import type { MenuItemData } from '../App';

interface AdminMenuProps {
  menuItems: MenuItemData[];
  onSave: (items: MenuItemData[]) => void;
}

const categories = ['משקאות קלים', 'בירות', 'מאכלים'];

export function AdminMenu({ menuItems, onSave }: AdminMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showPanel, setShowPanel] = useState(false);
  const [items, setItems] = useState<MenuItemData[]>(menuItems);
  const [editingItem, setEditingItem] = useState<{ index: number; item: MenuItemData } | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [password, setPassword] = useState('');
  const CORRECT_PASSWORD = '1710';
  const MAX_ATTEMPTS = 3;
  const LOCK_DURATION = 30000; // 30 seconds

  const handlePasswordSubmit = () => {
    if (password === CORRECT_PASSWORD) {
      setShowPanel(true);
      setPassword('');
      setAttempts(0);
      setIsLocked(false);
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      setPassword('');
      
      if (newAttempts >= MAX_ATTEMPTS) {
        setIsLocked(true);
        setTimeout(() => {
          setIsLocked(false);
          setAttempts(0);
        }, LOCK_DURATION);
      }
    }
  };

  const handleAddItem = () => {
    const newItem: MenuItemData = {
      name: '',
      price: 0,
      description: '',
      image: '',
      category: 'משקאות קלים',
      gradient: 'from-purple-400 to-pink-600',
      is_shared: false,
      is_popular: false
    };
    setEditingItem({ index: items.length, item: newItem });
    setItems([...items, newItem]);
  };

  const handleItemChange = (field: keyof MenuItemData, value: any) => {
    if (!editingItem) return;
    
    const newItems = [...items];
    newItems[editingItem.index] = { 
      ...newItems[editingItem.index], 
      [field]: value 
    };
    setItems(newItems);
    setEditingItem({ 
      ...editingItem, 
      item: { ...editingItem.item, [field]: value } 
    });
  };

  const handleDeleteItem = (index: number) => {
    if (window.confirm('האם אתה בטוח שברצונך למחוק פריט זה?')) {
      const newItems = items.filter((_, i) => i !== index);
      setItems(newItems);
      setEditingItem(null);
    }
  };

  const handleSave = () => {
    onSave(items);
    setShowPanel(false);
    setIsOpen(false);
    setEditingItem(null);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'משקאות קלים': return 'text-blue-400';
      case 'בירות': return 'text-amber-400';
      case 'מאכלים': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-full shadow-lg transition-colors hidden md:block"
      >
        <Settings className="w-6 h-6" />
      </button>

      <AnimatePresence>
        {isOpen && !showPanel && !isLocked && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 left-4 z-50 bg-gray-900/95 backdrop-blur-sm rounded-lg shadow-xl p-4 w-80"
          >
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">הזן קוד גישה</h3>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handlePasswordSubmit()}
                className="w-full px-4 py-2 rounded-lg bg-gray-800/50 border border-purple-500/30 text-white"
                placeholder="* * * *"
              />
              {attempts > 0 && (
                <p className="text-red-400 text-sm">
                  קוד שגוי. נותרו {MAX_ATTEMPTS - attempts} ניסיונות
                </p>
              )}
              <button
                onClick={handlePasswordSubmit}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                כניסה
              </button>
            </div>
          </motion.div>
        )}

        {isLocked && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 left-4 z-50 bg-red-900/95 backdrop-blur-sm rounded-lg shadow-xl p-4 w-80"
          >
            <div className="text-center">
              <h3 className="text-lg font-semibold text-white">חשבון נעול</h3>
              <p className="text-red-200 text-sm mt-2">
                נסה שוב בעוד 30 שניות
              </p>
            </div>
          </motion.div>
        )}

        {showPanel && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed top-20 left-4 z-50 bg-gray-900/95 backdrop-blur-sm rounded-lg shadow-xl w-[90vw] max-w-[600px] max-h-[80vh] overflow-hidden flex flex-col"
          >
            <div className="p-4 border-b border-gray-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {editingItem && (
                  <button
                    onClick={() => setEditingItem(null)}
                    className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5 text-gray-400" />
                  </button>
                )}
                <h2 className="text-xl font-semibold text-white">
                  {editingItem ? 'עריכת פריט' : 'ניהול תפריט'}
                </h2>
              </div>
              <button
                onClick={() => {
                  setShowPanel(false);
                  setEditingItem(null);
                }}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {!editingItem ? (
                <div className="grid grid-cols-1 gap-4">
                  {items.map((item, index) => (
                    <div 
                      key={index}
                      className="bg-gray-800/50 rounded-lg p-3 flex items-center gap-4"
                    >
                      <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white font-medium truncate">{item.name}</h3>
                        <p className={`text-sm ${getCategoryColor(item.category)}`}>
                          {item.category}
                        </p>
                        <p className="text-gray-400 text-sm truncate">{item.description}</p>
                        <div className="flex gap-2 mt-1">
                          {item.is_popular && (
                            <span className="text-xs bg-yellow-500/20 text-yellow-300 px-2 py-0.5 rounded-full">
                              פופולרי
                            </span>
                          )}
                          {item.is_shared && (
                            <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full">
                              מנה זוגית
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setEditingItem({ index, item })}
                          className="p-2 hover:bg-purple-600/20 text-purple-400 hover:text-purple-300 rounded-lg transition-colors"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteItem(index)}
                          className="p-2 hover:bg-red-600/20 text-red-400 hover:text-red-300 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      value={editingItem.item.name}
                      onChange={(e) => handleItemChange('name', e.target.value)}
                      placeholder="שם המוצר"
                      className="w-full px-4 py-2 rounded-lg bg-gray-800/50 border border-purple-500/30 text-white"
                    />
                    <input
                      type="number"
                      value={editingItem.item.price}
                      onChange={(e) => handleItemChange('price', Number(e.target.value))}
                      placeholder="מחיר"
                      className="w-full px-4 py-2 rounded-lg bg-gray-800/50 border border-purple-500/30 text-white"
                    />
                  </div>
                  <select
                    value={editingItem.item.category}
                    onChange={(e) => handleItemChange('category', e.target.value)}
                    className="w-full px-4 py-2 rounded-lg bg-gray-800/50 border border-purple-500/30 text-white"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  <textarea
                    value={editingItem.item.description}
                    onChange={(e) => handleItemChange('description', e.target.value)}
                    placeholder="תיאור"
                    className="w-full px-4 py-2 rounded-lg bg-gray-800/50 border border-purple-500/30 text-white resize-none h-20"
                  />
                  <input
                    type="text"
                    value={editingItem.item.image}
                    onChange={(e) => handleItemChange('image', e.target.value)}
                    placeholder="קישור לתמונה"
                    className="w-full px-4 py-2 rounded-lg bg-gray-800/50 border border-purple-500/30 text-white"
                  />
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editingItem.item.is_popular}
                        onChange={(e) => handleItemChange('is_popular', e.target.checked)}
                        className="rounded border-purple-500/30 text-purple-600 focus:ring-purple-500"
                      />
                      <span className="text-gray-300">פופולרי</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editingItem.item.is_shared}
                        onChange={(e) => handleItemChange('is_shared', e.target.checked)}
                        className="rounded border-purple-500/30 text-purple-600 focus:ring-purple-500"
                      />
                      <span className="text-gray-300">מנה זוגית</span>
                    </label>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-gray-800 flex justify-between">
              {!editingItem ? (
                <>
                  <button
                    onClick={handleAddItem}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    הוסף פריט
                  </button>
                  <button
                    onClick={handleSave}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <Check className="w-5 h-5" />
                    שמור שינויים
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setEditingItem(null)}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-colors w-full"
                >
                  סיום עריכה
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}