const httpStatus = require('http-status');
const CreateHttpError = require('http-errors');
const Task = require('../models/task.model');
const Quote = require('../models/quote.model');

/**
 * My Tasks
 */
// Controller method to add a new task
exports.addTask = async (req, res, next) => {
  try {
    const userId = req.user;
    const {
      title,
      locationType,
      description,
      location,
      dateType,
      date,
      budget,
      imageURLs,
    } = req.body;

    let taskLocation = null;
    if (locationType !== 'remote') {
      taskLocation = {
        type: 'Point',
        coordinates: location.coordinates,
      };
    }
    const taskData = {
      title,
      description,
      status: 'open',
      budget,
      createdOn: new Date(),
      lastEdited: null,
      dateType,
      date,
      locationType,
      location: taskLocation,
      locationName: location?.name ?? null,
      imageURLs,
      postedBy: userId,
      questions: [],
      assignedUser: null,
    };
    const newTask = await Task.create(taskData);
    res.status(httpStatus.CREATED).json(newTask);
  } catch (error) {
    next(error);
  }
};
// Controller method to get all tasks by a user
exports.getAllTasksByUser = async (req, res, next) => {
  try {
    const userId = req.user;
    // eslint-disable-next-line prefer-const
    let { status, searchText } = req.query;

    const query = { postedBy: userId };

    // Set default status filter if status query parameter is not provided
    if (!status) {
      status = ['open', 'assigned'];
    }

    // Include status filter in the query
    query.status = { $in: status };

    if (searchText) {
      query.title = { $regex: new RegExp(searchText, 'i') };
    }
    const tasks = await Task.find(query);

    // Set status to 200 OK and send the tasks as a response
    res.status(httpStatus.OK).json(tasks);
  } catch (error) {
    next(error);
  }
};
// Cancel task
exports.deleteTask = async (req, res, next) => {
  try {
    const userId = req.user; // Assuming you're extracting user ID from JWT token
    const { taskId } = req.params;

    // Find the task by ID
    const task = await Task.findById(taskId);

    // If the task doesn't exist, throw a 404 error
    if (!task) {
      throw new CreateHttpError.NotFound('Task not found');
    }

    // Check if the user is the owner of the task
    if (task.postedBy !== userId) {
      throw new CreateHttpError.Forbidden(
        'You are not authorized to delete this task',
      );
    }
    // Check if the task is already cancelled
    if (task.status === 'cancelled') {
      throw new CreateHttpError.BadRequest('Task is already cancelled');
    }
    // Update the task status to "cancelled"
    task.status = 'cancelled';
    await task.save();

    // If the task was successfully deleted, send a success response
    res.status(httpStatus.NO_CONTENT).send();
  } catch (error) {
    next(error); // Pass any caught errors to the error handling middleware
  }
};

/**
 * Browse Tasks
 */

// Controller method to browse tasks
exports.getTasks = async (req, res, next) => {
  try {
    // Default parameters
    const defaultDistance = 50;
    const defaultLng = 75.7873; // Default location of Jaipur, Rajasthan
    const defaultLat = 26.9124;
    const defaultLocationType = ['in-person', 'remote'];
    const defaultPriceRange = { min: 100, max: 99000 };
    const defaultSortBy = 'createdAt';
    const defaultStatus = 'open';

    // Extract query parameters
    const { distance, lng, lat, locationType, priceRange, sortBy, status } =
      req.query;

    const searchDistance = distance || defaultDistance;
    const searchLocationType =
      locationType === 'all' || !locationType
        ? defaultLocationType
        : locationType;
    const searchPriceRange = priceRange || defaultPriceRange;
    const searchSortBy = sortBy || defaultSortBy;
    const searchStatus = status || defaultStatus;
    // Build query based on parameters
    const query = {};
    // Implement search by distance and location
    if (searchLocationType !== 'remote') {
      const searchLat = lat && lng ? lat : defaultLat;
      const searchLng = lat && lng ? lng : defaultLng;
      query.location = {
        $nearSphere: {
          $geometry: {
            type: 'Point',
            coordinates: [searchLng, searchLat],
          },
          $maxDistance: searchDistance * 1000, // Convert to meters
        },
      };
    }
    query.status = searchStatus;
    // Implement search by location type
    if (locationType) {
      if (Array.isArray(searchLocationType)) {
        query.locationType = { $in: searchLocationType };
      } else {
        query.locationType = searchLocationType;
      }
    }
    // Implement search by price range
    query.budget = { $gte: searchPriceRange.min, $lte: searchPriceRange.max };
    // Get tasks based on the constructed query
    const tasks = await Task.find(query).sort(searchSortBy);

    // Return tasks as response
    res.status(httpStatus.OK).json(tasks);
  } catch (error) {
    next(error);
  }
};

// get details of a task
exports.getTaskById = async (req, res, next) => {
  try {
    const { taskId } = req.params;
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(httpStatus.NOT_FOUND).json({ error: 'Task not found' });
    }
    const taskObject = task.toObject();
    // Fetch quotes associated with this task
    const quotes = await Quote.find({ taskId });
    taskObject.quotes = quotes;
    res.status(httpStatus.OK).json(taskObject);
  } catch (error) {
    if (error.name === 'CastError') {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ error: 'Invalid task ID' });
    }
    next(error);
  }
};

/**
 * Quotes
 */
/**
 * Todo
 * 1. User should have access to applied tasks so we can keep separate collection.
 */
exports.addQuote = async (req, res, next) => {
  try {
    console.log('body', req.body);
    const { taskId } = req.params;
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(httpStatus.NOT_FOUND).json({ error: 'Task not found' });
    }
    const userId = req.user;
    // Check if the user has already quoted for this task
    const existingQuote = await Quote.findOne({ taskId, userId });
    if (existingQuote) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ error: 'User has already quoted for this task' });
    }
    const { price, message } = req.body;
    const newQuote = new Quote({
      taskId,
      userId,
      price,
      message,
      status: 'applied',
    });

    // Save the new quote to the database
    await newQuote.save();
    res
      .status(httpStatus.CREATED)
      .json({ message: 'Quote added', quote: newQuote });
  } catch (error) {
    if (error.name === 'CastError') {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ error: 'Invalid task ID' });
    }
    next(error);
  }
};
