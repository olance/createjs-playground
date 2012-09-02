PreloadJS Sample #1
===================

This sample uses a jQuery wrapper around PreloadJS to asynchronously load several things: 

  * A "manifest.json" file containing paths of photos to load
  * All the thumbnails images listed in the manifest
  * All the full-size photos listed in the manifest
            
Once the manifest is loaded, thumbnails are added to the DOM and begin loading in the background, along with the full-size
photos. Each thumbnail is faded from ```0.3``` to ```1.0``` while its corresponding full-size photo is loading.
            
Also, if you click on a thumbnail when its full-size photo isn't loaded yet, a progress bar is displayed on the full view.  
However as the sample photos are quite small, you might not be able to see this (definitely not on a local network!). I've
noted that Firefox tend to be really slow to download the files, so you can try and see it online with it or use your own,
larger images.
            
This sample demonstrates:
            
  * Javascript OOP with namespacing
  * Using ```$.Deferred``` for asynchronous callbacks
  * Use of PreloadJS
            
The jQuery wrapper was not an absolute necessity for this sample, it allowed me to experiment with PreloadJS and explore
its code, while providing an object that can be chained nicely thanks to ```$.Deferred``` and ```deferred.promise()```.
