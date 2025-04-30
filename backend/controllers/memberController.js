const memberModel = require('../models/memberModel');

exports.getAllMembers = async (req, res) => {
  try {
    const members = await memberModel.findAll();
    res.status(200).json(members);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMemberById = async (req, res) => {
  try {
    const member = await memberModel.findById(req.params.id);
    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }
    res.status(200).json(member);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createMember = async (req, res) => {
  try {
    const { 
      first_name, 
      last_name, 
      email, 
      phone, 
      address, 
      date_of_birth, 
      membership_type, 
      joining_date,
      membership_expiry 
    } = req.body;

    if (!first_name || !last_name || !email || !joining_date) {
      return res.status(400).json({ message: 'First name, last name, email and joining date are required' });
    }

    const id = await memberModel.create({
      first_name,
      last_name,
      email,
      phone,
      address,
      date_of_birth,
      membership_status: 'active',
      membership_type: membership_type || 'basic',
      joining_date,
      membership_expiry
    });

    res.status(201).json({ 
      message: 'Member created successfully', 
      memberId: id 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateMember = async (req, res) => {
  try {
    const memberId = req.params.id;
    const memberExists = await memberModel.findById(memberId);
    
    if (!memberExists) {
      return res.status(404).json({ message: 'Member not found' });
    }

    await memberModel.update(memberId, req.body);
    res.status(200).json({ message: 'Member updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteMember = async (req, res) => {
  try {
    const memberId = req.params.id;
    const memberExists = await memberModel.findById(memberId);
    
    if (!memberExists) {
      return res.status(404).json({ message: 'Member not found' });
    }

    await memberModel.delete(memberId);
    res.status(200).json({ message: 'Member deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.searchMembers = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }
    
    const members = await memberModel.search(query);
    res.status(200).json(members);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.filterMembers = async (req, res) => {
  try {
    const { status, type } = req.query;
    const filters = {};
    
    if (status) filters.membership_status = status;
    if (type) filters.membership_type = type;
    
    const members = await memberModel.filter(filters);
    res.status(200).json(members);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMemberStats = async (req, res) => {
  try {
    const stats = await memberModel.getStats();
    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};