import nltk
from nltk.sentiment.vader import SentimentIntensityAnalyzer
from nltk import tokenize
import json
import csv
import os
import random
import requests

big=['Australia','United States', 'China', 'Russia', 'Brazil', 'Argentina','Canada','India']
medium=['Pakistan','Afghanistan','Saudi Arabia', 'Iran', 'Myanmar','Egypt','South Africa', 'Columbia', 'Mexico']
def deviation(country):
	if country in big:
		return 5.0
	elif country in medium:
		return 3.0
	else :
		return 0.5
def sentiment(sentence):
		sid = SentimentIntensityAnalyzer()
		ss = sid.polarity_scores(sentence)
		if float(ss['neg']) > float(ss['pos']) :
				return -1*float(ss['neg'])
		elif float(ss['neg']) < float(ss['pos']):
			return float(ss['pos'])
		else:
			return 0
def locate(address):			
	api_key = "AIzaSyBLwF3yjw31_Lyiec7y8Q_fw6DJaiJdvm4"
	api_response = requests.get('https://maps.googleapis.com/maps/api/geocode/json?address={0}&key={1}'.format(address, api_key))
	api_response_dict = api_response.json()

	if api_response_dict['status'] == 'OK':
	    latitude = api_response_dict['results'][0]['geometry']['location']['lat']
	    longitude = api_response_dict['results'][0]['geometry']['location']['lng']
	    country= api_response_dict['results'][0]['address_components'][-1]['long_name']
	    location={'Latitude': latitude,'Longitude':longitude,'Country':country}
	    return(location)

relation = dict()
breakingnews = list()
dict ={}
with open('countries.csv') as csvfile:
    reader = csv.DictReader(csvfile)
    for row in reader:
    	dict[row['nationality']] = row['en_short_name']       
file='data.json'
open(file, 'a').write('{"type": "FeatureCollection","features": [')
for i in range(1,32):
	name=str(i)+'.json'
	if os.path.exists(name):
		
		data = json.load(open(name))
		for news in data:

			doc = news['title']
			date = news['date']
			date = date[6:]+'-'+date[4:6]+'-'+date[0:4]

			# tokenize doc

			tokenized_doc = nltk.word_tokenize(doc)

			 

			# tag sentences and use nltk's Named Entity Chunker

			tagged_sentences = nltk.pos_tag(tokenized_doc)

			ne_chunked_sents = nltk.ne_chunk(tagged_sentences)

			 

			# extract all named entities

			named_entities = list()
			relation = sentiment(doc)
			if relation > 0.2 or relation < -2.3 :
				for tagged_tree in ne_chunked_sents:
					if hasattr(tagged_tree, 'label'):
						entity_name = ' '.join(c[0] for c in tagged_tree.leaves()) #
						entity_type = tagged_tree.label() # get NE category
						if entity_type=='GPE':
							if entity_name != 'Latest':
								named_entities.append(entity_name) 

				if len(named_entities)==2:
					for i in range(0,2):
						if named_entities[i] in dict:
							named_entities[i]=dict[named_entities[i]]
					location0=locate(named_entities[0])
					location1=locate(named_entities[1])
					named_entities[0]=location0['Country']
					named_entities[1]=location1['Country']
					if (named_entities[0]!=named_entities[1]) and ((sentiment(doc))!=0) and (not named_entities[0].isdigit()) and (not named_entities[1].isdigit()):
						if relation>0.3 or relation<-0.4:
							breakingnews.append(doc)
						doc=date+' : '+doc
						with open(file, 'a') as out_file:
							article = { "title": doc, "geometry": {"coordinates": [ location0['Longitude']+random.uniform(-1*deviation(named_entities[0]),deviation(named_entities[0])),location0['Latitude']+random.uniform(-1*deviation(named_entities[0]),deviation(named_entities[0]))] },"end":{"geometry": {"coordinates": [ location1['Longitude']+random.uniform(-1*deviation(named_entities[1]),deviation(named_entities[1])),location1['Latitude']+random.uniform(-1*deviation(named_entities[1]),deviation(named_entities[1]))]}},"relation":sentiment(doc),"src":news['src'],"link":news['link']}
							out = json.dumps(article)
							out_file.write(out+",\n")

open(file,'a').write("] }")
with open('breakingnews.json','a') as out_file:
	news={"breakingnews":breakingnews}
	out = json.dumps(news)
	out_file.write(out)







		
		

	

