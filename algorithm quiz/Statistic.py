# a statistics class
# which has 3 methods
# .addValue(int value)
# .getLast60Seconds()
# .getP70()
# .getLast60Seconds() returns all values sorted by time as they were added with .addValue
# .getP70() returns a value that is higher or equal than 70% of values added in last 60 seconds

import math
import random

class DataPoint:
    def __init__(self, timestamp, value):
        self.timestamp = timestamp
        self.value = value

    def __str__(self):
        return "ts=" + str(self.timestamp) + " v=" + str(self.value)

class Statistic:

    def __init__(self):
        self.data = []              # sorted by value

    def addValue(self, value, timestamp):

        # remove data older than 60s
        if len(self.data) > 0:
            self.deleteDataOlderThan(timestamp-10)
        else:
            self.data.append(DataPoint(timestamp, value))
            return

        # insert
        for i in range(len(self.data)):
            if self.data[i].value < value:
                continue
            else:
                self.data.insert(i, DataPoint(timestamp, value))
                return

        # this is by far max add to the end
        self.data.append(DataPoint(timestamp, value))

    def getLast60Seconds(self):
        out = sorted(self.data, key=lambda x: x.timestamp)
        out = [x.value for x in out]
        return out

    def getP70(self):
        count = len(self.data)
        p70Index = int(count * 0.7)
        return self.data[p70Index]

    def deleteDataOlderThan(self, cutoff):
        self.data = [x for x in self.data if x.timestamp > cutoff]

    def print(self):
        for d in self.data:
            print(str(d))

if __name__ == "__main__":
    s = Statistic()
    for i in range(20):
        s.addValue(random.randint(0,100), i)

    s.print()
    out = s.getLast60Seconds()
    print(out)

    out.sort()
    print(out)
    print(s.getP70())
