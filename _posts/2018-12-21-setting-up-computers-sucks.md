---
layout: post
title:  "Setting Up Computers Sucks, and What to do About it"
date:   2018-12-21 12:10:00 -0600
categories: topics
tags:
- automation
- code
- development
- code
- best-practices
- workflow
---
Alright, so I got a new computer to replace my aging Macbook Pro (a Thinkpad X1 Extreme). And of course this means I prepared myself to go through the pain and misery of setting it up the way I like it, just like I did a few months ago with my desktop.

If you're anything like me, this is an AWFUL process. I like to use multiple different frameworks, languages, and tools. I have to tweak things on the machines to get it the way that I like. When it's all said and done, it's a balancing act to keep everything working correctly.

For example... if I'm working on this website... At the time of this writing, it's using a blogging framework called [Jekyll](https://jekyllrb.com/), which is a [Ruby](https://www.ruby-lang.org/en/) gem. But it also uses [gulp](https://gulpjs.com/) to build, and [Browswersync](https://www.browsersync.io/) for development previews, which means it uses [npm](https://www.npmjs.com/). On top of that, I happen to be doing this on a Windows machine right now, which isn't even officially supported by Jekyll. So yeah, it's a little annoying. I like working on this site in [Visual Studio Code](https://code.visualstudio.com/), which is lightweight, and flexible enough to do exactly what I like. Shame on me, but I typically only browser test in [Firefox](https://www.mozilla.org/en-US/firefox/). Obviously the source code is version controlled, and for that I use [git](https://git-scm.com/).

It's a pain to make it work, and this is just a *single* project. I mean, just look at all the links in the previous paragraph, and remember that each one of them has it's own installer and configuration! I like dabbling in various technologies, including .NET, Go, Python, Ruby, Javascript, and I do some on Windows and some on Linux. It's too much for me to do manually anymore. So, long overdue... but I've started to put together an automated process to get my machine the way I like it.

I decided I would start doing some of my work in virtual machines. But I still don't want to have to manually do all of the setup, and I don't want everything wasting space when I'm not using it. Enter [Vagrant](https://www.vagrantup.com/). Not exactly a new technology by any means, but it seems to fit the bill perfectly. It's designed to automate spinning up VMs and setting them up in a consistent and repeatable way. I can start up a VM for Ruby and JS (like the one i'm currently writing this on) and then destroy it when I'm done. It has everything I need for the task at hand, and my laptop isn't polluted with any complicated configuration or installs.

So how does it all work? Because I certainly don't want to have to sit around clicking through a bunch of MSI prompts to get my work done. On my Mac I was using Homebrew, on linux there are various tools, but I'm most familiar with apt-get. But what about Windows? [Chocolatey](https://chocolatey.org/). This is a package manager for use on Windows. Instead of downloading a standard windows installer, you can just install a package via chocolatey.

For example, Firefox can be installed (with no prompts) like so:
{% highlight bash %}
choco install firefox -y
{% endhighlight %}

Even chocolatey itself is installed in an automated (no UI) fashion. Not only that, it can also use an xml file to define multiple packages to be installed! So if I want another package installed, I just add a new record to the xml file.

What I've started to do, is create different "workloads" that I use. For example, my "productivity" workload is git, vscode, and firefox. I have a Ruby one, which is ruby, and msys2. All I do is script out the different workloads that I'd like, and I use those as building blocks for a vagrant VM. So the VM I'm working on now, consists of three workloads, productivity, ruby, and javascript. Which gives me exactly what I need for this project.

This is all pretty new to me, so I'm still just scripting this with powershell. Once I feel happy with how things are working, I'll probably look into using a configuration tool like Ansible, Chef, or Puppet... just so I can also gain some experience with those tools.

Does this sound interesting to you? Or do you want to see how it works? You can check out my [Github repo](https://github.com/thenickfish/dev-machines) for all of the code I use. You can get a working environment to develop this blog with hardly any effort. All you need is Hyper-V, git, and Vagrant.