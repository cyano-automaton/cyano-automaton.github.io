import json
from os import listdir, remove
import serial
from datetime import datetime, timedelta

def avg (list):
	list_sum = 0
	for i in list:
		list_sum = list_sum + i
	avg = list_sum / len(list)
	return avg

def byMinute(e):
  return e['minute']

def byHour(e):
  return e['hour']

ser= serial.Serial('/dev/ttyACM0', 9600, timeout=1)
ser.flush()

temp=[]
#tds=[]
#ph=[]
ntu=[]

counter = 0

while True:
	start = datetime.now()
	print(start.minute)
	if (start.minute % 5) == 0:
		minute_start = start.minute
		break

while True:
	if ser.in_waiting > 0:
		line = ser.readline().decode('utf-8').rstrip()
		print (line)
		counter = counter + 1
		if counter > 5:
			values = line.split(", ")
			temp.append(float(values[0]))
			#tds.append(float(values[1]))
			#ph.append(float(values[2]))
			ntu.append(float(values[1]))
		now = datetime.now()
		print(now.minute - minute_start)
		if (now.minute - minute_start)  >= 5:
			break

temp_avg = avg(temp)
#tds_avg = avg(tds)
#ph_avg = avg(ph)
ntu_avg = avg(ntu)

print("Average values from last 5 minutes are:" + str(temp_avg) +", "+ str(ntu_avg))

year = now.year
month = now.month
day = now.day
hour = now.hour
minute = now.minute

right_now = {
    "year" : year,
	"month":  month,
	"day": day,
	"hour": hour,
	"minute": minute,
	"temp": temp_avg,
	#"tds": tds_avg,
	#"ph": ph_avg,
	"ntu": ntu_avg
}

print(right_now)

"""
location = "/home/pi/cyano-automaton.github.io/data/"
filename =str(year)+"_"+str(month)+"_"+str(day)+"_"+str(hour)+"_"+str(minute)
extension = ".json"
"""

with open ("/home/pi/cyano-automaton.github.io/data/right_now.json", "w") as file:
	json.dump(right_now, file,  indent=4)

with open ("/home/pi/cyano-automaton.github.io/data/last24.json", "w") as file:
	last24 = json.loads(file.read())
	if len(last24) < 288:
		last24.append(right_now)
		json.dump(last24, file,  indent=4)
	else:
		last24.pop(0)
		last24.append(right_now)
		json.dump(last24, file,  indent=4)

with open ("/home/pi/cyano-automaton.github.io/data/last7.json", "w") as file:
	last7 = json.loads(file.read())
	if len(last7) < 288:
		last7.append(right_now)
		json.dump(last7, file,  indent=4)
	else:
		last7.pop(0)
		last7.append(right_now)
		json.dump(last7, file,  indent=4)

with open ("/home/pi/cyano-automaton.github.io/data/last7.json", "w") as file:
	dictionary = json.loads(file.read())
	dictionary.update(last5)
	json.dump(dictionary, file,  indent=4)

last5 = {}
last5[year][month][day][hour][minute] = {"temp": temp_avg, "ntu": ntu_avg}

print(last5)

with open ("/home/pi/cyano-automaton.github.io/data/archive.json", "w") as file:
	dictionary = json.loads(file.read())
	dictionary.update(last5)
	json.dump(dictionary, file,  indent=4)
