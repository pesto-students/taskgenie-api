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
      images,
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
      images,
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
    const defaultLocationTypes = ['in-person', 'remote'];
    const defaultPriceRange = { minPrice: 100, maxPrice: 99000 };
    const defaultSortBy = 'date-dsc';
    const defaultStatus = 'open';

    // Extract query parameters
    const {
      distance,
      lng,
      lat,
      locationType,
      minPrice,
      maxPrice,
      sortBy,
      status,
    } = req.query;

    const searchDistance = distance || defaultDistance;
    const searchLocationType = locationType || defaultLocationTypes;
    const priceRange = {
      minPrice: Number(minPrice) || defaultPriceRange.minPrice,
      maxPrice: Number(maxPrice) || defaultPriceRange.maxPrice,
    };
    const searchStatus = status || defaultStatus;
    const sortOption = sortBy || defaultSortBy;
    const sortCriteria = {};
    switch (sortOption) {
      case 'date-desc':
        // Latest task first
        sortCriteria.createdOn = -1;
        break;
      case 'date-asc':
        // Oldest task first
        sortCriteria.createdOn = 1;
        break;
      case 'price-desc':
        sortCriteria.budget = -1;
        break;
      case 'price-asc':
        sortCriteria.budget = 1;
        break;
      default:
        sortCriteria.createdOn = -1;
        break;
    }

    // Define search query for remote jobs
    const remoteJobsQuery = {
      status: searchStatus,
      budget: {
        $gte: priceRange.minPrice,
        $lte: priceRange.maxPrice,
      },
      locationType: 'remote', // Filter for remote jobs only
    };

    // Define search query for in-person jobs within given distance radius
    const inPersonJobsQuery = {
      status: searchStatus,
      budget: {
        $gte: priceRange.minPrice,
        $lte: priceRange.maxPrice,
      },
      locationType: 'in-person', // Filter for in-person jobs only
    };

    // Implement search by distance and location for in-person jobs

    const searchLat = lat && lng ? lat : defaultLat;
    const searchLng = lat && lng ? lng : defaultLng;
    inPersonJobsQuery.location = {
      $nearSphere: {
        $geometry: {
          type: 'Point',
          coordinates: [searchLng, searchLat],
        },
        $maxDistance: searchDistance * 1000, // Convert to meters
      },
    };
    let tasks = [];
    if (locationType === 'remote') {
      // Get tasks based on remote jobs query
      tasks = await Task.find(remoteJobsQuery).lean();
    } else if (locationType === 'in-person') {
      tasks = await Task.find(inPersonJobsQuery).lean();
    } else {
      const remoteJobs = await Task.find(remoteJobsQuery).lean();
      const inPersonJobs = await Task.find(inPersonJobsQuery).lean();
      tasks = [...remoteJobs, ...inPersonJobs];
    }
    const sortAttribute = Object.keys(sortCriteria)[0];
    const sortDirection = sortCriteria[sortAttribute];
    // Apply sorting
    tasks.sort((a, b) => {
      // Sorting based on the provided sortCriteria
      const aValue = a[sortAttribute];
      const bValue = b[sortAttribute];
      return sortDirection === -1 ? bValue - aValue : aValue - bValue;
    });

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

// Accept a quote
exports.acceptQuote = async (req, res, next) => {
  try {
    const { taskId, quoteId } = req.params;
    const userId = req.user; // Assuming you have a middleware to extract user ID from JWT

    // Find the task by taskId
    const task = await Task.findById(taskId);

    // Check if the task exists
    if (!task) {
      return next(CreateHttpError(httpStatus.NOT_FOUND, 'Task not found'));
    }
    // Check if the user is the owner of the task
    if (task.postedBy !== userId) {
      return next(
        CreateHttpError(
          httpStatus.Forbidden,
          'You are not authorized to accept quotes for this task',
        ),
      );
    }

    // Check if the task has already been assigned
    if (task.status === 'assigned') {
      return next(
        CreateHttpError(
          httpStatus.BAD_REQUEST,
          'Task has already been assigned',
        ),
      );
    }

    // Check if the quote belongs to the task
    const quote = await Quote.findById(quoteId);
    if (!quote || quote.taskId.toString() !== taskId) {
      return next(
        CreateHttpError(httpStatus.NOT_FOUND, 'Quote not found for the task'),
      );
    }

    // Update the status of the quote to "assigned"
    quote.status = 'assigned';
    await quote.save();

    // Update the task's acceptedQuote field with the quoteId
    task.acceptedQuote = quoteId;
    task.status = 'assigned';
    await task.save();

    res
      .status(httpStatus.OK)
      .json({ message: 'Quote accepted successfully', acceptedQuote: quoteId });
  } catch (error) {
    next(error);
  }
};
