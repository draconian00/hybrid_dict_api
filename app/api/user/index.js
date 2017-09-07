const express = require('express');
const router = express.Router();
const controller = require('./user.controller');

function User(_name) {
  this.name = _name;
}

User.prototype.greeting = function() {
  console.log('Hello! ');
  return this;
};

User.prototype.introduce = function() {
  console.log(`I am ${this.name}`);
  return this;
};

// var chris = new User('chris');
// chris.greeting().introduce();

router.get('/', controller.index);
router.get('/:id', controller.show);
router.delete('/:id', controller.destroy);
router.post('/', controller.create);
router.put('/:id', controller.update);

module.exports = router;