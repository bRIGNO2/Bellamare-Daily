import app from "./app";
import { env } from "./config/env";

app.listen(env.port, () => {
  console.log(`🗞  Bellamare Daily API in ascolto su http://localhost:${env.port}`);
  console.log(`   Ambiente: ${env.nodeEnv}`);
});
