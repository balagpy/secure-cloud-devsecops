# Detailed Solution - DevSecOps Security Lab (AWS + Snyk)

## Objective
Secure the intentionally vulnerable cloud and application setup by applying baseline production-grade controls.

## 1) Misconfigurations Identified in `infra/main.tf`
1. Public S3 ACL (`aws_s3_bucket_acl.app` uses `public-read`).
2. Public bucket policy permits anonymous read (`Principal: "*"`, `s3:GetObject`).
3. Missing S3 default encryption.
4. IAM policy grants full admin-like access (`Action: "*"`, `Resource: "*"`).
5. `force_destroy = true` can permanently delete bucket data accidentally.

## 2) S3 Remediation - Private Bucket + SSE-KMS

### Required changes
1. Remove `aws_s3_bucket_acl.app` with `public-read`.
2. Remove `aws_s3_bucket_policy.public_read` that allows anonymous access.
3. Add `aws_s3_bucket_public_access_block`.
4. Add KMS key and default bucket encryption using `aws:kms`.

### Example Terraform
```hcl
resource "aws_kms_key" "s3_kms" {
  description             = "KMS key for app bucket encryption"
  deletion_window_in_days = 7
  enable_key_rotation     = true
}

resource "aws_s3_bucket_public_access_block" "app" {
  bucket                  = aws_s3_bucket.app_bucket.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_server_side_encryption_configuration" "app" {
  bucket = aws_s3_bucket.app_bucket.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm     = "aws:kms"
      kms_master_key_id = aws_kms_key.s3_kms.arn
    }
    bucket_key_enabled = true
  }
}
```

## 3) IAM Remediation - Least Privilege
Replace wildcard policy with bucket-scoped permissions only.

### Required permissions
1. `s3:ListBucket` on bucket ARN.
2. `s3:GetObject` and `s3:PutObject` on object ARN path.

### Example Terraform
```hcl
resource "aws_iam_policy" "app_s3_least_privilege" {
  name = "bild-pdm-demo-app-s3-least-privilege"
  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect   = "Allow",
        Action   = ["s3:ListBucket"],
        Resource = [aws_s3_bucket.app_bucket.arn]
      },
      {
        Effect   = "Allow",
        Action   = ["s3:GetObject", "s3:PutObject"],
        Resource = ["${aws_s3_bucket.app_bucket.arn}/*"]
      }
    ]
  })
}
```

## 4) Snyk Remediation Steps
Run from `/app`.

```bash
npm install
snyk test
```

Fix vulnerable dependencies and re-test:

```bash
npm audit fix
npm install lodash@latest minimist@latest marked@latest tar@latest
snyk test
```

Expected result: High/Critical findings reduce compared to baseline.

## 5) Validation Steps

### Terraform
```bash
cd infra
terraform init
terraform validate
terraform plan -var "app_bucket_name=YOUR-UNIQUE-BUCKET-NAME"
```

### App
```bash
cd app
npm start
```

### Security
```bash
cd app
snyk test
snyk code test
```

## 6) SOC 2 Next Control Recommendation
Implement CI to AWS access with GitHub Actions OIDC role assumption and remove static cloud credentials from CI secrets.

## 7) Labs Included
1. AWS S3 hardening lab (public to private conversion).
2. IAM least-privilege policy design lab.
3. Snyk dependency vulnerability remediation lab.

## Disclaimer
This repository is for security training and interview practice only. It contains intentionally insecure patterns for learning purposes and must not be used in production without complete security hardening and formal compliance review.
