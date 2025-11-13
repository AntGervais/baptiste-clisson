import { createClient } from "tinacms/dist/client";
import { queries } from "./types";
export const client = createClient({ url: 'http://localhost:4001/graphql', token: '1aa43ea3439008ca83a0afe90949b3669ab23672', queries,  });
export default client;
  