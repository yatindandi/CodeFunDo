import os
import json


a = set()
for i in range(1,13):
	name = 'places'+str(i)+'.json'
	if os.path.exists(name):
			data = json.load(open(name))
			for news in data["features"]:
				 a.add(news["countries"][0])
				 a.add(news["countries"][1])

countries = list(a)
countries = sorted(countries)

open('countrylist.json','a').write(json.dumps(countries))



