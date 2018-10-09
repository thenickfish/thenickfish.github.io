---
layout: post
title:  "Travis CI Continuous Delivery to Azure Blob Storage"
date:   2018-10-08 18:05:00 -0600
categories: code tutorial cloud devops
tags:
- web
- azure
- blob
- cloud
- tutorial
- github
- devops
---
In my [last post](/azure-blob-website/) I went over why I thought blob storage was a really cool option for hosting your static webpage. If you haven't read it, check that one out before continuing. This post will be outlining a way you can do continuous delivery to your Azure storage account using Travis CI and GitHub. I'll show you how you can get an impressive amount of automation, and a highly scalable website for a very, very low cost. The below commands are written in Powershell, and some may need tweaking for bash.

### Here's the plan:
We're going to use the [Angular CLI](https://cli.angular.io/) to make a simple Angular website, check our code into a [GitHub](https://github.com) repository, and use [Travis CI](https://travis-ci.org/) to continuously build and deploy our app to Azure Blob storage for every commit to our master branch. We'll keep it simple here, but the sky is the limit!

### Prerequisites (follow the links if you need help)
1. An [Azure account](https://azure.microsoft.com/en-us/free/). (You can get a free trial if you don't already have one).
2. [Azure command line interface (CLI)](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli?view=azure-cli-latest) We need this to make a few things easier. Make sure you login to your account with "az login"
3. A text editor. It doesn't matter which one, but I personally like [Visual Studio Code](https://code.visualstudio.com/).
4. A [GitHub](https://github.com) account and [git](https://git-scm.com/). If you don't have these already, you're missing out!
5. [Travis CI](https://travis-ci.org/) account linked to your GitHub account. This is easy, just follow the instructions on the Travis site.
6. [Angular CLI](https://cli.angular.io/) so we can make a quick Angular app to deploy

### Ready? Let's go!
1. First things first. We're going to hop into the command line, and make an Angular app. change to a directory where you keep your projects and run the following command:
```bash
# use angular CLI to make a new app with a routing module
ng new azure-blob --routing
```
2. Serve the website locally to see what it looks like. You can close the server with Ctrl+C in the command line when you're done
```bash
# change to your app's directory
cd ./azure-blob
# compile and serve the app locally, this should open in a browser
ng serve --open
```
3. Create a new GitHub repository, and push the project.
    1. login to GitHub, and click the "+" icon in the top right corner, select "New repository."
    2. Call it "azure-blob" and leave the other settings default. It should be a public repo, with no README or .gitignore.
    3. Click "Create Repository"
    4. leave the browser open to the next page. You need to run the instructions to "push an existing repository from the command line" in the next step.
4. Push your Angular application to GitHub.
```bash
git remote add origin https://github.com/{YOUR_USERNAME}/azure-blob.git
git push -u origin master
```
5. Link Travis CI
    1. Log into the travis CI website, go to your profile, and click the "Sync Account" button. After a few seconds, your sync should complete, and you can refresh the page for an updated list.
    2. Find the "azure-blob" repo, and enable it, then click the "Settings" button.
    3. There are a lot of options you can setup in Travis on this screen, we'll leave most of them default. But keep the settings page open for the next few steps.
6. Create an Azure Storage account (you can do this via the portal like I outlined in the [last post](/azure-blob-website/), or use the command line like I do here)
```bash
# add the extension (since it's in preview)
az extension add --name storage-preview
# create a resource group
az group create --name azure-blob-demo --location westus
# create a storage account. Must be "StorageV2"
# you will need to create a unique name here.
# everywhere I reference "thenickfishazureblobdemo" substitute your own
az storage account create --name thenickfishazureblobdemo --resource-group azure-blob-demo --location westus --sku Standard_LRS --encryption blob --kind StorageV2
# enable static website hosting, and set the index document
az storage blob service-properties update --account-name thenickfishazureblobdemo --static-website --index-document index.html
```
7. Create a scoped account for Travis CI to use. This is technically optional, but a very good idea. Just in case Travis (or any other system for that matter) ever gets compromised, you want the account being used to have minimal rights.
```bash
# get your subscription id
$env:subscriptionId=(az account show --query id -o tsv)
# create rbac scoped to just our new resource group
az ad sp create-for-rbac --name travis-azure-blob --scope "/subscriptions/$env:subscriptionId/resourceGroups/azure-blob-demo"
# keep track of this output - we're going to need it in the next step
```
8. Go back to the Travis settings page from step 5 to add some environment variables. Make sure you leave the display in build log option disabled. We DO NOT want these secrets to show in our build!
    1. AZ_LOGIN_NAME - this will come from the 'name' property of the output - if you followed my lead the value will be http://travis-azure-blob
    2. AZ_PASSWORD - a guid generated from the create-for-rbac command, the 'password' property
    3. AZ_TENANT - another guid, from the create-for-rbac command's 'tenant' property
    4. AZURE_STORAGE_ACCOUNT - the name of your storage account, you'll need to put your unique name here. Mine was "thenickfishazureblobdemo"
   
    Your settings should now look like this:
    ![Travis CI Environment Variable Screenshot](/assets/img/AzureBlobTravisCi/TravisEnvironmentVariables.png "Travis CI Environment Variable Screenshot")
9. Add a travis configuration file to the root of your repository with your web application. Make a file called .travis.yml in the base directory of the repo. The file should look like this:
<script src="https://gist.github.com/thenickfish/566ec98d7523a526a69b4efb90fa1c13.js"></script>
10. Use git to commit and push your build configuration
```bash
git add .
git commit -m "Add Travis build configuration"
git push origin
```
11. If you check the builds in your Travis CI dashboard, the commit you just pushed to origin should have kicked off a build! Watch the output. With any luck, it should succeed, and you'll see that it exits at the end with a success code. You should see in the logs that it uploads your website to storage at the very end of the build.
12. Go see your website deployed in the cloud! You can get the URL here:
```bash
az storage account show -n thenickfishazureblobdemo -g azure-blob-demo --query "primaryEndpoints.web" --output tsv
```


### Wrap up
At this point you have the basic build wired up. Make some changes to the website and push them to git, you'll see them updated shortly after without any more work from you! Now you can easily get your changes deployed to the cloud. Experiment with running your tests (ng test) before deploying so that you won't push bad code to Azure when the tests fail. Did I miss anything? Have questions? Let me know in the comments, or feel free to contact me.