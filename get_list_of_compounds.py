# clean function to remove tags from string
import re
cleanr =re.compile('<.*?>')
def cleanhtml(raw_html):
    cleantext = re.sub(cleanr,'', str(raw_html))
    return cleantext


# get an html page with list of compounds
import urllib2
response = urllib2.urlopen('http://www.periodni.com/solcalc-chemical_compounds.html')
print response.getcode()

raw_html = response.read()

# extract the compound names from the table
from bs4 import BeautifulSoup
soup = BeautifulSoup(raw_html)

list_of_compounds = []

for row in soup.findAll('table')[0].findAll('tr'):
    if row.findAll('td'):
        column_data = row.findAll('td')[1].contents
        # print cleanhtml(column_data[0])
        list_of_compounds.append(cleanhtml(column_data[0]))

# initialize and set up interface with chemspider

from chemspipy import ChemSpider

cs = ChemSpider('37ca69e0-ee1a-4e38-80eb-56853571e7bc')

# loop through the list of compounds and find their csid numbers

dict_compounds = {}

for compound in list_of_compounds:
    print compound
    for result in cs.search(compound):
        dict_compounds[compound] = [result.csid , result.molecular_formula]

# write a latex file for each compound

start = """
\documentclass[border=20pt]{standalone}
\usepackage[version=4]{mhchem}
\\begin{document}
    \ce{"""

finish = """}
\end{document}
"""

for compound in dict_compounds.keys():
    # create the new filename
    filename = compound.replace(" ", "_") + ".tex"
    # open the file for writing
    f = open(filename, 'w')
    f.write(start + dict_compounds[compound][1] + finish)
    # close the file
    f.close()

# use latexmk to compile into pdfs

import os

result = os.system('latexmk -pdf -interaction=nonstopmode')

# generate png from pdf

result = os.system('python conv_pdf_to_png.py 300 *.pdf')



