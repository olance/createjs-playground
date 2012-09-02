PreloadJS Sample #1
===================

This sample uses a jQuery wrapper around PreloadJS to asynchronously load several things: 

  * A "manifest.json" file containing paths of photos to load
  * All the thumbnails images listed in the manifest
  * All the full-size photos listed in the manifest
            
Once the manifest is loaded, thumbnails are added to the DOM and begin loading in the background, along with the full-size
photos. Each thumbnail is faded from ```0.3``` to ```1.0``` while its corresponding full-size photo is loading.
            
This sample demonstrates:
            
  * Javascript OOP with namespacing
  * Using ```$.Deferred``` for asynchronous callbacks
  * Use of PreloadJS
            
The jQuery wrapper was not an absolute necessity for this sample, it allowed me to experiment with PreloadJS and explore
its code, while providing an object that can be chained nicely thanks to ```$.Deferred``` and ```deferred.promise()```.
