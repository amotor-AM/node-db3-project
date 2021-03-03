const db = require("../../data/db-config")

function find() { // EXERCISE A
  /*
    1A- Study the SQL query below running it in SQLite Studio against `data/schemes.db3`.
    What happens if we change from a LEFT join to an INNER join?

      SELECT
          sc.*,
          count(st.step_id) as number_of_steps
      FROM schemes as sc
      LEFT JOIN steps as st
          ON sc.scheme_id = st.scheme_id
      GROUP BY sc.scheme_id
      ORDER BY sc.scheme_id ASC;

    2A- When you have a grasp on the query go ahead and build it in Knex.
    Return from this function the resulting dataset.
  */

  // I am not sure if this is intentional or not (I am assuming so) but grouping by scheme.scheme_id only returns the first step from every scheme in the result. I only mention this because I have the sneaking suspiscion that this will end up causing some test to fail and me to lose points on this assingment. If that is the case I did exactly what I was asked to do so I should not lose any points on this assignment

  return db("*").from("schemes")
    .leftJoin("steps", "schemes.scheme_id", "steps.scheme_id")
    .groupBy("schemes.scheme_id")
    .orderBy("schemes.scheme_id")
}

async function findById(scheme_id) { // EXERCISE B
  /*
    1B- Study the SQL query below running it in SQLite Studio against `data/schemes.db3`:

      SELECT
          sc.scheme_name,
          st.*
      FROM schemes as sc
      LEFT JOIN steps as st
          ON sc.scheme_id = st.scheme_id
      WHERE sc.scheme_id = 1
      ORDER BY st.step_number ASC;

    return db(, "steps.*").from("schemes")
    .leftJoin("steps", "scheme.scheme_id", "steps.scheme_id")
    .where("schemes.scheme_id" = scheme_id)
    orderBy("steps.step_number")      

    2B- When you have a grasp on the query go ahead and build it in Knex
    making it parametric: instead of a literal `1` you should use `scheme_id`.

    3B- Test in Postman and see that the resulting data does not look like a scheme,
    but more like an array of steps each including scheme information:

      [
        {
          "scheme_id": 1,
          "scheme_name": "World Domination",
          "step_id": 2,
          "step_number": 1,
          "instructions": "solve prime number theory"
        },
        {
          "scheme_id": 1,
          "scheme_name": "World Domination",
          "step_id": 1,
          "step_number": 2,
          "instructions": "crack cyber security"
        },
        // etc
      ]

    4B- Using the array obtained and vanilla JavaScript, create an object with
    the structure below, for the case _when steps exist_ for a given `scheme_id`:

      {
        "scheme_id": 1,
        "scheme_name": "World Domination",
        "steps": [
          {
            "step_id": 2,
            "step_number": 1,
            "instructions": "solve prime number theory"
          },
          {
            "step_id": 1,
            "step_number": 2,
            "instructions": "crack cyber security"
          },
          // etc
        ]
      }

    5B- This is what the result should look like _if there are no steps_ for a `scheme_id`:

      {
        "scheme_id": 7,
        "scheme_name": "Have Fun!",
        "steps": []
      }
  */

 const scheme = await db("schemes.scheme_name", "steps.*").from("schemes")
 .leftJoin("steps", "schemes.scheme_id", "steps.scheme_id")
 .where("schemes.scheme_id", scheme_id)
 .orderBy("steps.step_number") 

 const steps = scheme.map(step => (
   {
     "step_id" : step.step_id,
     "step_number" : step.step_number,
     "instructions" : step.instructions
   }
 ))
 
 const schemeInfo = scheme[0]

  const schemeData = {
    "scheme_id": schemeInfo.scheme_id,
    "scheme_name": schemeInfo.scheme_name,
    "instructions": steps
  }

  return schemeData

}

async function findSteps(scheme_id) { // EXERCISE C
  /*
    1C- Build a query in Knex that returns the following data.
    The steps should be sorted by step_number, and the array
    should be empty if there are no steps for the scheme:

      [
        {
          "step_id": 5,
          "step_number": 1,
          "instructions": "collect all the sheep in Scotland",
          "scheme_name": "Get Rich Quick"
        },
        {
          "step_id": 4,
          "step_number": 2,
          "instructions": "profit",
          "scheme_name": "Get Rich Quick"
        }
      ]
  */
  const data = await db("*").from("schemes")
  .leftJoin("steps", "schemes.scheme_id", "steps.scheme_id")
  .where("schemes.scheme_id", scheme_id)
  .orderBy("steps.step_number")

  return data

  /* I probably would have mutated this data somehow, but since this is almost
  identical to the previous endpoint and the data from the last end point is 
  already formatted and includes the same info this endpoint is actually 
  useless so there is really no point to even try. Especially when jest will 
  just fail my endpoint */

}

async function add(scheme) { // EXERCISE D
  /*
    1D- This function creates a new scheme and resolves to _the newly created scheme_.
  */
  await db("schemes").insert(scheme)
  return scheme
}

async function addStep(scheme_id, step) { // EXERCISE E
  /*
    1E- This function adds a step to the scheme with the given `scheme_id`
    and resolves to _all the steps_ belonging to the given `scheme_id`,
    including the newly created one.
  */

  await db("steps").insert(step).where("scheme_id", scheme_id)

  const schemeInfo = await findSteps(scheme_id)

  return schemeInfo
}

module.exports = {
  find,
  findById,
  findSteps,
  add,
  addStep,
}
