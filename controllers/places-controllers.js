const uuid = require('uuid').v4;

const HttpError = require('../models/http-error');


let DUMMY_PLACES = [
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


const getPlacesByUserId = (req, res, next) => {

  const userId = req.params.uid;

  const places = DUMMY_PLACES.filter(p => {
    return p.creator === userId;
  });
  if (!places || places.length === 0) {
    const error = new Error('Could not find places for a provided user id .');
    error.code = 404;
    return next(
      new HttpError('Could not find place for a provided user id .', 404)
    );

  }
  res.json({ places });
};

const createPlace = (req, res ,next)=>{
  const {title,description,coordinates,address,creator} = req.body;
  //const title = req.body.title;
  const createdPlace = {
    id:uuid(),
    title,
    description,
    location:coordinates,
    address,
    creator
  };

  DUMMY_PLACES.push(createdPlace); //unshift(createdPlace)

  res.status(201).json({place : createdPlace});
}

const updatePlace = (req, res ,next) =>{
  const {title,description,coordinates,address} = req.body;
  const placeId = req.params.pid;

  const updatePlace = {...DUMMY_PLACES.find(p=>p.id ===placeId)};
  const placeIndex = DUMMY_PLACES.findIndex(p=>p.id ===placeId);
  updatePlace.title = title;
  updatePlace.description = description;
  updatePlace.location = coordinates;
  updatePlace.address = address;

  DUMMY_PLACES[placeIndex] = updatePlace;

  res.status(200).json({place :updatePlace});



}
const deletePlace = (req, res ,next) => {
  const placeId = req.params.pid;
  DUMMY_PLACES =DUMMY_PLACES.filter(p =>p.id !==placeId);
  res.status(200).json({message : 'Place Deleted'});

}

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;