# assuming we have a bunch of png files
# with chemical formulas as filenames,
# we're going to add them to a MongoDB collection

# get a list of all the png images in the current directory

import os
png_images=os.listdir('.')
for fichier in png_images[:]: # png_images[:] makes a copy of png_images.
    if not(fichier.endswith(".png")):
        png_images.remove(fichier)

import base64

encoded_images_dict = {}

for image in png_images:
    encoded = base64.b64encode(open(image, "rb").read())
    encoded_images_dict[os.path.splitext(image)[0]] = encoded

print str(len(encoded_images_dict.keys())) + " encoded images are ready..."

print encoded_images_dict.keys()


# define the Mongo document structure

from mongothon import Schema, create_model
from pymongo import MongoClient

connection = MongoClient('localhost', 27017)
db = connection.test # use the test db
compounds = db['compounds'] # name the collection in the test db

compound_schema = Schema({
    "name": {"type": basestring, "required": True},
    "formula_img": {"type": basestring, "required": True},
    "notes": {"type": basestring},
    "correct_count": {"type": basestring},
    "incorrect_count": {"type": basestring}
    })

Compound = create_model( compound_schema, compounds )

for new_compound in encoded_images_dict.keys():
    # check to see if the named compound is already present
    compound_search = Compound.find_one({'name': new_compound})
    if compound_search:
        print new_compound + " already exists in db"
        pass
    else:
        compound = Compound({
            "name": new_compound,
            "formula_img": encoded_images_dict[new_compound]
            })
        compound.save()
