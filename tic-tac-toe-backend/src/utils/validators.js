const Joi = require('joi');

// Validate game creation
const validateGameCreation = (data) => {
  const schema = Joi.object({
    playerId: Joi.string().required().min(1).max(50),
    playerName: Joi.string().required().min(1).max(30).trim()
  });

  return schema.validate(data);
};

// Validate move
const validateMove = (data) => {
  const schema = Joi.object({
    playerId: Joi.string().required().min(1).max(50),
    position: Joi.number().integer().min(0).max(8).required()
  });

  return schema.validate(data);
};

// Validate join game
const validateJoinGame = (data) => {
  const schema = Joi.object({
    playerId: Joi.string().required().min(1).max(50),
    playerName: Joi.string().required().min(1).max(30).trim()
  });

  return schema.validate(data);
};

// Validate player action
const validatePlayerAction = (data) => {
  const schema = Joi.object({
    playerId: Joi.string().required().min(1).max(50)
  });

  return schema.validate(data);
};

module.exports = {
  validateGameCreation,
  validateMove,
  validateJoinGame,
  validatePlayerAction
};