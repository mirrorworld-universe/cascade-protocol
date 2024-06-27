import { Stack, StackProps } from "aws-cdk-lib/core";
import {
  Vpc,
  SubnetType,
  InterfaceVpcEndpointAwsService,
} from "aws-cdk-lib/aws-ec2";
import { Construct } from "constructs";

export class NetworkStack extends Stack {
  public vpc: Vpc;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    this.vpc = new Vpc(this, "cascade-core-vpc", {
      natGateways: 0,
      subnetConfiguration: [
        {
          name: "Public",
          cidrMask: 24,
          subnetType: SubnetType.PUBLIC,
        },
        {
          name: "Postgres",
          cidrMask: 24,
          subnetType: SubnetType.PRIVATE_ISOLATED,
        },
      ],
    });

    this.vpc.addInterfaceEndpoint("SecretsManagerEndpoint", {
      service: InterfaceVpcEndpointAwsService.SECRETS_MANAGER,
    });
  }
}
