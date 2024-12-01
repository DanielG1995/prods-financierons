import { createExpressServer } from "routing-controllers";
import 'dotenv/config';
import cors from 'cors'

let PORT = 3002;

// creates express app, registers all controller routes and returns you express app instance
const app = createExpressServer({
  cors: true,
  routePrefix: "/bp",

  controllers: [
    __dirname + "/controllers/*{.js,.ts}",
  ], // we specify controllers we want to use
});
app.use(cors())
// run express application on port 3000
app.listen(PORT, () => {
  console.log(`Servidor Iniciado`);
  console.log(`Host: http://localhost:${PORT}`);
  console.log(`Fecha/Hora: ${new Date().toLocaleString()}`);
});
