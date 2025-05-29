import React from 'react';
import * as FaIcons from 'react-icons/fa';


export const categories = [
    { id: 'repairs', label: 'Home Repairs', icon: <FaIcons.FaTools className="text-warning" /> },
    { id: 'transportation', label: 'Transportation', icon: <FaIcons.FaCar className="text-blue-500" /> },
    { id: 'childcare', label: 'Childcare', icon: <FaIcons.FaBaby className="text-pink-400" /> },
    { id: 'petcare', label: 'Pet Care', icon: <FaIcons.FaDog className="text-amber-700" /> },
    { id: 'technology', label: 'Tech Help', icon: <FaIcons.FaLaptop className="text-slate-600" /> },
    { id: 'moving', label: 'Moving/Heavy Lifting', icon: <FaIcons.FaDumbbell className="text-red-600" /> },
    { id: 'gardening', label: 'Gardening/Yard Work', icon: <FaIcons.FaLeaf className="text-green-500" /> },
    { id: 'cooking', label: 'Cooking/Meals', icon: <FaIcons.FaUtensils className="text-yellow-600" /> },
    { id: 'errands', label: 'Errands', icon: <FaIcons.FaShoppingBag className="text-indigo-500" /> },
    { id: 'tutoring', label: 'Academic/Tutoring', icon: <FaIcons.FaGraduationCap className="text-purple-500" /> },
    { id: 'health', label: 'Health Assistance', icon: <FaIcons.FaMedkit className="text-red-500" /> },
    { id: 'cleaning', label: 'Cleaning', icon: <FaIcons.FaBroom className="text-teal-500" /> },
    { id: 'other', label: 'Other', icon: <FaIcons.FaHome className="text-gray-500" /> }
  ];