import express, { RequestHandler } from 'express';
import axios from 'axios';

const usersApi = 'https://jsonplaceholder.typicode.com/users';

const router = express.Router();

type Coordinates = {
  lng: number,
  lat: number,
}

type Person = {
  address: {
    geo: Coordinates
  }
}

type Persons = [
  Person
]

const getDistance = (a:Coordinates, b:Coordinates) => Math.sqrt(
  Math.pow(a.lat-b.lat, 2) + Math.pow(a.lng-b.lng, 2)
);

const getClosestTo = (coordinates:Coordinates, users:Persons) => users.reduce((prev:Person, curr:Person) => {
    if (!prev) return curr;
    if (getDistance(coordinates, curr.address.geo) < getDistance(coordinates, prev.address.geo)) {
      return curr;
    }
    return prev;
})

const validateParams: RequestHandler = (req, res, next) => {
  const { long, lat } = req.query;
  if (long === undefined || lat === undefined) {
    return res
      .status(400)
      .json({'error': 'Missing required parameters'})
  }
  if (Number.isNaN(parseFloat(long)) || Number.isNaN(parseFloat(lat))) {
    return res
      .status(400)
      .json({'error': 'Parameters should be numbers'})
  }
  res.locals.coordinates = {
    lat: parseFloat(lat),
    lng: parseFloat(long),
  }

  next();
}

const fetchUsers: RequestHandler = async (req, res, next) => {
  try {
    const { data } = await axios.get(usersApi);
    if (!data || !Array.isArray(data) || data.length === 0) {
      throw new Error('Empty response from ' + usersApi);
    }
    res.locals.users = data;
  } catch(e) {
    console.error(e);
    return res
      .status(500)
      .json({'error': 'Could not connect to persons API'})
  }
  next();
}

const handleSearch: RequestHandler = (req, res, next) => {
  const { 
    users,
    coordinates
  } : {
    users: Persons
    coordinates: Coordinates,
  } = res.locals;
  try {
    const closest = getClosestTo(coordinates, users);
    return res.json(closest);
  } catch(e) {
    console.error(e);
    return res
      .status(500)
      .json({'error': 'Something went wrong'})
  }
}

router.get('/', [validateParams, fetchUsers, handleSearch]);

export default router;