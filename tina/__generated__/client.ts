import { createClient } from "tinacms/dist/client";
import { queries } from "./types";
export const client = createClient({ url: 'http://localhost:4001/graphql', token: '68c54cbb5da8ba0b68e53ccaf1745ef2d40d2c14', queries,  });
export default client;
  