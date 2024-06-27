import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as apigw from "aws-cdk-lib/aws-apigateway";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { SecurityGroup } from "aws-cdk-lib/aws-ec2";
import { Vpc, Port } from "aws-cdk-lib/aws-ec2";
import { Secret } from "aws-cdk-lib/aws-secretsmanager";
import { Duration } from "aws-cdk-lib";

export interface LambdaStackProps extends cdk.StackProps {
  vpc: Vpc;
  postgresEndpoint: string;
  postgresSecurityGroup: SecurityGroup;
  postgresSecret: Secret;
}

export class LambdaStack extends cdk.Stack {
  public securityGroup: SecurityGroup;

  constructor(scope: Construct, id: string, props: LambdaStackProps) {
    super(scope, id, props);

    this.securityGroup = new SecurityGroup(this, "cascade-lambda-proxy", {
      vpc: props.vpc,
    });

    props.postgresSecurityGroup.addIngressRule(
      this.securityGroup,
      Port.tcp(5432),
      "Allow access from Lambda.",
      true
    );

    const fn = new NodejsFunction(this, "cascade-api-lambda", {
      entry: "src/index.ts",
      handler: "handler",
      runtime: lambda.Runtime.NODEJS_20_X,
      environment: {
        POSTGRES_SECRET_ARN: props.postgresSecret.secretArn,
        PGHOST: props.postgresEndpoint,
        PGSSLMODE: "verify-ca",
        PGDATABASE: "postgres",
      },
      vpc: props.vpc,
      vpcSubnets: {
        subnetGroupName: "Postgres",
      },
      timeout: Duration.seconds(30),
      securityGroups: [this.securityGroup],
    });

    const functionUrl = fn.addFunctionUrl({
      authType: lambda.FunctionUrlAuthType.NONE,
    });

    new apigw.LambdaRestApi(this, "cascade-protocol-api", {
      handler: fn,
    });

    new cdk.CfnOutput(this, "APIGatewayURL", {
      value: functionUrl.url,
      description: "The URL of the API Gateway",
    });
    props.postgresSecret.grantRead(fn);
  }
}
