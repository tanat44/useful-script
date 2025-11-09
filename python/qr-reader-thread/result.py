class Result():
    def __init__(self, worker_id, job_id, result):
        self.worker_id = worker_id
        self.job_id = job_id
        self.result = result
    
    def __str__(self):
        return f'worker {self.worker_id}: job {self.job_id} -> {self.result}'