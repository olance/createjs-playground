#!/usr/bin/ruby

require 'rubygems'
require 'json'

# Loop through all full-size images and generate a 'manifest' consisting of a list of all images paths and their 
# corresponding thumbnails. For simplicity's sake, I know I only have JPEG in there.
class JPEGLister 
  attr_accessor :path_prefix
  attr_accessor :full_images_path
  attr_accessor :thumbnails_path
  attr_accessor :recursive
  
  def initialize(full_path, thumbs_path, prefix = '', recursive = false)
    @path_prefix = prefix
    @full_images_path = full_path
    @thumbnails_path = thumbs_path
    @recursive = recursive
  end

  # Return an array of hashes of the following form:
  # [
  #   { :name => "_MG_5823", :full => "images/full/_MG_5823.jpg", :thumbnail => "images/thumbs/_MG_5823.jpg" },
  #   { ... },
  #   ...
  # ]
  def list
    glob = @full_images_path
    glob = File.join(glob, '**') if @recursive
    glob = File.join(glob, '*.jpg')
    
    images = []
    thumbnails = []

    puts "Listing '#{glob}'"
    Dir.glob(glob).each do |image|
      image = File.join(image.split('/') - @full_images_path.split('/'))
      puts "Image: '#{image}'"
      # Look for the same image in the thumbnails, don't list if not present
      puts "Looking for '#{File.join(@thumbnails_path, image)}'..."
      if File.exist?(File.join(@thumbnails_path, image))
        puts "Found!"
        fileID = File.basename(image, '.jpg')
        
        images << { 
            :id => fileID,
            :src => File.join(@path_prefix, File.basename(@full_images_path), image),
        }
        
        thumbnails << {
            :id => fileID,
            :src => File.join(@path_prefix, File.basename(@thumbnails_path), image)
        }
      else
        puts "Not found. Next image!"        
      end

      puts ""
    end 
    
    { :images => images, :thumbnails => thumbnails }
  end
end

lister = JPEGLister.new('./full', './thumbs', 'images')
images = lister.list

File.open("manifest.json", "w") { |file| file.write images.to_json }
