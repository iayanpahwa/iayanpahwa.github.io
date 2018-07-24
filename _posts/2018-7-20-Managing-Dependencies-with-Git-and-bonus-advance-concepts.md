---
title: "Managing Dependencies with Git and bonus advance concepts"
share: true
author_profile: true
header:
  image: /assets/images/git/git.png
comments: true  
---

So I am supposed to deliver a talk at [LinuxChixIndia](http://india.linuxchix.org) meet-up coming sunday on how to maintain open source projects which depends on other open source projects so I thought of writing this blog to help attendees use it as reference later on. 


<iframe width="560" height="315" src="https://www.youtube.com/embed/a_Ua0I9KVwY" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>


Basically if your project has dependencies on other projects you need to keep them updated and in sync with your tree so nothing breaks with a change or your project is not outdated or have any known CVE / bugs in your codebase. 

Let us assume your project name “HelloWorld” depends on an open source library say “Print” for the scenarios below.

A naive way I’ve seen people doing is pushing the dependencies code along with their source code. They will clone the “print” library code and push it along with their “Hello World” code tree to GitHub or any version control server. 

![Git Dependencies](https://iayanpahwa.github.io/assets/images/git/dependencies.png "Git Dependencies")

Though it is ok to do so and your project won’t misbehave with changes to the dependent library code but one biggest drawback of this approach is that if in future you need update to a new version of library either to manually patch a bug found in library or to have new features introduced in library by it’s maintainer it will become pain in the a** as their is no tracking to upstream project so you need to manually patch it yourself or re-fetch and push the code once again. So what is better way of doing it, one may ask. 

Well their are a number of ways of maintaining a project which in-turn depends on other projects and we will discuss a few below. From here I’ll assume that you are using “GIT” for version controlling and “GITHUB” for hosting projects, though it will work for any git based server.

A side note before we start - You can always fetch source code of your dependencies directly from upstream repos hosted by the developer of the project, however it is always recommended to *fork* the project to your account and use that as remote instead of upstream one. This allows following things:

* Customise: your dependencies the way you want, which may not be a requirement upstream, for ex A library has 100 functions but you only needs to use 10, you can remove 90 other and save code space, compile time etc. Or change function and optimise it for your use, this is easy done when you’re working on your local forks.

* Sync: A change in upstream library can result in misbehaving of your code which you might not expect , for ex: say developer changed the function name in library and it was fetched during building your project can result in compilation errors. With fork you can ensure everything is in sync.

* Change location: Project maintainer might move the library code from say Github to Gitlab and you get fetch errors because of change of repo link, in this case fetching from fork ensures no fetch failures. etc.

Now let’s talk about managing dependencies in two different ways :

### GIT SUBMODULES

Git allows you to add other git repos as submodules, this means your project will follow a modular approach and you can update the submodules independent of your main project. You can add as many submodules in your project as you want and assign rules such as where to fetch it from and where to store the code once it is fetched. 

Let us see this in action. 

So I’ve created a project namely “submodule-demo” on my GitHub which has two directories:

src - where my main source code is stored
lib - where all the libraries a.k.a dependencies are stored which my source code is using, these libraries are hosted on GitHub by their maintainers as independent projects.

![Git submodules](https://iayanpahwa.github.io/assets/images/git/1.png "Git submodules")


3. Now for the sake of this demo assume my project depends on two libraries: 
    1> FastLED  - A library to drive LEDs
    2> PubSubClient  - A library to implement MQTT client 

4. We will add them as submodules within our project, P.S I’ve already forked these projects.

5. To add submodules open the terminal, cd to your main project directory/<Directory where you want these dependencies to be stored after fetching>. In this case I want them in my lib directory so I’ll execute following commands:

```

cd ~/projects/submodule-demo/lib

```

## Add submodule with following commands 
### git submodule add <Link to dependency project>

```

git submodule add https://github.com/iayanpahwa/FastLED.git
git submodule add https://github.com/iayanpahwa/pubsubclient.git 

```


This will fetch the source code of these libraries and save them in your lib folder.

You can now find a hidden file in root of your main project directory with name .gitmodules having following meta-data:

```

 [submodule "lib/FastLED"]
     path = lib/FastLED
     url = https://github.com/iayanpahwa/FastLED.git
 [submodule "lib/pubsubclient"]
     path = lib/pubsubclient
     url = https://github.com/iayanpahwa/pubsubclient.git

```


### This tells git about :

—> submodules use in this project 
—> where to fetch them from
—> where to store them 

Now every time someone clones the project they can separately clone the submodule using following commands:

```

git clone < Your project URL >
cd <Your project URL>
git submodule init 
git submodule update 

```

This can also be done in one command as :

```

git clone <Your Project URL> —recursive 

```

example:

```

git clone https://github.com/iayanpahwa/submodule-demo.git —recursive 

```

One more thing you’ll notice on GitHub project repo is under lib FastLED @ c1ab8fa 

@<HASH> denotes the last commit hash from where FastLED library has been fetched.

![Commit Hash](https://iayanpahwa.github.io/assets/images/git/2.png "Commit Hash")

This is a very powerful feature, by default submodule will be fetched from latest commit available upstream i.e HEAD of master branch but you can fetch from different branch as well. More details and options can be found here —> https://git-scm.com/docs/git-submodule

Now you can track and update dependencies project independent of your main source tree. One thing to note is all your dependencies need not to be on same hosting site. For Ex: If FastLED was hosted on Github and PubSubClient of Gitlab, submodule will work the same. 


Now let's talk about the second method:

### 2. Google REPO tool

Similarly to submodule google has developed it’s own in-house dependency track tool called ‘repo’ which is more suitable for project having lots of dependencies 100+ . It is used to maintain Android Open source project, Android custom community  ROMs and a lot of different big open source project as well. For repo to work you need to have an extra git repository containing your manifest file in .xml format where you mention remotes i.e where to fetch project from, path i.e where to store the project after fetching, revision i.e HEAD commit of project you wan’t to fetch from and lot of other options. 

Unlike git submodules which is in-built git functionality REPO comes as an executable script so we need to install it 

Linux: 

```

mkdir ~/bin
PATH=~/bin:$PATH

Fetch repo  
curl https://storage.googleapis.com/git-repo-downloads/repo > ~/bin/repo

```

Make it executable

```

chmod a+x ~/bin/repo

```

OSX: 

Use home-brew to download repo tool

```

ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)" < /dev/null 2> /dev/null

```
Then install repo:

```

brew install repo

```


Now, repo tools needs a git hosted manifest xml file to read meta data of your dependencies. So will create a GitHub repo to hold the file. By default repo tools looks for default.xml files in your master branch but repo command line options allows you to use different manifest located at some different branch with some different name. 

This is very powerful feature of repo, say for ex: Android version Kitkat depends on 100 libraries then you can use Kitkat.xml for fetching their source instead of Oreo.xml which may has 900 new and unique libraries. You can also has say testing.xml or QA.xml which will have additional testing and Quality assurance dependencies to build testing tools along with your main project, powerful right :)

But to keep the demo simpler will create a default.xml file and push it to master branch and use same FastLED and PubSubClient as our dependencies we need to fetch 

Clone the repo manifest-demo and create a file default.xml with following data

```

 <?xml version="1.0" encoding="UTF-8"?>
 <manifest>

 <remote fetch="https://github.com/iayanpahwa/" name="EazyExit" />

     <project name="FastLED.git" path="lib/FastLED" remote="EazyExit" revision="c1ab8fa86f6d6ecbf40ab7f28b36116a3c931916" />
     <project name="pubsubclient.git" path="lib/PubSubClient" remote="EazyExit" revision="dddfffbe0c497073d960f3b9f83c8400dc8cad6d" />

 </manifest>

 ```


![Manifest](https://iayanpahwa.github.io/assets/images/git/3.png "Manifest")

This is an .xml file , note we mentioned remote as my GitHub profile and named it as EazyExit(say) which is our project name. And mentioned different repos we need to fetch along with their commit  ID’s as revision. Manifest allows lot many options such as project branch, different remotes - bitbucket, gitlab etc and reference can be found here: —-> [Reference](https://gerrit.googlesource.com/git-repo/+/master/docs/manifest-format.txt)

Next will push the default.xml file to our GitHub and use this to create the project with fetched dependencies. 


Create a project directory such as “EazyExit” in this case or any other name

cd to project directory and execute:

```

repo init -u <Repo URL where manifest .xml file is present> 

repo init -u https://github.com/iayanpahwa/manifest-demo.git .

```

This command will initialise PWD as our project directory 

Next run :
```
repo sync
```
This will fetch all dependencies sources and store the code as mentioned in manifest. 


These are the two easy ways to manage independent project dependencies using git-submodules and google’s repo tool.

### Difference between submodules and repo:

I found repo more appropriate for big projects, since there are lot of options to customise the project such as adding seperate manifests for developers and QA. On other hand repo requires you to maintain an extra manifest git repo. Submodules are easy and built-in unlike repo which needs to be downloaded(Adding one more dependency :P ) but difficult to maintain for project having enormous dependencies.

This blogs talks about pros and cons of each very well: [BLOG](https://www.edureka.co/blog/git-submodules-versus-googles-repo-tool)


## Bonus Git features:

### Git remotes :

Generally your GitHub repo has one remote by default that is the main repository where it has been fetched from you can pull and push to it. Big projects has multiple developers working simultaneously on same source tree each having their own forks where the push code . Suppose developer A has made some changes on it’s fork and you want to check it before developer A opens the pull request(or even after that, you want to test before merging). In that case you can add developer A’s fork as your another remote and fetch his/her code changes.


Consider remotes as multiple copies of a git tracked project with some changes kept by different developers which you can see, and fetch.


I’ll use an open source project named *Lottie by Airbnb* for this demo which is an amazing utility to Render Adobe AfterEffects animations on mobile platforms. 


First we will clone my fork of the project 

```

> git clone https://github.com/iayanpahwa/lottie-android.git

> cd Lottie-android

```

I’ve already done that , To view your current remotes :

```
git remote -v 

➜  lottie-android git:(master) git remote -v
origin  https://github.com/iayanpahwa/lottie-android.git (fetch)
origin  https://github.com/iayanpahwa/lottie-android.git (push)
upstream    https://github.com/airbnb/lottie-android.git (fetch)
upstream    https://github.com/airbnb/lottie-android.git (push)
➜  lottie-android git:(master)

```

You can see I’ve my own fork and upstream project.

Now say I want to check code of another contributor sorotokin and leleliu008, I need to add them as my remote which I can do by executing:

git remote add <Any_Name> <USER_REPO_URL>

Example :

```

➜  lottie-android git:(master) git remote add sorotokin https://github.com/sorotokin/lottie-android.git


➜  lottie-android git:(master) git remote add leleliu008 https://github.com/leleliu008/lottie-android.git


➜  lottie-android git:(master) git remote -v
leleliu008  https://github.com/leleliu008/lottie-android.git (fetch)
leleliu008  https://github.com/leleliu008/lottie-android.git (push)
origin  https://github.com/iayanpahwa/lottie-android.git (fetch)
origin  https://github.com/iayanpahwa/lottie-android.git (push)
sorotokin   https://github.com/sorotokin/lottie-android.git (fetch)
sorotokin   https://github.com/sorotokin/lottie-android.git (push)
upstream    https://github.com/airbnb/lottie-android.git (fetch)
upstream    https://github.com/airbnb/lottie-android.git (push)
➜  lottie-android git:(master)
```

To fetch the code by sorotokin I can execute
```
git fetch sorotokin
```
Or I can simply do git fetch —all
```

➜  lottie-android git:(master) git fetch --all
Fetching origin
Fetching upstream
From https://github.com/airbnb/lottie-android
 * [new branch]      gpeal--animatable-value-parser -> upstream/gpeal--animatable-value-parser
 * [new branch]      gpeal--min-max                 -> upstream/gpeal--min-max
 * [new branch]      gpeal--test-pr                 -> upstream/gpeal--test-pr
 * [new branch]      master                         -> upstream/master
Fetching sorotokin
remote: Counting objects: 51, done.
remote: Total 51 (delta 25), reused 25 (delta 25), pack-reused 26
Unpacking objects: 100% (51/51), done.
From https://github.com/sorotokin/lottie-android
 * [new branch]      gpeal--animatable-value-parser -> sorotokin/gpeal--animatable-value-parser
 * [new branch]      gpeal--min-max                 -> sorotokin/gpeal--min-max
 * [new branch]      gpeal--test-pr                 -> sorotokin/gpeal--test-pr
 * [new branch]      master                         -> sorotokin/master
Fetching leleliu008
remote: Counting objects: 95, done.
remote: Total 95 (delta 55), reused 55 (delta 55), pack-reused 40
Unpacking objects: 100% (95/95), done.
From https://github.com/leleliu008/lottie-android
 * [new branch]      gpeal--animatable-value-parser -> leleliu008/gpeal--animatable-value-parser
 * [new branch]      gpeal--min-max                 -> leleliu008/gpeal--min-max
 * [new branch]      gpeal--test-pr                 -> leleliu008/gpeal--test-pr
 * [new branch]      master                         -> leleliu008/master
```

This will bring commits by these two developers to my local machine which I can checkout to their branches and maybe test their changes before reviewing their Pull requests 


### Git- cherry-picking:

Git cherry-picking Is a way of manually applying changes caused by a specific commit on top of your current code. 

I’ll explain git cherry-picking using a real life example so it is more clear where you want to use it.

Lets say you’re maintaining an open source project which receives great number of contributions from the community. 

Now say you received Pull Requests from 2-3 different developers and you want to test them all together. Why together?

* To save time and efforts
* Maybe one PR depends on other and so on.

You first need to add those developers as your remotes, same way as mentioned above .

Then fetch their code using git fetch command. Once all their commits are available we can cheery-pick them and the best way to do so is first create a new branch:

```
git checkout -b my new branch
```

And pick their commits one by one:

```
git cherry-pick < commit _ hash>
git cherry-pick commid_id_1
git cherry-pick commid_id_2
git cherry-pick commid_id_3
```

Using last repo example I see  commit ID *648c61f5275998c461347b5045dc900405306b31* by contributor *sorotokin* which I think can impact my current code so I need to see , I can do following:

> First I’ll create a new branch from my existing codebase
```
git checkout -b test_commit 
```

Verify I am on new branch:
```
git branch 
```

Now cherry pick commit 648c61f5275998c461347b5045dc900405306b31  by sorotokin :
```
git cherry-pick 648c61f5275998c461347b5045dc900405306b31
```

This will bring changes done by serotonin on this commit to top of my current code so I can test and do whatever I want with it :)

Once you’ve all the commits you want to test together you can move ahead building the project and testing it :)


#### Hope you liked this blog post, If you do please comment down below, give me a follow on Github and if you have any questions feel free to reach out to me. Toodles!….


