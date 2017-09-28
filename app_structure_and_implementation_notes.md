# Final Result

![chart](https://user-images.githubusercontent.com/7032914/30875572-4b7111c0-a2f4-11e7-9c94-36d043b91565.gif)

### Todo App - Notes

##### general
- enterprise-ready - you weren't kidding...
- live reload :-)
- .maps folder for sourcemapping? --> created by gulp, sourcemaps itself is created by babel
- no eslint? or just not within the boilerplate project?
- XML views -> never worked with them before, always js views, seems similar to android?
- what does the templates folder (CustomControl.hbs file) do? seems like some sort of template for new UI5 controls? how can it be filled / used?

##### developing & building
- build process via yarn build
- how can it be deployed? --> dist folder alone cannot be used (ui5 component libs are missing) maybe deploy both folders?

##### manifest.json
- uses i18n stuff (e.g. app title / description)
- **router**: "main app" is reachable via ```/``` route but also via ```/#/todo``` route

##### yarn.lock
- whats the reason for this file? 
- maybe add to .gitignore?
- nevermind, [documentation](https://yarnpkg.com/lang/en/docs/yarn-lock/) mentions it should be included in git for consistency reasons (see also [here](https://www.sitepoint.com/yarn-vs-npm/): *To avoid package version mis-matches, an exact installed version is pinned down in a lock file. Every time a module is added, Yarn creates (or updates) a yarn.lock file. This way you can guarantee another machine installs the exact same package, while still having a range of allowed versions defined in package.json.*)

##### index.html

- bootstrap --> data-sap-ui-preload **async** & ```sap.ui.componnent``` **async** property for speed?
- ```reseourceroots``` prop of bootstrap ```<script>``` defines where to find the ```app.todo``` referenced in the component below **?**

##### Component.js
- what is the device model good for?
- views are loaded via the router
    - router is in ```manifest.json```
    - only two actual views in router --> **Main** & **Notfound**, Detail is not used
- view/App.view.xml --> seems easy to work with

##### Main.view.xml
- seems to be easily extendable / easy to re-order or adapt things
- ```&amp;&amp;``` instead of ```&&``` for the visibile prop of the todo list items due to xml
 
##### stlye.less
- pretty clear structure, even though 2 space ident makes it hard to differentiate from time to time
- never worked with less before, but variables & mixins seem to allow much flexibility

##### ui5-lib-visualization
- same api as ```sap.viz```, but based on FOSS software (C3.js / D3) ?
- wanted to try out charting the todo history, but ```sap.viz``` is not included in openUI5
- can't get ```ui5-lib-visualization``` to work... including the files & importing seems to work after putting the files at ```ui5/1.50.1/ui5/viz``` and ```ui5/1.50.1/vendor```
- **but:** when trying to include some ```viz.Chart``` element (copied from the demo folder) in the XML view, I get an obscure XML parsing error message:
```
Uncaught (in promise) TypeError: h is not a constructor
    at C (XMLTemplateProcessor.js?eval:1)
    at h (XMLTemplateProcessor.js?eval:1)
    at w (XMLTemplateProcessor.js?eval:1)
    at m (XMLTemplateProcessor.js?eval:1)
    at i (XMLTemplateProcessor.js?eval:1)
    at m (XMLTemplateProcessor.js?eval:1)
    at i (XMLTemplateProcessor.js?eval:1)
    at C (XMLTemplateProcessor.js?eval:1)
    at h (XMLTemplateProcessor.js?eval:1)
    at w (XMLTemplateProcessor.js?eval:1)
```

##### c3.js
- after failing with ```ui5-lib-visualization``` I decided to integrate **c3.js** myself
- "rough" integration, i.e. not configurable via gulp, but rather hardcoded in ```index.hbs```
- css file of c3.js had to be inline as gulp would not transfer/copy the file from ```src``` to ```.tmp``` (maybe some issue around less / css ?)
- after adding the c3.js library that way, I used a native html element ```<html:div id="c3chart"></html:div>``` within the XML view to create an anchor point for c3.js
- within the controller, the chart gets initialized within the ```onAfterRendering``` function, as during ```onInit```, the needed anchor div element is not yet part of the DOM
- the charts ```bindto``` property had to be set to ```#__xmlview1--c3chart``` to take care of the XML View generating the div with the id ```c3chart```
