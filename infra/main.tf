terraform {
  required_version = ">= 1.3.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = ">= 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

resource "aws_s3_bucket" "app_bucket" {
  bucket = var.app_bucket_name
  force_destroy = true
}

resource "aws_s3_bucket_ownership_controls" "app" {
  bucket = aws_s3_bucket.app_bucket.id
  rule {
    object_ownership = "BucketOwnerPreferred"
  }
}

resource "aws_s3_bucket_acl" "app" {
  bucket = aws_s3_bucket.app_bucket.id
  acl    = "public-read"
}

resource "aws_s3_bucket_policy" "public_read" {
  bucket = aws_s3_bucket.app_bucket.id
  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Sid: "PublicRead",
        Effect: "Allow",
        Principal: "*",
        Action: ["s3:GetObject"],
        Resource: ["${aws_s3_bucket.app_bucket.arn}/*"]
      }
    ]
  })
}

resource "aws_iam_role" "app_role" {
  name               = "bild-pdm-demo-app-role"
  assume_role_policy = data.aws_iam_policy_document.assume_role_policy.json
}

data "aws_iam_policy_document" "assume_role_policy" {
  statement {
    actions = ["sts:AssumeRole"]
    principals {
      type        = "Service"
      identifiers = ["ec2.amazonaws.com", "ecs-tasks.amazonaws.com"]
    }
  }
}

resource "aws_iam_policy" "app_wildcard_policy" {
  name   = "bild-pdm-demo-wildcard"
  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect: "Allow",
        Action: "*",
        Resource: "*"
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "attach_wildcard" {
  role       = aws_iam_role.app_role.name
  policy_arn = aws_iam_policy.app_wildcard_policy.arn
}

output "bucket_name" {
  value = aws_s3_bucket.app_bucket.bucket
}

output "app_role_arn" {
  value = aws_iam_role.app_role.arn
}