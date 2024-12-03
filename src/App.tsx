import React, { useState, useEffect } from 'react';
import { MenuSection } from './components/MenuSection';
import { MenuItem } from './components/MenuItem';
import { AdminMenu } from './components/AdminMenu';
import { supabase } from './lib/supabase';
import { 
  GlassWater, Beer, Pizza
} from 'lucide-react';

export interface MenuItemData {
  id?: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
  is_shared?: boolean;
  is_popular?: boolean;
  gradient?: string;
}

function App() {
  const [menuItems, setMenuItems] = useState<MenuItemData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .order('category', { ascending: true });

      if (error) {
        console.error('Error fetching menu items:', error);
        return;
      }

      if (data) {
        setMenuItems(data);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (updatedItems: MenuItemData[]) => {
    try {
      // Delete all existing items
      const { error: deleteError } = await supabase
        .from('menu_items')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000');

      if (deleteError) {
        console.error('Error deleting items:', deleteError);
        return;
      }

      // Insert new items
      const { error: insertError } = await supabase
        .from('menu_items')
        .insert(updatedItems.map(item => ({
          name: item.name,
          price: item.price,
          description: item.description,
          image: item.image,
          category: item.category,
          is_shared: item.is_shared || false,
          is_popular: item.is_popular || false,
          gradient: item.gradient
        })));

      if (insertError) {
        console.error('Error inserting items:', insertError);
        return;
      }

      // Refresh the items
      fetchMenuItems();
    } catch (error) {
      console.error('Error saving items:', error);
    }
  };

  const groupedItems = menuItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push({
      ...item,
      isShared: item.is_shared,
      isPopular: item.is_popular
    });
    return acc;
  }, {} as Record<string, MenuItemData[]>);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="text-white text-xl">טוען...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 pb-20">
      <AdminMenu menuItems={menuItems} onSave={handleSave} />
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            תפריט פלאנט באולינג
          </h1>
          <p className="text-purple-200 text-sm sm:text-base">
            התפריט שלנו מציע מגוון משקאות ונשנושים
          </p>
        </header>

        {groupedItems['משקאות קלים'] && (
          <MenuSection title="משקאות קלים" icon={<GlassWater className="w-6 h-6" />}>
            {groupedItems['משקאות קלים'].map((item) => (
              <MenuItem key={item.id || item.name} {...item} />
            ))}
          </MenuSection>
        )}

        {groupedItems['בירות'] && (
          <MenuSection title="בירות" icon={<Beer className="w-6 h-6" />}>
            {groupedItems['בירות'].map((item) => (
              <MenuItem key={item.id || item.name} {...item} />
            ))}
          </MenuSection>
        )}

        {groupedItems['מאכלים'] && (
          <MenuSection title="מאכלים" icon={<Pizza className="w-6 h-6" />}>
            {groupedItems['מאכלים'].map((item) => (
              <MenuItem key={item.id || item.name} {...item} />
            ))}
          </MenuSection>
        )}
      </div>
    </div>
  );
}

export default App;