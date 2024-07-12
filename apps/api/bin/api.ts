#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { NetworkStack } from "../lib/network";
import { PostgresStack } from "../lib/database";
import { BastionStack } from "../lib/bastion";
import { LambdaStack } from "../lib/lambda";
import { resolve } from "path";
import * as path from "path";

console.log(__dirname);

const app = new cdk.App();

const networkStack = new NetworkStack(app, "CascadeApiNetworkStack");
const postgresStack = new PostgresStack(app, "CascadeApiPostgresStack", {
  vpc: networkStack.vpc,
  pathToMigrationsDirectory: resolve(__dirname, "../db/drizzle"),
});

new BastionStack(app, "CascadeApiBastionStack", {
  vpc: networkStack.vpc,
  postgresEndpoint: postgresStack.proxy.endpoint,
  postgresSecurityGroup: postgresStack.securityGroup,
});

new LambdaStack(app, "CascadeApiLambdaStack", {
  vpc: networkStack.vpc,
  postgresEndpoint: postgresStack.proxy.endpoint,
  postgresSecurityGroup: postgresStack.securityGroup,
  postgresSecret: postgresStack.secret,
});
