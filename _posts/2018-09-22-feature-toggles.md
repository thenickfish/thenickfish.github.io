---
layout: post
title:  "Feature Toggles. What's the Point?"
date:   2018-09-22 11:53:57 -0600
categories: devops csharp
---
As I've been researching devops, and improving development workflows in general, I've heard about feature toggles over and over. So what are they, and what's the point?

My first thought was that it just sounds like extra overhead when you're just trying to get something done. But as I've started to work with them more and more, I've realized the amazing flexibility they can provide.

If you've ever worked in a project with multiple developers in a single codebase, you've probably experienced the pain of merging your work. We've all been there. You make a git branch to work on a new feature, and even if you've only been working on it for a day or two, another developer edits the same file... and boom, you get a merge conflict. This gets even worse the longer your branch is alive.

**So, what makes them so great?**
When I start working on a new feature, the first thing I do is create a toggle for it. The beauty of this is that I can merge work much sooner than the feature being complete. You can work on something safely in isolation, keep it integrated into [trunk](https://en.wikipedia.org/wiki/Trunk_(software)), and only enable it when you're ready. Even a feature that takes multiple weeks to complete can be merged in much smaller, easier to handle pieces, and this makes everything easier. If you get a conflict at all, it's much smaller and easier to deal with, and code reviews are only needed for smaller changesets.

**What about when you want the feature to be permanent?**
How are you supposed to remove the toggle? This is where my recommendation would be that your implementation/ feature toggle library should use a concrete class, or something strongly typed. When you want to make a toggle permanent, we just find all the references to that class, remove the toggle code, then delete the class for that toggle. It's clean, and easy.

Here's a *very* simple example of what I mean. In real life, depending on the problem you're working on, I would use dependency injection to inject different implementations instead of just sticking an if statement into the code like this.
{% highlight csharp %}
using System;

public interface IFeatureToggle 
{
  bool ToggleEnabled();
}

public class MyNewFeatureToggle : IFeatureToggle
{
  public bool ToggleEnabled()
  {
    // this logic can work however you'd like. You can check a config file, sql server, etc.
    return true;
  }
}

public class Program
{
  public static void Main(string[] args)
  {
    var newFeature = new MyNewFeatureToggle();
    if (newFeature.ToggleEnabled())
      DoTheNewThing();
    else
      DoTheOldThing();
  }

  private static void DoTheOldThing()
  {
    Console.WriteLine("doing the old thing");
  }

  private static void DoTheNewThing()
  {
    Console.WriteLine("doing the new thing");
  }
}
{% endhighlight %}

# My Recommendations:
* Don't *just* use configuration files with magic strings, use concrete types for easier toggle removal in the future.
* Don't make assumptions about toggle status, if your code expects a configuration value for a toggle that isn't present, I like to throw an exception to fail early.
* Remove toggles when you know the feature is okay, this is tech debt, but once you get in the habit of doing this, the refactor isn't too painful.
* If your application consists of many services as most do, I found it nice to have a toggle that works across all of them. For example, I've worked on an application that consists of a .NET core api, a .NET full framework application, and an Angular 6 front end. If you can, write your toggle implementation in a way that can update all of them with a single configuration change. This way if you need to make front and backend changes, they can be flipped on and off at the same time.
* Do what works for you. If you don't need something complicated, even a simple implementation can be a huge help. You can enhance it in the future if you want to start using these for things like A/B testing, etc.