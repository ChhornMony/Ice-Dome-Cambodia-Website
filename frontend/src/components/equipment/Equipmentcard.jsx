"use client";

const EquipmentCard = ({ name, image }) => (
  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center hover:shadow-md transition cursor-pointer">
    <img src={image} alt={name} className="w-32 h-32 object-contain mb-4" />
    <p className="font-bold text-gray-800 text-center">{name}</p>
  </div>
);

export default EquipmentCard;