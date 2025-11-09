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

# mac m2 (4 performance core + 4 efficiency core)
number of jobs = 20 (# qr codes)
| jobs | workers | time (s) |
| -- | -- | -- |
| 20 | 1 | 22.9 |
| 20 | 2 | 13.0 |
| 20 | 4 | 7.7 |
| 20 | 8 | 5.7 |
| 20 | 10 | 5.0 |
| 20 | 12 | 4.9 |
| 100 | 8 | 19.0 |
| 100 | 20 | 85.6 |