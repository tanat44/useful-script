# you can take out k cards
# you can take cards from the bottom or from the top of the stack, but only sequentially
# which cards would you take, to get the highest sum

# for example {5,4,3,2,4,5,10,9,20,24,2,3,1}
# if k=2
# best would be to take
# 5 + 4 = 9
# other possible pairs would be:
# 5 + 1
# 1 + 3

import copy, random, time

class Cards:

    cache = {}
    cacheHitCount = 0

    def genHash(k, start, end):
        return f'{k},{start},{end}'

    def cacheResult(value, k, start, end):
        Cards.cache[Cards.genHash(k,start,end)] = value

    def findMaxSum(k, start, end, usedDeck, useCache = True):
        hash = Cards.genHash( k, start, end)
        if useCache and hash in Cards.cache:
            Cards.cacheHitCount += 1
            return Cards.cache[hash]

        if k == 1:
            if cards[start] > cards[end]:
                usedDeck[start] = True
                return cards[start]
            else:
                usedDeck[end] = True
                return cards[end]

        # pick from top
        temp1 = copy.deepcopy(usedDeck)
        temp1[start] = True
        sumTop = cards[start] + Cards.findMaxSum(k-1, start+1, end, temp1)

        # pick from bottom
        temp2 = copy.deepcopy(usedDeck)
        temp2[end] = True
        sumBottom = cards[end] + Cards.findMaxSum(k-1, start, end-1, temp2)

        if sumTop > sumBottom:
            for i in range(len(usedDeck)):
                usedDeck[i] = temp1[i]
            Cards.cacheResult(sumTop, k, start, end)
            return sumTop
        else:
            for i in range(len(usedDeck)):
                usedDeck[i] = temp2[i]
            Cards.cacheResult(sumBottom, k, start, end)
            return sumBottom


if __name__ == "__main__":

    startTime = time.time()
    COUNT = 50
    cards = [i for i in range(COUNT*2)]
    usedDeck = []
    for i in range(len(cards)):
        usedDeck.append(False)
    max = Cards.findMaxSum(COUNT, 0, len(cards)-1, usedDeck)

    endTime = time.time()
    print("max sum=", max)
    print("cache hit=", Cards.cacheHitCount)
    print("duration=", (endTime-startTime))
    # print(cache)
