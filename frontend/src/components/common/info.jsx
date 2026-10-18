"use client";

import { Calendar, DollarSign, MapPin } from 'lucide-react';

const InfoCard = ({ title, detail, price, subDetail, type }) => {
  const icons = {
    calendar: <Calendar className="text-blue-600" />,
    price: <DollarSign className="text-blue-600" />,
    location: <MapPin className="text-blue-600" />
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg flex items-center gap-4">
      <div className="p-4 bg-blue-50 rounded-lg">{icons[type]}</div>
      <div>
        <h3 className="text-gray-500 text-sm font-bold uppercase">{title}</h3>
        <p className="text-lg font-bold text-gray-800">{detail}</p>
        {price && <p className="text-blue-600 font-bold">{price}</p>}
        {subDetail && <p className="text-gray-500 text-sm">{subDetail}</p>}
      </div>
    </div>
  );
};

export default InfoCard;