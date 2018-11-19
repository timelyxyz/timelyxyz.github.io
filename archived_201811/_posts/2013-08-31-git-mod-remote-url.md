---
layout: page
title: "git modify remote url from ssh to https"
description: ""
---
[//]: # {% include JB/setup %}

To change an existing remote URL, use the `git remote set-url` command:

    $ git remote -v
    # View existing remotes
    origin  https://github.com/user/repo.git (fetch)
    origin  https://github.com/user/repo.git (push)

    $ git remote set-url origin https://github.com/user/repo2.git
    # Change the 'origin' remote URL
    
    $ git remote -v
    # Verify new remote URL
    origin  https://github.com/user/repo2.git (fetch)
    origin  https://github.com/user/repo2.git (push)

The command takes two args:
* existing remote name: `origin`
	
