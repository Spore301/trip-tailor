import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaGlobe, FaUser, FaCalendar, FaRupeeSign, FaCompass } from 'react-icons/fa';
import { FaPaperPlane } from 'react-icons/fa6';
import { tripApi } from '../services/api';
import { ExperienceTypeValues, type TripRequest } from '../types/trip';
import { AxiosError } from 'axios';

export default function TripForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<TripRequest>({
    destination: '',
    people_count: 4,
    days: 5,
    budget: 0,
    experience: ExperienceTypeValues.ADVENTURE,
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await tripApi.createTripRequest(formData);
      setSuccess(`Trip request submitted successfully! Request ID: ${response.id}`);
      // Reset form
      setFormData({
        destination: '',
        people_count: 4,
        days: 5,
        budget: 0,
        experience: ExperienceTypeValues.ADVENTURE,
      });
      navigate('/mock'); // Navigate to MockPage after successful submission
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'Failed to submit trip request. Please try again.');
      } else if (err instanceof AxiosError && err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Failed to submit trip request. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'people_count' || name === 'days' || name === 'budget' 
        ? Number(value) 
        : value,
    }));
  };

  return (
    <div className="min-h-screen bg-cover bg-center bg-fixed relative" 
         style={{
           backgroundImage: 'url(https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=1920&q=80)',
         }}>
      {/* Overlay for better readability */}
      <div className="absolute inset-0 bg-black/20"></div>
      
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden">
          {/* Gradient Header */}
          <div className="bg-gradient-to-r from-orange-500 to-red-500 p-8 text-white">
            <h1 className="text-4xl font-bold mb-2">Plan Your Trip</h1>
            <p className="text-lg opacity-90">Tell us about your dream destination</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {/* Destination */}
            <div>
              <label htmlFor="destination" className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                <FaGlobe className="text-orange-500" />
                Destination
              </label>
              <input
                type="text"
                id="destination"
                name="destination"
                value={formData.destination}
                onChange={handleChange}
                placeholder="Where do you want to go?"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
              />
            </div>

            {/* Travelers */}
            <div>
              <label htmlFor="people_count" className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                <FaUser className="text-orange-500" />
                Travelers
              </label>
              <input
                type="number"
                id="people_count"
                name="people_count"
                value={formData.people_count}
                onChange={handleChange}
                min="1"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
              />
            </div>

            {/* Days */}
            <div>
              <label htmlFor="days" className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                <FaCalendar className="text-orange-500" />
                Days
              </label>
              <input
                type="number"
                id="days"
                name="days"
                value={formData.days}
                onChange={handleChange}
                min="1"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
              />
            </div>

            {/* Budget */}
            <div>
              <label htmlFor="budget" className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                <FaRupeeSign className="text-orange-500" />
                Budget (₹)
              </label>
              <input
                type="number"
                id="budget"
                name="budget"
                value={formData.budget || ''}
                onChange={handleChange}
                placeholder="Enter your budget"
                min="0"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
              />
            </div>

            {/* Experience Type */}
            <div>
              <label htmlFor="experience" className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                <FaCompass className="text-orange-500" />
                Experience Type
              </label>
              <select
                id="experience"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
              >
                <option value={ExperienceTypeValues.ADVENTURE}>Adventure</option>
                <option value={ExperienceTypeValues.OFFBEAT}>Offbeat</option>
                <option value={ExperienceTypeValues.STAYCATION}>Staycation</option>
              </select>
            </div>

            {/* Error/Success Messages */}
            {error && (
              <div className="bg-white border border-white text-white ">
                {error}
              </div>
            )}
            
            {success && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg">
                {success}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-lg hover:from-orange-600 hover:to-red-600 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg py-4 px-6"
            >
              {loading ? (
                'Submitting...'
              ) : (
                <>
                  <FaPaperPlane className="text-white " />
                  Submit Request
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

