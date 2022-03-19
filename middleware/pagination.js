let date_ob = new Date();
let date = date_ob.getFullYear() + "-" + ("0" + (date_ob.getMonth() + 1)).slice(-2) + "-" + ("0" + date_ob.getDate()).slice(-2);
// let date2 = '2022-03-20'

function paginatedResults(pool) {
    return async (req, res, next) => {
    try {
        
      const page = parseInt(req.query.page)
      const limit = parseInt(req.query.limit)
  
      const startIndex = (page - 1) * limit
      const endIndex = page * limit
  
      const results = {}

      const list = await pool.query('SELECT * FROM reservation WHERE date = $1 ORDER BY start_at' , [date])
  

      if (endIndex < list.rows.length) {
        results.next = {
          page: page + 1,
          limit: limit
        }
      }
      
      if (startIndex > 0) {
        results.previous = {
          page: page - 1,
          limit: limit
        }
      }
      
        const list_ASC = await pool.query('SELECT * FROM reservation WHERE date = $1 ORDER BY start_at offset $2 rows fetch next $3 rows only' , [date, startIndex, endIndex])
        const list_DESC = await pool.query('SELECT * FROM reservation WHERE date = $1 ORDER BY start_at DESC offset $2 rows fetch next $3 rows only' , [date, startIndex, endIndex])
        if(list_ASC.rows.length === 0) {
            res.paginatedResults = 0
            next()}
        else{
        if(req.body.order_type === "DESC")
        results.results = {list: list_DESC.rows}
        else
        results.results = {list: list_ASC.rows}

        res.paginatedResults = results
        next()
        }
      } catch (e) {
        res.status(500).json({ message: e.message })
        
      }
    }
  }

  export {paginatedResults};