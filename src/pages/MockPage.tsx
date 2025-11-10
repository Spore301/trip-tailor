// frontend/src/pages/MockPage.tsx
import { useState } from "react";
import "./../index.css"; // ✅ reuse global CSS
// If you use Tailwind or global styles, this is enough

import goaImg from "../assets/goa.jpg";   // ← adjust path if needed
import mounImg from "../assets/moun.jpg"
import mumbaiImg from "../assets/mumbai.jpg"
import kerImg from "../assets/kerala.jpg"
import jaiImg from "../assets/jaipur.jpg"
import rannImg from "../assets/rann.jpg"
import annImg from "../assets/a&n.jpg"
import oldMonkImg from "../assets/oldmonk.jpg"
import rajImg from "../assets/raj.jpg"
import teaImg from "../assets/tea.jpg"

const mockTrips = [
  {
    name: "Weekend in Goa",
    category: "Leisure",
    cost: 14999,
    description: "A relaxing getaway on the beaches of Goa.",
    image: goaImg,
  },
  {
    name: "Himalayan Trek",
    category: "Adventure",
    cost: 29999,
    description: "A thrilling trekking experience through the Himalayas.",
    image: mounImg,
  },
  {
    name: "City Lights - Mumbai",
    category: "Urban",
    cost: 9999,
    description: "Explore Mumbai’s vibrant nightlife and culture.",
    image: mumbaiImg,
  },
  {
    name: "Backwaters of Kerala",
    category: "Nature",
    cost: 17999,
    description: "Experience the serene beauty of Kerala’s backwaters on a luxury houseboat.",
    image: kerImg,
  },
  {
    name: "Jaipur Heritage Tour",
    category: "Cultural",
    cost: 13999,
    description: "Explore the royal palaces, forts, and vibrant markets of the Pink City.",
    image: jaiImg,
  },
  {
    name: "Rann of Kutch Festival",
    category: "Cultural",
    cost: 18999,
    description: "Witness the mesmerizing white desert and colorful folk celebrations in Gujarat.",
    image: rannImg,
  },
  {
    name: "Andaman Islands Escape",
    category: "Beach",
    cost: 24999,
    description: "Dive into crystal-clear waters and relax on pristine white beaches of Andaman.",
    image: annImg,
  },
  {
    name: "Sikkim Monastery Circuit",
    category: "Spiritual",
    cost: 15999,
    description: "Visit the ancient monasteries and peaceful landscapes of Sikkim.",
    image: oldMonkImg,
  },
  {
    name: "Desert Safari - Jaisalmer",
    category: "Adventure",
    cost: 21999,
    description: "Ride the golden dunes on a camel and camp under the stars in the Thar Desert.",
    image: rajImg,
  },
  {
    name: "Darjeeling Tea Retreat",
    category: "Leisure",
    cost: 16999,
    description: "Sip fresh tea in colonial hill stations with a backdrop of Kanchenjunga.",
    image: teaImg,
  },
];

export default function MockPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", ...new Set(mockTrips.map((trip) => trip.category))];

  const filteredTrips =
    selectedCategory === "All"
      ? mockTrips
      : mockTrips.filter((trip) => trip.category === selectedCategory);

  return (
    <div className="min-h-screen bg-white text-gray-800">
      <header className="p-6 shadow-md text-center bg-gradient-to-r from-orange-500 to-red-500">
        <h1 className="text-3xl font-bold text-white">TripTailor (Demo)</h1>
        <p className="text-white mt-2">Mock data version – static showcase</p>
      </header>

      <div className="p-8">
        <div className="mb-6 rounded-md bg-gradient-to-r from-orange-500 to-red-500 p-4 shadow-sm">
          <label htmlFor="category-filter" className="block text-lg  font-medium text-white mb-[20px] ">
            Filter by Category:
          </label>
          <select
            id="category-filter"
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base  border-gray-300 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm rounded-md shadow-sm"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <main className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTrips.map((trip) => (
            <div
              key={trip.name}
              className="flex flex-col gap-[20px] rounded-2xl overflow-hidden shadow hover:shadow-lg transition bg-white border "
            >
              <img src={trip.image} alt={trip.name} className="w-full h-[300px] object-cover" />
              <div className="p-4 flex flex-col px-[40px]">
                <div className="flex items-center justify-between mb-[20px]">
                  <h2 className="text-xl font-semibold">{trip.name}</h2>
                  <p className="text-sm text-orange-300 px-[10px] py-[3px] rounded-md border border-orange-300 inline-flex items-center justify-center">{trip.category}</p>
                </div>
                <p className="mt-2 text-gray-700">{trip.description}</p>
                <p className="mt-3 text-orange-500 font-bold">₹{trip.cost.toLocaleString()}</p>
                <button className="px-[30px] py-[10px] mt-[15px] mb-[15px] inline-flex items-center justify-center rounded-[10px] border-[2px] border-orange-500 text-orange-500 font-medium hover:text-white hover:bg-gradient-to-r hover:from-orange-500 hover:to-red-500 transition">View Details</button>
              </div>
            </div>
          ))}
        </main>
      </div>



    </div>
  );
}

