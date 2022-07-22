
const HttpError = require('../models/http-error');

const DUMMY_PLACES = [
  {
    id: "p1",
    title: "Empire State Building",
    description: "Empire state building is an legendry building",
    imageUrl: 'https://media.timeout.com/images/101705309/image.jpg',
    address: '20 W 34th St, New York, NY 1001',
    location: {
      lat: 40.7484405,
      lng: -73.9878584
    },
    creator: 'u1'
  },
  {
    id: "p2",
    title: "Emp. State Building",
    description: "Empire state building is an legendry building",
    imageUrl: 'https://media.timeout.com/images/101705309/image.jpg',
    address: '20 W 34th St, New York, NY 1001',
    location: {
      lat: 40.7484405,
      lng: -73.9878584
    },
    creator: 'u2'
  }

]

const getPlaceById = (req, res, next) => {
  const placeId = req.params.pid;
  const place = DUMMY_PLACES.find(p => {
    return p.id === placeId;
  });
  if (!place) {
    throw new HttpError('Could not find place for a provided id .', 404);
  }

  res.json({ place });
};


const getPlaceByUserId = (req, res, next) => {

  const userId = req.params.uid;

  const place = DUMMY_PLACES.find(p => {
    return p.creator === userId;
  });
  if (!place) {
    const error = new Error('Could not find place for a provided user id .');
    error.code = 404;
    return next(
      new HttpError('Could not find place for a provided user id .', 404)
    );

  }
  res.json({ place });
};

const createPlace = (req, res ,next)=>{
  const {title,description,coordinates,address,creator} = req.body;
  //const title = req.body.title;
  const createdPlace = {
    title,
    description,
    location:coordinates,
    address,
    creator
  };

  DUMMY_PLACES.push(createdPlace); //unshift(createdPlace)

  res.status(201).json({place : createdPlace});
}

exports.getPlaceById = getPlaceById;
exports.getPlaceByUserId = getPlaceByUserId;
exports.createPlace = createPlace;