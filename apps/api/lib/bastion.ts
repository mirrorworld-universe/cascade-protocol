import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import {
  BastionHostLinux,
  Vpc,
  InstanceClass,
  InstanceSize,
  InstanceType,
  SecurityGroup,
  Port,
} from "aws-cdk-lib/aws-ec2";

export interface BastionStackProps extends StackProps {
  vpc: Vpc;
  postgresEndpoint: string;
  postgresSecurityGroup: SecurityGroup;
}

export class BastionStack extends Stack {
  public bastion: BastionHostLinux;
  public secuityGroup: SecurityGroup;

  constructor(scope: Construct, id: string, props: BastionStackProps) {
    super(scope, id, props);

    this.secuityGroup = new SecurityGroup(this, "EC2PostgresProxy", {
      vpc: props.vpc,
    });

    this.bastion = new BastionHostLinux(this, "Bastion", {
      vpc: props.vpc,
      subnetSelection: {
        subnetGroupName: "Public",
      },
      instanceName: "bastion",
      instanceType: InstanceType.of(InstanceClass.T2, InstanceSize.MICRO),
      securityGroup: this.secuityGroup,
    });
    this.bastion.connections.allowFromAnyIpv4(Port.tcp(22));

    props.postgresSecurityGroup.addIngressRule(
      this.secuityGroup,
      Port.tcp(5432),
      "Allow access from EC2 server.",
      true
    );
  }
}
