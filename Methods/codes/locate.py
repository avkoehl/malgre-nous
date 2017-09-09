############################################################################################
# locate.py
#
# A simple script for geocoding cities using ArcGis API.
#
############################################################################################
#
############################################################################################
# 1. Import libraries: 
#	sys for reading command line arguments
#	geocoder for Google geocoder
############################################################################################
#
import geocoder
import sys
#
############################################################################################
# filein: Name of the input file that contains list of places to geocode
#         one place per line, with format "City, Country"
#         example: 
#             Strasbourg, France
# fileout: Name of the output file contains results of geocoding
############################################################################################
#
filein=sys.argv[1];
fileout=sys.argv[2];
#
############################################################################################
# Read all lines from filein
############################################################################################
#
lines = [line.rstrip('\n') for line in open(filein)]
#
############################################################################################
# Process each line and print results in output file
############################################################################################
#
out = open(fileout, 'w');
for place in lines:
	g=geocoder.arcgis(place);
	info=g.latlng
	print place,info
	print >>out, place,info
#
