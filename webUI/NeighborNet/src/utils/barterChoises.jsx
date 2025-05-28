import React from 'react';
import { 
  FaUtensils, 
  FaLeaf, 
  FaFootballBall, 
  FaTools, 
  FaBook, 
  FaCar, 
  FaBaby, 
  FaLaptop, 
  FaPaintBrush, 
  FaMusic, 
  FaDog, 
  FaTshirt 
} from 'react-icons/fa'

export const barterChoices = [
    { id: 'food', label: 'Food', icon: <FaUtensils className="text-warning" /> },
    { id: 'plants', label: 'Plants & Flowers', icon: <FaLeaf className="text-success" /> },
    { id: 'sports', label: 'Sport Equipment', icon: <FaFootballBall className="text-info" /> },
    { id: 'tools', label: 'Tools', icon: <FaTools className="text-error" /> },
    { id: 'books', label: 'Books', icon: <FaBook className="text-primary" /> },
    { id: 'transportation', label: 'Transportation', icon: <FaCar className="text-neutral" /> },
    { id: 'childcare', label: 'Childcare', icon: <FaBaby className="text-pink-400" /> },
    { id: 'tech', label: 'Tech Support', icon: <FaLaptop className="text-slate-600" /> },
    { id: 'art', label: 'Art Supplies', icon: <FaPaintBrush className="text-purple-500" /> },
    { id: 'music', label: 'Music Lessons', icon: <FaMusic className="text-blue-400" /> },
    { id: 'petcare', label: 'Pet Sitting', icon: <FaDog className="text-amber-700" /> },
    { id: 'clothing', label: 'Clothing', icon: <FaTshirt className="text-teal-500" /> }
  ];