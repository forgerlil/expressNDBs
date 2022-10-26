import villainModel from "../models/villainModel.js"

// All of our MongoDB inputs from the request are being sanitized already (check server.js to see how that's happening)
// so we can just use the values straight away!

const getAllVillains = async (req, res) => {
  try {
    const allVillains = await villainModel.find();
    if (!allVillains) return res.status(404).json({error: 'There are no villains to be found!'});
    return res.json(allVillains);
  } catch (error) {
    return res.status(500).json({error: error.message});
  }
}

const getVillainByName = async (req, res) => {
  try {
    const { name } = req.params;

    // In Mongo there is no wildcard like in SQL for querying, but we can use regular expressions like so
    const villain = await villainModel.find({name: {$regex: name, $options: 'i' }});
    
    // Since the return of our find is an array, we need to check that array's length, and
    // if no villains match the regular expression, then the client is out of luck: they get an error response back
    if (!villain.length) return res.status(404).json({error: 'Villain not found'});

    // Return the villain(s) if all went well!
    return res.json(villain);
  } catch (error) {
    return res.status(500).json({error: error.message});
  }
}

const createVillain = async (req, res) => {
  try {
    // We destructure all of the needed properties out of the body. any other sent properties would be irrelevant
    const {name, description, personalDeadliness, influence, image} = req.body;
    // If a property is missing, we give feedback straight away
    if (!name || !description || !personalDeadliness || !influence || !image) return res.status(400).json({error: `Please provide all fields!`});

    // If all is in order so far, we create a new villain and send the newly created document back to our client
    const newVillain = await villainModel.create({name, description, personalDeadliness, influence, image});
    return res.json(newVillain);
  } catch (error) {
    return res.status(500).json({error: error.message});
  }
}

const updateVillain = async (req, res) => {
  try {
    const { id } = req.params;
    // In MongoDB all ids are 24 characters long. If a request comes with a malformed Id, we can send that error back straight away
    if (id.length !== 24) return res.status(400).json({error: 'Malformed ID'});

    const { name, description, personalDeadliness, influence, image } = req.body;

    // Here we are more flexible with our input, and require a minimum of one field to update. 
    // But if none of the fields are present, we send an error back.
    if (!name && !description && !personalDeadliness && !influence && !image) return res.status(400).json({error: 'Please provide at least one field to update!'});
    
    // We make use of Mongoose's findByIdAndUpdate method. The first argument is the id, the second is an object with all characteristics
    // we want to update, and the third, with {new: true}, we say that we want the updated version of the document to come back from the query
    // If the field doesn't come in the request and is therefore undefined, mongoose won't update the entry at all!
    const villain = await villainModel.findByIdAndUpdate(id, { name, description, personalDeadliness, influence, image }, {new: true});

    // If the villain doesn't exist, we give feedback, or send a successful response if all goes as intended
    if (!villain) return res.status(404).json({error: 'Villain cannot be found. They must be hiding...'});
    return res.json({beware: `The rival ${villain.name} underwent changes! Careful - they may now be stronger than ever!`, updatedVillain: villain});
  } catch (error) {
    return res.status(500).json({error: error.message});
  }
}
const defeatVillain = async (req, res) => {
  try {
    const { id } = req.params;
    if (id.length !== 24) return res.status(400).json({error: 'Malformed ID'});

    // We set the field of isRecovering to true and get the new document back
    const villain = await villainCollection.findByIdAndUpdate(id, {isRecovering: true}, {new: true});

    // And give back an appropriate response
    if (!villain) return res.status(404).json({error: 'Villain cannot be found. They must be hiding...'});
    return res.json({success: `You would think this villain was dealt with for good, but that would be too easy! The villain ${villain.name} has been defeated for now, but will return eventually though...`});
  } catch (error) {
    return res.status(500).json({error: error.message});
  }
}


export {getAllVillains, getVillainByName, createVillain, updateVillain, defeatVillain}