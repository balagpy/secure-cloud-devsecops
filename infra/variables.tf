variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "app_bucket_name" {
  description = "Name of the application S3 bucket"
  type        = string
}