---
title: "{{ replace .Name "-" " " | title }}"
date: {{ .Date }}
slug: "{{ .Name }}"
team_home: ""
team_away: "" 
league: ""
match_date: {{ now.Format "2006-01-02" }}
match_time: "19:30"
status: "scheduled"
featured_image: ""
excerpt: ""
tags: []
author: "Admin"
draft: false
---
Enter match details here...