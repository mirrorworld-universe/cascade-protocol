import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import {
  Instance,
  BastionHostLinux,
  Vpc,
  InstanceClass,
  InstanceSize,
  InstanceType,
  SecurityGroup,
  Port,
  MachineImage,
  KeyPair,
} from "aws-cdk-lib/aws-ec2";

export interface BastionStackProps extends StackProps {
  vpc: Vpc;
  postgresEndpoint: string;
  postgresSecurityGroup: SecurityGroup;
}

export class BastionStack extends Stack {
  public secuityGroup: SecurityGroup;

  constructor(scope: Construct, id: string, props: BastionStackProps) {
    super(scope, id, props);

    // TODO: Make this an environment variable
    const keypair = KeyPair.fromKeyPairName(
      this,
      "CascadeBastionKeypair",
      "cascade-jonas-bastion"
    );

    this.secuityGroup = new SecurityGroup(this, "EC2PostgresProxy", {
      vpc: props.vpc,
    });

    const ec2 = new Instance(this, "Bastion", {
      machineImage: MachineImage.latestAmazonLinux2(),
      vpc: props.vpc,
      vpcSubnets: {
        subnetGroupName: "Public",
      },
      instanceName: "bastion",
      instanceType: InstanceType.of(InstanceClass.T2, InstanceSize.MICRO),
      securityGroup: this.secuityGroup,
      keyPair: keypair,
    });

    ec2.connections.allowFromAnyIpv4(Port.tcp(22));

    props.postgresSecurityGroup.addIngressRule(
      this.secuityGroup,
      Port.tcp(5432),
      "Allow access from EC2 server.",
      true
    );
  }
}
