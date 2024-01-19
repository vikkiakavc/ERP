const express = require('express')
require('./db/index')

const app = express();
const port = process.env.PORT

const adminRouter = require('./routers/adminRouter')
const departmentRouter =require('./routers/departmentRouter')
const userRouter = require('./routers/userRouter')
const transactionRouter = require('./routers/transactionRouter')
const projectRouter = require('./routers/projectRouter')

app.use(express.json());
app.use(adminRouter)
app.use(departmentRouter)
app.use(userRouter)
app.use(transactionRouter)
app.use(projectRouter)

app.get('/', (req, res) => {
    res.send('Welcome to the app')
})

app.listen(port, () => {
    console.log(`The server is up and running on ${port}`)
})