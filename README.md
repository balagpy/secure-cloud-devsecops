# secure-cloud-devsecops

Temporary branch update for Chmod SCM-native PR status verification.

Practical DevSecOps Security Lab

Scenario: Harden vulnerable AWS infrastructure and app dependencies.

![License: MIT](https://img.shields.io/badge/License-MIT-green.svg) ![Focus: Security Architecture](https://img.shields.io/badge/Focus-Security%20Architecture-blue) ![Diagrams: SVG](https://img.shields.io/badge/Diagrams-SVG-orange)

## Challenge Tasks
1. Review `infra/` and identify at least 3 misconfigurations.
2. Make S3 private and enable default encryption (`SSE-KMS`).
3. Replace wildcard IAM access with least-privilege access only for app bucket actions.
4. Run Snyk on the app, remediate at least one High/Critical issue, and re-run to verify reduction.
5. Summarize improvements and add one SOC 2-relevant next control.

## Detailed Solution
- [DETAILED_SOLUTION.md](/Users/balaji/Downloads/secure-cloud-devsecops-main/solution/DETAILED_SOLUTION.md)

## Quick Commands
```bash
# App
cd app && npm install && npm start

# Snyk (token required: snyk auth)
cd app
snyk test
snyk code test

# Terraform validation
cd infra
terraform init
terraform validate
terraform plan -var "app_bucket_name=bild-pdm-demo-CHANGE_ME"
```

## Labs Included
1. AWS S3 hardening lab (public-to-private conversion)
2. IAM least-privilege policy design lab
3. Snyk dependency vulnerability remediation lab

## Disclaimer
This repository is for security training and interview practice only. It contains intentionally insecure patterns for learning purposes and must not be used in production without a full security review, hardening, and organizational compliance validation.

SCM webhook re-test update at 2026-05-28T14:49:12Z
SCM webhook final re-test at 2026-05-28T15:06:39Z
SCM installation-refresh retest at 2026-05-28T15:30:59Z
SCM installation-id sync retest at 2026-05-28T15:32:29Z
SCM metadata-fix retest at 2026-05-28T15:35:51Z
SCM workflow-mode retest at 2026-05-28T15:40:30Z
SCM async-start retest at 2026-05-28T15:49:45Z
SCM check-run retest at 2026-05-28T15:58:10Z
SCM check-run permission retest at 2026-05-28T16:07:20Z
SCM check-run findings-count retest at 2026-05-28T16:27:21Z
