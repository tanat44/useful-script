
using System.Diagnostics;

const int N_TH = 40;
const int NUM_THREAD = 6;
static int fibonacci(int n)
{
    if (n == 0) return 0;
    if (n == 1) return 1;
    return fibonacci(n - 1) + fibonacci(n - 2);
}
static async Task<int> asyncFibonacci1(int n)
{
    if (n == 0) return 0;
    if (n == 1) return 1;
    int a = await asyncFibonacci1(n - 1);
    int b = await asyncFibonacci1(n - 2);
    return a + b;
}

static async Task<int> asyncFibonacci2(int n)
{
    if (n == 0) return 0;
    if (n == 1) return 1;
    var task1 = asyncFibonacci1(n - 1);
    var task2 = asyncFibonacci1(n - 2) ;
    Task.WaitAll(task1, task2);
    return task1.Result + task2.Result;
}

static async Task<int> asyncFibonacci3(int n)
{
    var t = Task.Run(() => {
        var x = fibonacci(n);
        return x;
    });
    t.Wait();
    return t.Result;
}

static void RunOneThread()
{
    Stopwatch stopwatch = new Stopwatch();
    stopwatch.Start();
    int result = fibonacci(N_TH);
    stopwatch.Stop();
    Console.WriteLine($"RunOneThread takes {stopwatch.Elapsed.TotalSeconds}");
}

static int thread_fibonacci()
{
    Stopwatch stopwatch = new Stopwatch();
    stopwatch.Start();
    int result = fibonacci(N_TH);
    stopwatch.Stop();
    Console.WriteLine($"\tThreadId[{Thread.CurrentThread.ManagedThreadId}] gives Result = {result}, takes {stopwatch.Elapsed.TotalSeconds}");
    return result;
}

static void RunManyThreads(int numThread)
{
    Stopwatch stopwatch = new Stopwatch();
    stopwatch.Start();

    List<Thread> threads = new List<Thread>();

    for(int i = 0;i < numThread; i++)
    {
        Thread t = new Thread(() => thread_fibonacci());
        t.Start();
        threads.Add(t);
    }

    foreach (Thread t in threads)
        t.Join();
    stopwatch.Stop();
    Console.WriteLine($"RunManyThreads[{numThread}] takes {stopwatch.Elapsed.TotalSeconds}");
}

static async Task RunOneAsync()
{
    Stopwatch stopwatch = new Stopwatch();
    stopwatch.Start();
    int result = await asyncFibonacci1(N_TH);
    stopwatch.Stop();
    Console.WriteLine($"RunOneAsync takes {stopwatch.Elapsed.TotalSeconds}");
}

static async Task RunOneAsync2()
{
    Stopwatch stopwatch = new Stopwatch();
    stopwatch.Start();
    int result = await asyncFibonacci2(N_TH);
    stopwatch.Stop();
    Console.WriteLine($"RunOneAsync2 takes {stopwatch.Elapsed.TotalSeconds}");
}
static async Task RunOneAsync3()
{
    Stopwatch stopwatch = new Stopwatch();
    stopwatch.Start();
    int reuslt = await asyncFibonacci3(N_TH);
    stopwatch.Stop();
    Console.WriteLine($"RunOneAsync3 takes {stopwatch.Elapsed.TotalSeconds}");
}

static async Task RunManyAsync3(int numThread)
{
    Stopwatch stopwatch = new Stopwatch();
    stopwatch.Start();
    List<Task> tasks = new List<Task>();

    for (int i = 0; i < numThread; i++) { 
        var t = asyncFibonacci3(N_TH);
        tasks.Add(t);
    }
    Task.WaitAll(tasks.ToArray());
    Console.WriteLine($"RunManyAsync3 takes {stopwatch.Elapsed.TotalSeconds}");
}
static async Task RunManyAsync4(int numThread)
{
    Stopwatch stopwatch = new Stopwatch();
    stopwatch.Start();
    List<Task> tasks = new List<Task>();

    for (int i = 0; i < numThread; i++)
    {
        var t = new Task(()=>fibonacci(N_TH));
        t.Start();
        tasks.Add(t);
    }
    Task.WaitAll(tasks.ToArray());
    Console.WriteLine($"RunManyAsync3 takes {stopwatch.Elapsed.TotalSeconds}");
}
static async void Main()
{
    RunOneThread();
    RunManyThreads(NUM_THREAD);
    //await RunOneAsync();
    //await RunOneAsync2();
    //await RunOneAsync3();
    await RunManyAsync3(NUM_THREAD);
    await RunManyAsync4(NUM_THREAD);
}

Main();