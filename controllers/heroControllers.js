import pool from '../DB/sqlConnection.js'

const getAllHeroes = async (req, res) => {
  try {
    const {rows} = await pool.query('SELECT * FROM heroes');

    // If there are no heroes in our database for whichever reason, we send a response back
    if (!rows.length) return res.status(404).json({error: 'No heroes found'});

    // We send all our heroes from the heroes table back
    return res.json(rows)
  } catch (error) {
    return res.status(500).json({error: error.message})
  }
}

const getSingleHero = async (req, res) => {
  try {
    const {id} = req.params
    // In our query we make sure to use the pg module's sanitization tool to avoid malicious injections!
    const {rows} = await pool.query('SELECT * FROM heroes WHERE id=$1', [id])

    // If a hero with the specified ID doesn't exist, we send a failed message back
    if (!rows.length) return res.status(404).json({error: `Hero not found!`})
    // Since the returned hero is an array of a single object inside, we simple return the content of the array and eliminate the wrapper array
    return res.json(rows[0])
  } catch (error) {
    return res.status(500).json({error: error.message})
  }
}

const createHero = async (req, res) => {
  try {
    const {last_name, first_name, image} = req.body;

    // If the client fails to send any of the required fields, we send a response back and don't bother our database with a malformed request!
    if (!last_name || !first_name || !image) return res.status(400).json({error: 'Please provide all required fields'});

    // We insert the new hero into our database, and also return it for confirmation for the client, making sure to sanitize all inputs
    const {rows} = await pool.query('INSERT INTO heroes (last_name, first_name, image) VALUES ($1, $2, $3) RETURNING *', [last_name, first_name, image]);
    return res.json(rows[0]);    
  } catch (error) {
    return res.status(500).json({error: error.message})
  }
}

const updateHero = async (req, res) => {
  try {
    const { last_name, first_name, image } = req.body;
    const { id } = req.params;

    // We reject malformed requests if they come in
    if (!last_name || !first_name || !image) return res.status(400).json({error: 'Please provide all fields.'});
    
    // We will attempt to update a hero
    const { rows: [hero] } = await pool.query(`UPDATE heroes SET last_name=$2, first_name=$3, image=$4 WHERE id=$1 RETURNING *`, [id, last_name, first_name, image]);
    
    // If a hero with that ID doesn't exist, we send a failure response to our client
    if (!hero) return res.status(404).json({error: 'Hero not found'});

    // Otherwise we send the details of the updated hero back
    return res.json({hero, success: `The hero, formerly known as ${first_name} ${last_name}, has been updated.`});
  } catch (error) {
    return res.status(500).json({error: error.message})
  }
}

const retireHero = async (req, res) => {
  try {
    const { id } = req.params;
    
    // We will change our selected hero's active field to false and return it
    const {rows: [user]} = await pool.query('UPDATE heroes SET active=false WHERE id=$1 RETURNING *', [id]);

    // If the hero doesn't exist, we reply with an error
    if (!user) return res.status(404).json({error: 'User not found'});

    return res.json({success: `The hero ${user.first_name} ${user.last_name} has retired. Who will save us now?`});
  } catch (error) {
    return res.status(500).json({error: error.message})
  }
}

export {getAllHeroes, getSingleHero, createHero, updateHero, retireHero}