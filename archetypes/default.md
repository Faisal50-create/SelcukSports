---
title: "{{ replace .Name "-" " " | title }}"
date: {{ .Date }}
categories: ["TV Channels"]  # Default category
featured_image: "/images/posts/default.jpg"  # Default image path
summary: "{{ truncate 160 "A brief description for SEO rich snippets" }}"  # Auto-truncated
description: "{{ truncate 160 "Detailed meta description for search engines" }}"  # Alternate field
author: "Faisal Khan"
draft: false  # Auto-publish new posts

# SEO Schema (optional but recommended)
schema:
  type: "NewsArticle"  # Or "Article"/"BlogPosting"
  publisher: "DazcFutbolTV"
  publisher_logo: "/images/logo.png"  
---

<!-- Your content goes here -->
