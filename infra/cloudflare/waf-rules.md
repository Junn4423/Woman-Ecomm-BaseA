# Cloudflare WAF Configuration Guide

## Overview

Hướng dẫn cấu hình Cloudflare Web Application Firewall (WAF) cho Women's E-Commerce Platform.

## Prerequisites

1. Domain đã được thêm vào Cloudflare
2. DNS đã được proxy qua Cloudflare (orange cloud)
3. SSL/TLS được bật

## Recommended WAF Rules

### 1. OWASP Core Ruleset

Bật OWASP ModSecurity Core Rule Set để bảo vệ khỏi các tấn công phổ biến:
- SQL Injection
- Cross-Site Scripting (XSS)
- Remote File Inclusion (RFI)
- Local File Inclusion (LFI)

```
Security > WAF > Managed Rules > Enable OWASP Core Ruleset
```

### 2. Rate Limiting

Tạo các rule rate limiting để chống DDoS và brute force:

#### Login Rate Limit
```yaml
If: URI Path equals "/api/auth/login"
Then: Rate limit with 5 requests per minute
Action: Block for 10 minutes
```

#### Registration Rate Limit
```yaml
If: URI Path equals "/api/auth/register"
Then: Rate limit with 3 requests per minute
Action: Block for 30 minutes
```

#### API Rate Limit
```yaml
If: URI Path starts with "/api/"
Then: Rate limit with 100 requests per minute
Action: Challenge
```

### 3. Bot Protection

Bật Bot Fight Mode để chống các bot độc hại:

```
Security > Bots > Bot Fight Mode: ON
```

### 4. Custom Rules

#### Block Common Attack Patterns
```yaml
Rule Name: Block SQL Injection Attempts
Match: URI Query String contains "SELECT" OR "UNION" OR "DROP"
Action: Block
```

#### Block Suspicious User Agents
```yaml
Rule Name: Block Malicious User Agents
Match: User Agent contains "sqlmap" OR "nikto" OR "scanner"
Action: Block
```

#### Country Blocking (Optional)
```yaml
Rule Name: Block High-Risk Countries
Match: Country NOT in ["VN", "US", "SG", "JP"]
Action: Challenge
```

### 5. Page Rules

#### Cache Static Assets
```yaml
URL: example.com/images/*
Settings:
  - Cache Level: Cache Everything
  - Edge Cache TTL: 1 month
  - Browser Cache TTL: 1 week
```

#### Security Headers
```yaml
URL: example.com/*
Settings:
  - Always Use HTTPS
  - Security Level: High
  - Browser Integrity Check: ON
```

## Firewall Events Monitoring

Regularly check:
- Security > Overview > Security Events
- Security > Events

## API Tokens

Để tích hợp với code, tạo API token:

```
My Profile > API Tokens > Create Token
Permissions:
  - Zone: WAF: Edit
  - Zone: Firewall Rules: Edit
```

## Environment Variables

Thêm vào `.env`:
```env
CLOUDFLARE_API_TOKEN=your-api-token
CLOUDFLARE_ZONE_ID=your-zone-id
CLOUDFLARE_ACCOUNT_ID=your-account-id
```

## Testing

Sau khi cấu hình, test với:
1. Thử các request với SQL injection patterns
2. Kiểm tra rate limiting bằng cách gửi nhiều request
3. Verify SSL/TLS đang hoạt động

## Rollback

Nếu có vấn đề, có thể tạm disable WAF:
```
Security > WAF > Set to Essentially Off (tạm thời)
```

## Support

- Cloudflare Docs: https://developers.cloudflare.com/waf/
- Dashboard: https://dash.cloudflare.com/
