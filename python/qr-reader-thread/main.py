import time
from queue import Queue
from reader_worker import ReaderWorker

WORKERS = 4
JOBS = 20

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
print(f'it takes {end_time-start_time}')
