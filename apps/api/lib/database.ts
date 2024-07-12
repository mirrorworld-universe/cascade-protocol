import { App, Stack, StackProps, Duration, CustomResource } from "aws-cdk-lib";
import {
  Vpc,
  SecurityGroup,
  InstanceClass,
  InstanceType,
  InstanceSize,
  Port,
  SubnetType,
} from "aws-cdk-lib/aws-ec2";
import {
  Effect,
  ManagedPolicy,
  PolicyStatement,
  Role,
  ServicePrincipal,
} from "aws-cdk-lib/aws-iam";
import { Architecture, Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import {
  Credentials,
  DatabaseInstance,
  DatabaseInstanceEngine,
  DatabaseProxy,
  PostgresEngineVersion,
} from "aws-cdk-lib/aws-rds";
import { Secret } from "aws-cdk-lib/aws-secretsmanager";
import { Provider } from "aws-cdk-lib/custom-resources";
import { computeDirectoryHash } from "./utils";

export interface PostgresStackProps extends StackProps {
  vpc: Vpc;
  pathToMigrationsDirectory: string;
}

const Noop = () => {
  return [];
};

export class PostgresStack extends Stack {
  public secret: Secret;
  public proxy: DatabaseProxy;
  public instance: DatabaseInstance;
  public securityGroup: SecurityGroup;

  constructor(scope: App, id: string, props: PostgresStackProps) {
    super(scope, id, props);

    this.secret = new Secret(this, "Secret", {
      generateSecretString: {
        secretStringTemplate: JSON.stringify({
          username: "master",
        }),
        generateStringKey: "password",
        excludePunctuation: true,
        includeSpace: false,
      },
    });

    this.securityGroup = new SecurityGroup(this, "PostgresSecurityGroup", {
      vpc: props.vpc,
    });
    this.securityGroup.addIngressRule(this.securityGroup, Port.tcp(5432));

    this.instance = new DatabaseInstance(this, "PostgresInstance", {
      engine: DatabaseInstanceEngine.postgres({
        version: PostgresEngineVersion.VER_16_3,
      }),
      credentials: Credentials.fromSecret(this.secret),
      vpc: props.vpc,
      vpcSubnets: {
        subnetGroupName: "Postgres",
      },
      securityGroups: [this.securityGroup],
      instanceType: InstanceType.of(InstanceClass.T3, InstanceSize.MICRO),
      allowMajorVersionUpgrade: false,
    });

    this.proxy = this.instance.addProxy("PostgresProxy-test", {
      secrets: [this.secret],
      vpc: props.vpc,
      debugLogging: true,
      borrowTimeout: Duration.seconds(30),
      securityGroups: [this.securityGroup],
    });

    const {
      migrationLambdaFunction,
      lamdaSecurityGroup: migrationLambdaSecurityGroup,
    } = this.createMigrationLambda({
      applicationName: "Cascade",
      migrationDirectoryPath: props.pathToMigrationsDirectory,
      secret: this.secret,
      databaseInstance: this.instance,
      vpc: props.vpc,
    });

    this.securityGroup.addIngressRule(
      migrationLambdaSecurityGroup,
      Port.tcp(5432)
    );

    this.createCustomCascadeResource({
      database: this.instance,
      migrationLambdaFunction,
      migrationDirectoryPath: props.pathToMigrationsDirectory,
    });
  }

  // This is a database migration lambda we're creating
  createMigrationLambda = ({
    vpc,
    applicationName,
    migrationDirectoryPath,
    secret,
    databaseInstance,
  }: CreateMigrationLambda) => {
    const executionRole = new Role(this, "MigrationLambdaRole", {
      assumedBy: new ServicePrincipal("lambda.amazonaws.com"),
    });

    const cloudwatchPolicy = new PolicyStatement({
      effect: Effect.ALLOW,
      actions: [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents",
      ],
      resources: ["arn:aws:logs:*:*:*"],
    });

    const secretAccessPolicy = new PolicyStatement({
      effect: Effect.ALLOW,
      actions: ["secretsmanager:GetSecretValue"],
      resources: [this.secret.secretArn],
    });

    executionRole.addToPolicy(cloudwatchPolicy);
    executionRole.addToPolicy(secretAccessPolicy);
    executionRole.addManagedPolicy(
      ManagedPolicy.fromAwsManagedPolicyName(
        "service-role/AWSLambdaVPCAccessExecutionRole"
      )
    );

    const lamdaSecurityGroup = new SecurityGroup(
      this,
      "MigrationLambdaSecurityGroup",
      {
        vpc,
        allowAllOutbound: true,
      }
    );

    const migrationLambdaFunction = new NodejsFunction(
      this,
      "cascade-migration-lambda",
      {
        functionName: `${applicationName}-DBMigrationLambda`,
        entry: "src/migrate/index.ts",
        handler: "handler",
        runtime: Runtime.NODEJS_20_X,
        architecture: Architecture.ARM_64,
        bundling: {
          commandHooks: {
            beforeBundling: Noop,
            beforeInstall: Noop,
            afterBundling: (_, outputDir) => {
              return [
                `mkdir -p ${outputDir}/drizzle`,
                `mkdir -p ${outputDir}/drizzle/db`,
                `mkdir -p ${outputDir}/drizzle/meta`,
                `cp -r ${migrationDirectoryPath}/* ${outputDir}/drizzle`,
              ];
            },
          },
        },
        environment: {
          POSTGRES_SECRET_ARN: secret.secretArn,
          PGSSLMODE: "verify-ca",
          PGDATABASE: "postgres",
        },
        vpc,
        vpcSubnets: {
          subnetGroupName: "Postgres",
        },
        securityGroups: [lamdaSecurityGroup],
        role: executionRole,
      }
    );

    return {
      migrationLambdaFunction,
      lamdaSecurityGroup,
    };
  };

  createCustomCascadeResource = ({
    database,
    migrationLambdaFunction,
    migrationDirectoryPath,
  }: CreateCustomCascadeResource) => {
    const databaseMigrationProvider = new Provider(
      this,
      "DatabaseMigrationProvider",
      {
        onEventHandler: migrationLambdaFunction,
      }
    );

    const customResource = new CustomResource(
      this,
      "Custom::CascadeDatabaseMigrationResource",
      {
        serviceToken: databaseMigrationProvider.serviceToken,
        resourceType: "Custom::CascadeDatabaseMigrationResource",
        properties: {
          migrationDirectoryPath: computeDirectoryHash(migrationDirectoryPath),
        },
      }
    );

    customResource.node.addDependency(database);
  };
}

export interface CreateMigrationLambda {
  applicationName: string;
  migrationDirectoryPath: string;
  secret: Secret;
  databaseInstance: DatabaseInstance;
  vpc: Vpc;
}

export interface CreateCustomCascadeResource {
  database: DatabaseInstance;
  migrationLambdaFunction: NodejsFunction;
  migrationDirectoryPath: string;
}
