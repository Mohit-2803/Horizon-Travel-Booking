import Train from "../models/TrainModel/trainSchema.js";
import Schedule from "../models/TrainModel/trainScheduleSchema.js";
import Route from "../models/TrainModel/routeSchema.js";

/**
 * Convert a time string (HH:MM) to a valid Date object with the journey date.
 * @param {string} timeString - Time string in "HH:MM" format.
 * @param {string} journeyDate - Journey date in "YYYY-MM-DD" format.
 * @returns {Date} - Valid Date object with the journey date and time.
 */
const convertToDate = (timeString, journeyDate) => {
  const [hours, minutes] = timeString.split(":");
  const date = new Date(journeyDate);

  date.setHours(hours);
  date.setMinutes(minutes);
  date.setSeconds(0);
  date.setMilliseconds(0);

  return date;
};

/**
 * Search for trains based on source, destination, and date.
 */
export const trainSearch = async (req, res) => {
  let { source, destination, date } = req.query;

  // Ensure source and destination are extracted from arrays
  source = source && source[0];
  destination = destination && destination[0];

  if (!source || !destination || !date) {
    return res.status(400).json({
      message: "Source, destination, and date are required.",
    });
  }

  try {
    const route = await Route.findOne({
      "stations.stationName": source,
    });

    if (!route) {
      return res
        .status(404)
        .json({ message: "No route found for the source station." });
    }

    const sourceIndex = route.stations.findIndex(
      (station) => station.stationName === source
    );
    const destinationIndex = route.stations.findIndex(
      (station) => station.stationName === destination
    );

    if (
      sourceIndex === -1 ||
      destinationIndex === -1 ||
      sourceIndex >= destinationIndex
    ) {
      return res.status(404).json({
        message: "No valid route between the source and destination.",
      });
    }

    let totalDistance = 0;
    let totalTime = 0; // Assuming average speed 60 km/h

    for (let i = sourceIndex; i < destinationIndex; i++) {
      const station = route.stations[i];
      const distance =
        station.distanceToNext != null
          ? station.distanceToNext
          : station.distanceFromPrevious || 0;

      totalDistance += distance;
      totalTime += distance / 60; // Time in hours
    }

    const trains = await Train.find({ route: route._id }).populate("route");

    if (!trains.length) {
      return res
        .status(404)
        .json({ message: "No trains available on this route." });
    }

    const selectedDay = new Date(date).toLocaleString("en-US", {
      weekday: "long",
    });

    const availableTrains = [];

    for (const train of trains) {
      const schedule = await Schedule.findOne({ train: train._id });

      if (!schedule) continue;

      if (!schedule.operatingDays.includes(selectedDay)) continue;

      const trainSourceIndex = route.stations.findIndex(
        (station) => station.stationName === train.source
      );
      const trainDestinationIndex = route.stations.findIndex(
        (station) => station.stationName === train.destination
      );

      if (
        trainSourceIndex <= sourceIndex &&
        trainDestinationIndex >= destinationIndex
      ) {
        const departureTime = convertToDate(schedule.departureTime, date);

        if (isNaN(departureTime)) {
          console.error("Invalid departure time:", schedule.departureTime);
          continue;
        }

        let timeToUserSource = 0;

        for (let i = trainSourceIndex; i < sourceIndex; i++) {
          const station = route.stations[i];
          const distance =
            station.distanceFromPrevious != null
              ? station.distanceFromPrevious
              : station.distanceToNext || 0;

          timeToUserSource += (distance / 60) * 60 * 60 * 1000; // Convert hours to ms
        }

        let adjustedDepartureTime = new Date(
          departureTime.getTime() + timeToUserSource
        );

        let timeToDestination = 0;

        for (let i = sourceIndex; i < destinationIndex; i++) {
          const station = route.stations[i];
          const distance =
            station.distanceFromPrevious != null
              ? station.distanceFromPrevious
              : station.distanceToNext || 0;

          timeToDestination += (distance / 60) * 60 * 60 * 1000;
        }

        let arrivalTimeAtDestination = new Date(
          adjustedDepartureTime.getTime() + timeToDestination
        );

        if (isNaN(adjustedDepartureTime) || isNaN(arrivalTimeAtDestination)) {
          console.error(
            "Invalid adjusted times:",
            adjustedDepartureTime,
            arrivalTimeAtDestination
          );
          continue;
        }

        const adjustedDepartureTimeStr = adjustedDepartureTime.toLocaleString(
          "en-US",
          {
            weekday: "short",
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          }
        );

        const arrivalTimeAtDestinationStr =
          arrivalTimeAtDestination.toLocaleString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          });

        availableTrains.push({
          trainName: train.trainName,
          trainNumber: train.trainNumber,
          source: train.source,
          destination: train.destination,
          departureTime: schedule.departureTime,
          adjustedDepartureTime: adjustedDepartureTimeStr,
          arrivalTimeAtDestination: arrivalTimeAtDestinationStr,
          operatingDays: schedule.operatingDays,
          compartments: train.compartments,
          quotas: train.quotas,
          status: train.status,
          estimatedTime: totalTime,
          totalDistance: totalDistance, // Add total distance to the response
        });
      }
    }

    if (!availableTrains.length) {
      return res.status(404).json({
        message:
          "No trains available for the selected source, destination, and date.",
      });
    }

    res.status(200).json({
      message: "Trains found",
      trains: availableTrains,
    });
  } catch (error) {
    console.error("Error searching for trains:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
