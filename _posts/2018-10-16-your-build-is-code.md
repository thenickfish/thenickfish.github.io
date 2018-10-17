---
layout: post
title:  "Your Build is Code, and Other Obvious Facts."
date:   2018-10-16 18:47:00 -0600
categories: continuous-delivery devops code
tags:
- jenkins
- continuous-delivery
- build-pipeline
- best-practices
- devops
---
Yep, you read it right. Your continuous delivery pipeline is code, and needs to be tested. You're probably thinking to yourself, "Wow, Nick. Thanks for enlightening us with your vast wisdom." I know how you developer types are, full of nothing but sarcasm and logic. But maybe it's not as obvious as you think.

I've been there. You are working hard on a super automated pipeline, you're running tests, you're moving binaries. Life is **good**. But then you have to deploy to the next environment... you have to use the official change management (CM) process, and it lives entirely outside your pipeline. No worries though, you're a smart developer, and you planned for this. You've already built some deployment artifacts inside the pipeline, and pushed them to your artifact repository.

### I'll lay it out for you...
Let's say hypothetically you're deploying an ASP.net web application. For those who don't know, a typical workflow for doing this would involve building some binaries (DLLs), copying them to the webserver, and updating a configuration file before starting it up. Maybe you've written a powershell script to do this, and used it in your build. You've taken all of the binaries you need to deploy and stuck them into a zip archive in your artifact repository to send through your CM process. You've deployed this application multiple times in the past, without a single issue. You expect the same this time... Your pipeline performed flawlessly, all of your binaries are built, your tests passed in the test environment, and you're ready to send it to prod. You fill out the paperwork, and point your CM to the zip archive in the repository. They say it deployed successfully, but something isn't working.

### So what happened?
How is this possible? Your build succeeded, your tests are all green, and your website in the test environment looks perfect. This happened because you had a break in the process. Your deployment to your test environment was tested, and it worked properly. But when you look in the zip file that was created, and the contents aren't correct. There's an extra directory inside, your coworker had to make a change the other day and move some files. When she committed her changes, the build pipeline failed during the deployment, because the tests started failing. Because of this, she adjusted the pipeline to properly deploy to the test environment. Unfortunately, she didn't realize there was a zip file being created separately, and didn't make any adjustments to account for the new folder.

### And what's the fix?
An obvious answer would be that you need to deploy consistently to all of your environments. You did *actually* test your deployment, but then you abandoned your tried and true pipeline when you had to deploy through the CM process. Consistently deploying is great, but that's not all that could be done here, and in some companies, it's not even possible (it should be, you should fight for that). Another simple thing you could do to help combat the issues encountered here, would be to deploy the actual artifact you create for the CM process. Instead of copying the binaries and creating a zip archive separately... deploy the zip archive in your pipeline. This will test the actual artifact. Sure, it's not perfect... and things can go wrong still. But let's be honest, if you have to break your process to deploy your stuff manually through your CM process, you're living in a broken world anyways.

Like I said in the title, your build is code. These things are important tools in your process, and they should be treated as such. Your build configuration should be checked in along side the code it builds, and changes to it should be scrutinized just like any other change. Ensure that the artifacts you create and test in your pipeline are *actually* the same as what you're deploying to production.