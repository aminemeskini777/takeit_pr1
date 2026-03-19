import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../api/axios';

const Activation = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: searchParams.get('email') || '',
    password_temp: searchParams.get('token') || '',
    new_password: '',
    new_password_confirmation: ''
  });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      
      if (!formData.email.trim() || !formData.password_temp.trim()) {
        setMessage({
          type: 'error',
          text: 'Email et mot de passe temporaire sont requis'
        });
        setLoading(false);
        return;
      }

      if (!formData.new_password || !formData.new_password_confirmation) {
        setMessage({
          type: 'error',
          text: 'Les deux mots de passe sont requis'
        });
        setLoading(false);
        return;
      }

      if (formData.new_password !== formData.new_password_confirmation) {
        setMessage({
          type: 'error',
          text: 'Les mots de passe ne correspondent pas'
        });
        setLoading(false);
        return;
      }

      if (formData.new_password.length < 6) {
        setMessage({
          type: 'error',
          text: 'Le mot de passe doit contenir au moins 6 caractères'
        });
        setLoading(false);
        return;
      }

    
      const activationData = {
        email: formData.email.trim(),
        password_temp: formData.password_temp.trim(),
        new_password: formData.new_password,
        new_password_confirmation: formData.new_password_confirmation
      };

      console.log('Sending activation data:', activationData);

      const response = await api.post('/users/activate', activationData);
      
      setMessage({ 
        type: 'success', 
        text: response.data.message || 'Compte activé avec succès ! Redirection vers la connexion...' 
      });
      
      setTimeout(() => navigate('/login'), 3000);
    } catch (error) {
      console.error('Activation error:', error.response?.data || error.message || error);
      
      const errorMsg = error.response?.data?.message || 
                      error.response?.data?.error || 
                      'Erreur lors de l\'activation';
      
      setMessage({
        type: 'error',
        text: errorMsg
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <img src="/images/1.jpg" alt="TakeIt" className="h-16 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800">Activation du compte</h2>
          <p className="text-gray-600">Définissez votre mot de passe personnel</p>
        </div>

        {message.text && (
          <div className={`mb-4 p-3 rounded-lg text-sm ${
            message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
              readOnly={!!searchParams.get('email')} // Rendre readonly si vient de l'URL
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mot de passe temporaire
            </label>
            <input
              type="password"
              name="password_temp"
              value={formData.password_temp}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
              placeholder="Fourni dans votre email"
              readOnly={!!searchParams.get('token')} // Rendre readonly si vient de l'URL
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nouveau mot de passe
            </label>
            <input
              type="password"
              name="new_password"
              value={formData.new_password}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
              minLength={6}
              placeholder="Minimum 6 caractères"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirmer le mot de passe
            </label>
            <input
              type="password"
              name="new_password_confirmation"
              value={formData.new_password_confirmation}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
              placeholder="Répétez votre mot de passe"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? 'Activation...' : 'Activer mon compte'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Vous avez déjà un compte ?</p>
          <a href="/login" className="text-orange-500 hover:text-orange-600 font-medium">
            Se connecter
          </a>
        </div>
      </div>
    </div>
  );
};

export default Activation;