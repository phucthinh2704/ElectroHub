import React, { useState } from "react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { createSlug } from "../utils/slug";
import { 
  ChevronRight,
  Tablet,
  Laptop,
  Smartphone,
  Tv,
  Printer,
  Speaker,
  Camera,
  Headphones 
} from "lucide-react";

// Hàm để lấy icon dựa trên tiêu đề danh mục
const getCategoryIcon = (title) => {
  const titleLower = title.toLowerCase();
  
  if (titleLower.includes("tablet")) return Tablet;
  if (titleLower.includes("laptop")) return Laptop;
  if (titleLower.includes("smartphone") || titleLower.includes("phone")) return Smartphone;
  if (titleLower.includes("television") || titleLower.includes("tv")) return Tv;
  if (titleLower.includes("printer")) return Printer;
  if (titleLower.includes("speaker")) return Speaker;
  if (titleLower.includes("camera")) return Camera;
  if (titleLower.includes("accessory") || titleLower.includes("accessories")) return Headphones;
  
  // Default icon for other categories
  return Headphones;
};

const Sidebar = () => {
  const { categories } = useSelector((state) => state.app);
  const [hoveredItem, setHoveredItem] = useState(null);

  return (
    <div className="flex flex-col border border-gray-200 rounded-md shadow-sm overflow-hidden">
      <div className="bg-main text-white text-base uppercase font-medium px-5 py-4 tracking-wide">
        ALL COLLECTIONS
      </div>
      
      <div className="flex flex-col">
        {categories.map((category) => {
          const CategoryIcon = getCategoryIcon(category.title);
          
          return (
            <NavLink
              key={category._id}
              to={createSlug(category.title)}
              className={({ isActive }) =>
                isActive
                  ? "bg-main text-white text-base font-medium px-6 py-3 border-b border-gray-100 flex items-center justify-between transition-all duration-300"
                  : "text-gray-800 text-base font-normal px-6 py-3 border-b border-gray-100 hover:bg-[#ffeded] hover:text-main transition-all duration-300 flex items-center justify-between"
              }
              onMouseEnter={() => setHoveredItem(category._id)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <span className="flex items-center gap-3">
                <CategoryIcon size={18} className="flex-shrink-0" />
                {category.title}
              </span>
              <ChevronRight 
                size={16} 
                className={`transition-transform duration-300 ${
                  hoveredItem === category._id ? "translate-x-2" : ""
                }`} 
              />
            </NavLink>
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;