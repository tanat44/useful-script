import argparse
import time
from queue import Queue
from reader_worker import ReaderWorker

# parse args
parser = argparse.ArgumentParser(
                    prog='qr reader multi-thread',
                    description='find optimal number of threads for qr code reading',)
parser.add_argument('-w', '--workers', type=int, default=4, help='number of worker threads (default: 4)')
parser.add_argument('-j', '--jobs', type=int, default=20, help='number of jobs (default: 20)')
args = parser.parse_args()
WORKERS = args.workers    
JOBS = args.jobs

# start processing
start_time = time.time()
count = [i for i in range(0, WORKERS)]
workers = []
job_queue = Queue()
result_queue = Queue()
for x in count:
    worker = ReaderWorker(job_queue, result_queue)
    workers.append(worker)
    worker.start()

job_ids = [i for i in range(0, JOBS)]
for job_id in job_ids:
    job_queue.put(job_id)

output_count = 0
while output_count < JOBS-1:
    result = result_queue.get()
    print(result)
    output_count += 1

print("result completed")

for worker in workers:
    worker.stop()

end_time = time.time()
print(f'{WORKERS} workers process {JOBS} jobs: takes {end_time-start_time}s')
