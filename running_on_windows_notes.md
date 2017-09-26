# Running on Windows (8.1, x64)

I tried running the starter-kit on windows and ran into some problems, which I (temporarily?) seem to have fixed with the following steps:

## yarn start problem #1
- yarn start "doesn't do anything"
- ```package.json```
- property ```scripts.start```
- content is:
    - ```node_modules/gulp/bin/gulp.js --silent```
- opens Text Editor (my default application for .js files on windows) instead of running the ```.js``` file
- fixed by changing ```scripts.start``` to: 
    - ```node node_modules/gulp/bin/gulp.js --silent``` (call **node** before the path)

## yarn start problem #2
- now, it seems to work until step **BUILD UI5** 
- error @ step 7/9 *compile themes*
- File(s) not found
- called from ```ui5-lib-util```
- seems to be the "1%" case mentioned in the comments ...
- debug notes:
	- comment out minify (```ui5-lib-util/index.js : 334```) to speed up debugging
	- ```console.log``` everything
	- ```compileUI5LessLib()``` fails
	- maybe encoding issue with sLessFileContent ? **no**
	- maybe issue with creating the empty file when the thing fails for the first time? **no**
	- issue is somewhere else (it really is the 1% case...)
	- isolated test case with https://github.com/SAP/less-openui5 and same folder structure reveals problem with ```rootPaths``` property of ```oOptions``` (```ui5-lib-util/index.js : 669```) --> commenting it out seems to fix that issue? not really sure, maybe that breaks something else
    - after running into the **next issue**, I supose this issue has something to do with windows / unix paths again (i.e. ```/``` vs ```\```)

## webpage load problem
- now, yarn start seems to work fine. terminal output:
```
	√ UI5 build successful: 1.50.1
	√ Development server started, use Ctrl+C to stop and go back to the console...

	  UI5 Version: 1.50.1 (custom build)

	  UI5 assets:
	  ◻  1 app
	  ◻  0 themes
	  ◻  0 libraries
```
- however, blank page in browser
- dev console reveals:
```
		GET http://localhost:3000/sap/ui/core/library-preload.js 404 (Not Found)
			send @ sap-ui-core.js:9204
			ajax @ sap-ui-core.js:8685
			requireModule @ sap-ui-core.js:18597
			sap.ui.requireSync @ sap-ui-core.js:19650
			(anonymous) @ sap-ui-core.js:20872
		
		sap-ui-core.js:18622 Uncaught Error: failed to load 'sap/ui/core/library-preload.js' from ./sap/ui/core/library-preload.js: 404 - Not Found
			    at requireModule (sap-ui-core.js:18622)
			    at Object.sap.ui.requireSync (sap-ui-core.js:19650)
			    at sap-ui-core.js:20872
			requireModule @ sap-ui-core.js:18622
			sap.ui.requireSync @ sap-ui-core.js:19650
			(anonymous) @ sap-ui-core.js:20872
		
		(index):22 Uncaught TypeError: sap.ui.getCore is not a function
			    at (index):22
			(anonymous) @ (index):22
```
- code is looking at the wrong location --> it looks for ```./sap/ui/core/library-preload.js``` in a location relative to the ```.tmp``` folder
- nothing there, so ```404```
- what it should do is look for ```./sap/ui/core/library-preload.js``` relative to ```../ui5/1.50.1/``` instead
- fixed by changing the html prop ```src``` of the ```<script id="sap-ui-bootstrap"```-tag from ```..\ui5\1.50.1\sap-ui-core.js``` to ```../ui5/1.50.1/sap-ui-core.js```
- windows backslashes (```\``` instead of ```/```) in html seem to be a problem...
- handlebars template puts ```{{secure src}}``` as ```src```

## finally

It works!

![works](https://user-images.githubusercontent.com/7032914/30835449-699718d0-a258-11e7-8782-1995d3273f88.PNG)
