## purpose
this experiment is to multi-threading decode the qr code. this is to benchmark and find optimum number of workers for decoing qr code

## raspberry pi 5
number of jobs = 20 (# qr codes)
| workers | time (s) |
| -- | -- |
| 1 | 53 |
| 2 | 32 |
| 3 | 25 |
| 4 | 22.5 |
| 5 | 21.5 |
| 6 | 20.9 |
| 7 | 20.3 |
| 10 | 21.1 |