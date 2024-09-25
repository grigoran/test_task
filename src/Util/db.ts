import knex from "knex";
import { dbConnection } from "../config";

export const db = knex(dbConnection);