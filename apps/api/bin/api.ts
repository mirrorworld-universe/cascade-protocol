#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { NetworkStack } from "../lib/network";
import { PostgresStack } from "../lib/database";
import { BastionStack } from "../lib/bastion";
import { LambdaStack } from "../lib/lambda";

const app = new cdk.App();

const networkStack = new NetworkStack(app, "CascadeApiNetworkStack");
const postgresStack = new PostgresStack(app, "CascadeApiPostgresStack", {
  vpc: networkStack.vpc,
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
