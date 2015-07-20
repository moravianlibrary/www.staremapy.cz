# -*- coding: UTF-8 -*-

import cgi, cgitb
import httplib, urllib
import csv, json
import sys
import HTMLParser
import re
import urllib2

cgitb.enable()

############ IDs of tables ######################
tables = {
  'cbvk'   : ['1UPz6VPofoypmP4SQGwZP3tgw4L7BKX0BhfT411bO'],
  'cuni'   : ['12BDXMVTlFS8z0XpswVBP7UQlCYhCxA3qjuGhfeN3'],
  'muni'   : ['1dFWuJLL9-95EGCWvxthY5WL8k8gwh9fKPAKtqDQS'],
  'mzk'    : ['1Lc2tGphLppRBZLSAwfXcuZIy-mGOYCWa7jHbxzA-', '1GC8ppotDd4iJ9huGRjszmtWI0PhvWChl-n1Sx5EL'],
  'nkp'    : ['1330MqOo2pFPqDATSovphXTvqza5NOTALj1Iq6G0U'],
  'ntk'    : ['1LH4wnVUj9KS-jWg0h786pSIq8E_shU0OZkXnaE2v', '16lFPtAfDy6-IzSpZwDs0goyTlGmAgB-GnSXPkLGh'],
  'rajhrad': ['1-zKv2nchwSrEHqcdnCzOpp12mpVb3ot-1g0cHglV'],
  'ujep'   : ['1LpjT8VyYMGqLSIXNfpOVrEj2mt1BqYczwyRd-laD'],
  'vkol'   : ['1KFDIAY9wIQmCN6nxUbQj_oB6z2gyVdnpy51yHLJm'],
  'zcm'    : ['1vdvc6hZoO8u3Gg3U8_O_JgIaRvE56rUHr_C5RmfR'],
}
#################################################

class LabelData:
    label_data = None

    def _downloadData(self, institution):
        url = "http://195.113.155.123/cgi-bin/addlabeltomap.py?action=getall&institution={}&token=cab08dc4-e7c6-4ca1-b2ad-393ec198c31d".format(institution)
        response = json.load(urllib2.urlopen(url))

        self.label_data = {}
        if response.get("status", "") == "ok":
            data = response.get("data", [])
            for row in data:
                key = row["key"]
                value = row["value"]
                self.label_data[key] = value


    def getLabel(self, id, institution):
        if self.label_data is None:
            self._downloadData(institution)
        return self.label_data.get(id, "")

labelData = LabelData()

def getNLabel(value):
    return "N" if value[0] == "0" else "S"

def getELabel(value):
    return "E" if value[0] == "0" else "W"

def getValue(value):
    return value[1:]

def convertTo034Format(value):
  if not value:
    return None
  degrees = float(value)
  minutes = (degrees % 1) * 60
  seconds = (minutes % 1) * 60
  flag = "0" if degrees >= 0 else "1"
  return "%s%03d%02d%02d" % (flag, abs(degrees), minutes, seconds)

def convertTo255Format(value):
  if not value:
    return None
  degrees = float(value)
  minutes = (degrees % 1) * 60
  seconds = (minutes % 1) * 60
  flag = "0" if degrees >= 0 else "1"
  return "%s%03d°%02d´%02d\"" % (flag, abs(degrees), minutes, seconds)

def convertToArchivesFormat(value):
  if not value:
    return None
  degrees = float(value)
  minutes = (degrees % 1) * 60
  seconds = (minutes % 1) * 60
  flag = "0" if degrees >= 0 else "1"
  return "%s%03d°%02d´%02d´´" % (flag, abs(degrees), minutes, seconds)

def appendGeoData(header, data):
    institution_index = header.index("institution")
    data[institution_index] = re.sub(r"\d+$", "", data[institution_index])
    south_west = data[header.index("south_west")]
    north_east = data[header.index("north_east")]
    if south_west and north_east:
        south034,west034 = map(convertTo034Format, south_west.split(","))
        north034,east034 = map(convertTo034Format, north_east.split(","))
        south255,west255 = map(convertTo255Format, south_west.split(","))
        north255,east255 = map(convertTo255Format, north_east.split(","))
        southArchives,westArchives = map(convertToArchivesFormat, south_west.split(","))
        northArchives,eastArchives = map(convertToArchivesFormat, north_east.split(","))
        data.append("$$d%s%s$$e%s%s$$f%s%s$$g%s%s" % (getELabel(west034), getValue(west034), getELabel(east034), getValue(east034), getNLabel(north034), getValue(north034), getNLabel(south034), getValue(south034)))
        data.append("$$c(%s %s--%s %s/%s %s--%s %s)" % (getELabel(west255), getValue(west255), getELabel(east255), getValue(east255), getNLabel(north255), getValue(north255), getNLabel(south255), getValue(south255)))
        data.append("GPS: %s%s--%s%s/%s%s--%s%s" % (getValue(northArchives), getNLabel(northArchives), getValue(southArchives), getNLabel(southArchives), getValue(westArchives), getELabel(westArchives), getValue(eastArchives), getELabel(eastArchives)))
    else:
        data.append("")
        data.append("")
        data.append("")

def appendLabelData(header, data):
    institution_index = header.index("institution")
    id_index = header.index("georeferencer_id");
    institution = data[institution_index]
    id = data[id_index]
    data.append(labelData.getLabel(id, institution))



def transformHeader(header):
    header[header.index("collection")] = "institution"
    header.append("marc034")
    header.append("marc255")
    header.append("archives")
    header.append("label")

def transformData(header, data):
    appendGeoData(header, data)
    appendLabelData(header, data)



def generateCSV(table, institution = None, printHeader = False):
  query = "SELECT * FROM {0}".format(table)
  params = urllib.urlencode({'query' : query})
  conn = httplib.HTTPSConnection("www.google.com", timeout=300)
  conn.request("GET", "/fusiontables/exporttable?{0}".format(params))
  response = conn.getresponse()
  if response.status == 200:
    if printHeader:
      print "Content-Type: application/csv; charset=utf-8"
      print "Content-Disposition:attachment;filename=%s.csv" % institution
#      print "Content-Type: text/html; charset=utf-8"
      print
    htmlParser = HTMLParser.HTMLParser()
    csvreader = csv.reader([htmlParser.unescape(row.decode("utf-8")).encode("utf-8") for row in response.read().split('\n')])
    csvwriter = csv.writer(sys.stdout)
    header = None
    for row in csvreader:
      if header is None:
        header = list(row)
        transformHeader(header)
        if printHeader:
          csvwriter.writerow(header)
      else:
        if row:
          transformData(header, row)
          csvwriter.writerow(row)
  else:
    print "Content-Type: text/html"
    print
    print "Error"
    print response.status
    print response.reason


def printError(error):
  print "Content-Type: text/html"
  print
  print '<!DOCTYPE html>'
  print '<html>'
  print '<head><meta charset="UTF-8"/><title>Metadata pro mapy</title></head>'
  print '<body>'
  print '<h1>Chyba</h1>'
  print '<p>%s</p>' % error
  print '</body>'
  print '</html>'

arguments = cgi.FieldStorage()
if "institution" in arguments:
  institution = arguments["institution"].value
  if institution in tables:
    first = True
    for table in tables[institution]:
      if first:
        generateCSV(table, institution, True)
        first = False
      else:
        generateCSV(table)
  else:
    printError('Neznámá instituce.')
else:
  printError('Nesprávný odkaz.')
