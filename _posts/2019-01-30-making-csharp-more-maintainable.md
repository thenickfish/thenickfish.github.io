---
layout: post
title:  "Make your C# Project Easier to Maintain"
date:   2019-01-30 16:40:00 -0600
categories: topics
tags:
- code
- development
- code
- best-practices
---
If any of you have worked in an application that predates your employment at a large company, I think you'll be able to relate to me on this. You have no clue what's going on, there are millions of repository and service layers, caching all over the place, and just general confusion. And I think it makes a lot of sense that the code is put together this way, it probably started out small, and simple, and through time all of those layers become bloated. The developer who originally created the application is long gone, and you're in charge of adding new features. The quickest way to do that is to just follow the same pattern.

I like to listen to talks from tech conferences while I'm driving, or just sitting around bored. I found myself listening to a talk titled "[Clean Architecture with ASP.NET Core 2.1](https://youtu.be/_lwCVE_XgqI)" and it left me feeling inspired. I've known that some of the code I work on is far from clean, but after seeing a new application being designed with these practices... I was excited to learn about it to say the least.

If you watch the video, you'll hear mentions of a lot of different technologies that helped him create his project in such an elegant way. Entity Framework, MediatR, and Fluent Validation are the three that I was really excited to use. It's funny that I had any interest in Entity Framework, because in my early days as a developer, I did some work with Hibernate in a Java Spring app, and I was definitely not a fan. Since then I've been nervous to use an ORM.

So after seeing this video, I jumped right in and started researching, which lead me to watch some of Jimmy Bogard's (the creator of MediatR) talks. He covers a lot of parallel topics, and obviously as the creator of MediatR, he's a huge proponent of it. But that's not the only idea he had. So, further down the rabbit hole I went, eventually finding his [blog post](https://jimmybogard.com/contoso-university-examples-with-cqrs-mediatr-automapper-and-more/) with links to examples of the code. I started reading through, and found it super intuitive. Up until this point, I was used to seeing applications split into horizontal layers (as Jimmy would say).

A typical web app I'm used to working on would be organized by type... Controllers, Repositories, Services, Models, etc. This makes sense, because if you need to update a model, you know exactly where to go. But it breaks down when you're asked to add a feature to a specific part of the app. If you have to change some business logic, add fields to the model, and change validations, you may have to go all over the place to find what you need.

Jimmy's sample app is organized completely different, for an example of what I mean, take a look at the "[Create Student feature](https://github.com/jbogard/ContosoUniversityDotNetCore/blob/master/ContosoUniversity/Features/Students/Create.cs)." If you're trying to make a change to the student creation, everything you need is held within that file. Down to the query that will run (through EF core). This is a hugely powerful way to work. If you need to add a new feature, you're just adding a new file with the logic you need encapsulated. If you're working in a team, this will help prevent merge conflicts. If a bug is found in a certain endpoint, you can find all of the logic, models, and validations, colocated. This also allows this encapsulation to be tested.

I'm really excited to start applying these patterns and libraries in my own projects, and I'm confident it will make for a more productive project. We can spend more time focusing on adding value, and less time trying to figure out what's going on. It should allow us to make changes confidently without worrying so much about affecting another portion of our app.