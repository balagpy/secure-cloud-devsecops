# DevSecOps — Senior Security Engineer Practice Live Task (AWS + Snyk)

**Scenario**: Secure a small app + AWS footprint under time pressure.

## Task
1. Review `infra/` and call out at least 3 misconfigurations.
2. Make S3 **private** and enable **default encryption (SSE‑KMS)**.
3. Replace the wildcard IAM policy with a **least‑privilege** policy for only the app’s needs (S3 GetObject/PutObject/ListBucket on one bucket).
4. Run **Snyk** against the app, fix ≥1 High/Critical dependency issue, re‑run Snyk to show reduction.
5. Summarize and suggest one SOC 2‑relevant control you’d add next (e.g., CI OIDC, mandatory SAST in PRs, GuardDuty, etc.).

## Quick commands
```bash
# App
cd app && npm install && npm start

# Snyk (assumes you have a token configured: `snyk auth`)
cd app
snyk test          # Open Source (dependencies)
snyk code test     # SAST (optional if time)

# Terraform (dry-run / show)
cd infra
terraform init
terraform validate
terraform plan -var "app_bucket_name=bild-pdm-demo-CHANGE_ME"
