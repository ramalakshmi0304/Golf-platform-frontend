import api from './api.js';

export const golfService = {
  // Score Management
  submitScore: (scoreData) => api.post('/user/scores', scoreData),
  getMyScores: () => api.get('/user/scores'),

  // Charity Management
  getCharities: () => api.get('/charities'),
  updateMyCharity: (charityId) => api.patch('/user/charity', { charity_id: charityId }),

  // Admin Controls
  simulateDraw: (numbers) => api.post('/admin/draw/simulate', { winningNumbers: numbers }),
  finalizeDraw: (data) => api.post('/admin/draw/execute', data),

  // Stripe Payments
  createCheckout: (priceId, charityId) => 
    api.post('/stripe/create-checkout', { priceId, charityId }),
};