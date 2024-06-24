import { test } from "vitest";

import * as cdk from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";
import { CascadeAPIStack } from "../lib/cdk-stack";

// example test. To run these tests, uncomment this file along with the
// example resource in lib/api-stack.ts
test("SQS Queue Created", () => {
  const app = new cdk.App();
  // WHEN
  const stack = new CascadeAPIStack(app, "TestCascadeAPIStack");
  // THEN
  const template = Template.fromStack(stack);
  template.hasResourceProperties("AWS::SQS::Queue", {
    VisibilityTimeout: 300,
  });
});
