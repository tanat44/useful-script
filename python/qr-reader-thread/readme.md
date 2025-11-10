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
| 6 | 20.9 (0.95 fps) |
| 7 | 20.3 |
| 10 | 21.1 |

# mac m2 (4 performance core + 4 efficiency core)
| jobs | workers | time (s) |
| -- | -- | -- |
| 20 | 1 | 22.9 |
| 20 | 2 | 13.0 |
| 20 | 4 | 7.7 |
| 20 | 8 | 5.7 |
| 20 | 10 | 5.0 |
| 20 | 12 | 4.9 |
| 100 | 8 | 19.0 (best 5.2 fps) |
| 100 | 20 | 85.6 |

# laptop i7-1370p
on battery
| jobs | workers | time (s) |
| -- | -- | -- |
| 20 | 1 | 22.6 |
| 20 | 2 | 13.7 |
| 20 | 4 | 8.7 |
| 20 | 8 | 8.6 |
| 20 | 10 | 5.1 |
| 20 | 12 | 5.1 |
| 100 | 8 | 19.6 |
| 100 | 12 | 17.5 |
| 100 | 15 | 15.8 (best 6.3 fps) |
| 100 | 16 | 16.6 |
| 100 | 18 | 15.6-16.4 |
| 100 | 20 | 15.8 |
| 100 | 22 | 16.4 |

on power
| jobs | workers | time (s) |
| -- | -- | -- |
| 20 | 1 | 22.3 |
| 20 | 4 | 6.8 |
| 20 | 8 | 4.9 |
| 20 | 10 | 4.2 |
| 100 | 16 | 12.8 |
| 100 | 19 | 12.8 |
| 100 | 20 | 11.7 |
| 100 | 21 | 12.8 |
| 100 | 22 | 13.5 |
| 1000 | 20 | 120 (best 8.3 fps) |