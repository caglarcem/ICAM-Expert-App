/**
 * Pre-start is where we want to place things that must run BEFORE the express
 * server is started. This is useful for environment variables, command-line
 * arguments, and cron-jobs.
 */

// NOTE: DO NOT IMPORT ANY SOURCE CODE HERE
import path from 'path';
import dotenv from 'dotenv';
import { parse } from 'ts-command-line-args';

// **** Types **** //

interface IArgs {
  env: string;
}

// **** Setup **** //

// Command line arguments
const args = parse<IArgs>({
  env: {
    type: String,
    defaultValue: 'development',
    alias: 'e',
  },
});

if (args.env !== 'production') {
  // Set the env file. Avoid in prod since it can override variables set on the deployment server
  const result2 = dotenv.config({
    path: path.join(__dirname, `../env/${args.env}.env`),
  });
  if (result2.error) {
    throw result2.error;
  }
}
