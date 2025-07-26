const matchService = require("../services/match.service");

const matchController = {
  async createMatch(req, res) {
    try {
      const { matchUserId } = req.body;
      const currentUserId = req.user.uid;
      
      console.log('Creating match:', { currentUserId, matchUserId });
      
      if (!currentUserId || !matchUserId) {
        return res.status(400).json({ success: false, message: 'Missing user IDs' });
      }

      const match = await matchService.createMatch(currentUserId, matchUserId);
      res.status(201).json({ success: true, data: match });
    } catch (error) {
      console.error('Match creation error:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  },

  async getMatches(req, res) {
    try {
      const userId = req.user.uid;
      const matches = await matchService.getMatchesByUserId(userId);
      res.status(200).json({ success: true, data: matches });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  async deleteMatch(req, res) {
    try {
      const { matchUserId } = req.params;
      const currentUserId = req.user.uid;

      await matchService.deleteMatch(currentUserId, matchUserId);
      res.status(200).json({ success: true, message: "Match deleted successfully" });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};

module.exports = matchController;