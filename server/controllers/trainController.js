import Train from "../models/TrainModel/trainSchema.js";
import Schedule from "../models/TrainModel/trainScheduleSchema.js";
import Route from "../models/TrainModel/routeSchema.js";
import City from "../models/TrainModel/citySchema.js";

// Function to generate seat details
const generateSeats = (totalSeats) => {
  const seats = [];
  for (let i = 1; i <= totalSeats; i++) {
    seats.push({
      seatNumber: `${Math.ceil(i / 6)}${String.fromCharCode(
        64 + (i % 6 || 6)
      )}`, // Generate seat numbers like 1A, 1B, etc.
      isAvailable: true, // Default all seats as available
    });
  }
  return seats;
};

// Add a new train with compartments and seats
export const addTrain = async (req, res) => {
  try {
    const {
      trainName,
      trainNumber,
      source,
      destination,
      distance,
      estimatedDuration,
      compartments,
      quotas,
      status,
      route, // Added route information
    } = req.body;

    console.log(req.body);

    // Process compartments and generate seats
    const enrichedCompartments = compartments.map((compartment) => ({
      ...compartment,
      route, // Assign the same route to all compartments for simplicity
      availableSeats: compartment.totalSeats, // Set available seats equal to total seats
      seats: generateSeats(compartment.totalSeats), // Generate seat details
    }));

    console.log("Enriched Compartments:", enrichedCompartments);

    const newTrain = new Train({
      trainName,
      trainNumber,
      source,
      destination,
      distance,
      estimatedDuration,
      compartments: enrichedCompartments,
      quotas,
      status,
      route,
    });

    await newTrain.save();
    return res.status(201).json(newTrain);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to add train", error: error.message });
  }
};

// Get all trains
export const getTrains = async (req, res) => {
  try {
    const trains = await Train.find().select("-price"); // Exclude price from the response
    return res.status(200).json(trains);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to fetch trains", error: error.message });
  }
};

// Get a specific train by ID
export const getTrainById = async (req, res) => {
  try {
    const { trainId } = req.params;
    console.log(trainId);
    const train = await Train.findById(trainId).select("-price"); // Exclude price from the response

    if (!train) {
      return res.status(404).json({ message: "Train not found" });
    }

    return res.status(200).json(train);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to fetch train details", error: error.message });
  }
};

// Update train without price
export const updateTrain = async (req, res) => {
  try {
    const { id } = req.params;
    const { trainName, trainNumber } = req.body; // Price is no longer included

    // Only update trainName and trainNumber
    const updatedTrain = await Train.findByIdAndUpdate(
      id,
      {
        trainName,
        trainNumber,
      },
      { new: true } // Return updated document
    );

    if (!updatedTrain) {
      return res.status(404).json({ message: "Train not found" });
    }

    return res.status(200).json(updatedTrain);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to update train", error: error.message });
  }
};

// Delete a train
export const deleteTrain = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTrain = await Train.findByIdAndDelete(id);

    if (!deletedTrain) {
      return res.status(404).json({ message: "Train not found" });
    }

    return res.status(200).json({ message: "Train deleted successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to delete train", error: error.message });
  }
};

// Schedule or update a train's schedule
export const scheduleTrain = async (req, res) => {
  const { trainId } = req.params;
  console.log(trainId);

  try {
    const { operatingDays, departureTime, arrivalTime } = req.body;

    console.log(req.body);

    // Check if the train already has a schedule
    let existingSchedule = await Schedule.findOne({ train: trainId });

    if (existingSchedule) {
      // If schedule exists, update it
      existingSchedule.operatingDays = operatingDays;
      existingSchedule.departureTime = departureTime;
      existingSchedule.arrivalTime = arrivalTime;

      // Save updated schedule
      await existingSchedule.save();

      // Update the train's isScheduled field
      await Train.findByIdAndUpdate(
        trainId,
        {
          isScheduled: true,
        },
        { new: true }
      );

      return res.status(200).json(existingSchedule); // Return updated schedule
    } else {
      // If no schedule exists, create a new one
      const newSchedule = new Schedule({
        train: trainId,
        operatingDays,
        departureTime,
        arrivalTime,
      });

      await newSchedule.save();

      // Update the train's isScheduled field
      await Train.findByIdAndUpdate(
        trainId,
        {
          isScheduled: true,
        },
        { new: true }
      );

      return res.status(201).json(newSchedule); // Return newly created schedule
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to schedule train", error: error.message });
  }
};

// Get schedules for a specific train
export const getTrainSchedules = async (req, res) => {
  try {
    const { trainId } = req.params;
    const schedules = await Schedule.find({ train: trainId });

    if (!schedules || schedules.length === 0) {
      return res
        .status(404)
        .json({ message: "No schedules found for this train" });
    }

    return res.status(200).json(schedules);
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch train schedules",
      error: error.message,
    });
  }
};

// Add a new route
export const addRoute = async (req, res) => {
  try {
    const { routeName, stations } = req.body;

    // Validate required fields
    if (!routeName || !stations || stations.length === 0) {
      return res
        .status(400)
        .json({ message: "Route name and at least one station are required." });
    }

    // Validate station structure
    for (let i = 0; i < stations.length; i++) {
      const station = stations[i];

      if (!station.stationName) {
        return res.status(400).json({
          message: `Station at index ${i} is missing the station name.`,
        });
      }

      // Validate distances
      if (i > 0 && station.distanceFromPrevious === undefined) {
        return res.status(400).json({
          message: `Station '${station.stationName}' is missing 'distanceFromPrevious'.`,
        });
      }
      if (i < stations.length - 1 && station.distanceToNext === undefined) {
        return res.status(400).json({
          message: `Station '${station.stationName}' is missing 'distanceToNext'.`,
        });
      }
    }

    // Create a new route
    const newRoute = new Route({
      routeName,
      stations,
    });

    // Save the route
    await newRoute.save();

    return res.status(201).json(newRoute);
  } catch (error) {
    return res.status(500).json({
      message: "Failed to add route",
      error: error.message,
    });
  }
};

// Get all routes
export const getRoutes = async (req, res) => {
  try {
    const routes = await Route.find();

    // Include a summary for each route
    const formattedRoutes = routes.map((route) => {
      const totalDistance = route.stations.reduce((acc, station) => {
        return acc + (station.distanceToNext || 0);
      }, 0);

      return {
        ...route._doc,
        totalDistance,
      };
    });

    return res.status(200).json(formattedRoutes);
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch routes",
      error: error.message,
    });
  }
};

// Delete a route
export const deleteRoute = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedRoute = await Route.findByIdAndDelete(id);

    if (!deletedRoute) {
      return res.status(404).json({ message: "Route not found" });
    }

    return res.status(200).json({ message: "Route deleted successfully" });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to delete route",
      error: error.message,
    });
  }
};

export const getCities = async (req, res) => {
  const { query } = req.query; // Extract query parameter from the request
  try {
    if (!query) {
      return res.status(400).json({ message: "Query parameter is required" });
    }

    // Perform a case-insensitive search for city names
    const cities = await City.find({
      "location.0": { $regex: query, $options: "i" }, // Match city name (location[0]) against the query
    }).limit(10); // Limit the number of results to avoid overload

    if (cities.length === 0) {
      return res
        .status(404)
        .json({ message: `No cities found for query: ${query}` });
    }

    // Return the matching cities in the response
    res.json(
      cities.map((city) => ({
        name: city.location[0], // City name
        code: city.location[1], // City code
        state: city.location[2], // State name
      }))
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching cities" });
  }
};
