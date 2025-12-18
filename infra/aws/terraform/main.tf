# AWS ECS Terraform Configuration (Base)
# This is a template for production deployment

terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

# Variables
variable "aws_region" {
  default = "ap-southeast-1" # Singapore - closest to Vietnam
}

variable "app_name" {
  default = "woman-ecomm-base-a"
}

variable "environment" {
  default = "production"
}

# VPC
resource "aws_vpc" "main" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name = "${var.app_name}-vpc"
  }
}

# Internet Gateway
resource "aws_internet_gateway" "main" {
  vpc_id = aws_vpc.main.id

  tags = {
    Name = "${var.app_name}-igw"
  }
}

# Public Subnets
resource "aws_subnet" "public_a" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = "10.0.1.0/24"
  availability_zone       = "${var.aws_region}a"
  map_public_ip_on_launch = true

  tags = {
    Name = "${var.app_name}-public-a"
  }
}

resource "aws_subnet" "public_b" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = "10.0.2.0/24"
  availability_zone       = "${var.aws_region}b"
  map_public_ip_on_launch = true

  tags = {
    Name = "${var.app_name}-public-b"
  }
}

# ECS Cluster
resource "aws_ecs_cluster" "main" {
  name = "${var.app_name}-cluster"

  setting {
    name  = "containerInsights"
    value = "enabled"
  }
}

# ECR Repositories
resource "aws_ecr_repository" "frontend" {
  name                 = "${var.app_name}/frontend"
  image_tag_mutability = "MUTABLE"
}

resource "aws_ecr_repository" "strapi" {
  name                 = "${var.app_name}/strapi"
  image_tag_mutability = "MUTABLE"
}

resource "aws_ecr_repository" "nestjs" {
  name                 = "${var.app_name}/nestjs"
  image_tag_mutability = "MUTABLE"
}

# Application Load Balancer
resource "aws_lb" "main" {
  name               = "${var.app_name}-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb.id]
  subnets            = [aws_subnet.public_a.id, aws_subnet.public_b.id]
}

# Security Group for ALB
resource "aws_security_group" "alb" {
  name        = "${var.app_name}-alb-sg"
  description = "Security group for ALB"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# DocumentDB (MongoDB-compatible) - Alternative to MongoDB Atlas
# Uncomment when ready to use
# resource "aws_docdb_cluster" "main" {
#   cluster_identifier      = "${var.app_name}-docdb"
#   master_username         = var.db_username
#   master_password         = var.db_password
#   backup_retention_period = 7
#   preferred_backup_window = "07:00-09:00"
#   skip_final_snapshot     = false
# }

# Outputs
output "alb_dns_name" {
  value = aws_lb.main.dns_name
}

output "ecr_frontend_url" {
  value = aws_ecr_repository.frontend.repository_url
}

output "ecr_strapi_url" {
  value = aws_ecr_repository.strapi.repository_url
}

output "ecr_nestjs_url" {
  value = aws_ecr_repository.nestjs.repository_url
}
