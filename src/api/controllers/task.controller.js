const mongoose = require('mongoose');
const express = require('express');
const Task = require('../models/task.model');

exports.list = async (req, res, next) => {
  try {
    /**
     * Todo Filter
     * If no filters are selected, 50 kms near the current location by default + remote jobs
     * 
     */
    const tasks = await Task.list(req.query);
  } catch (error) {
    next(error);
  }
};
