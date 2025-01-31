namespace TestDi.Services
{
    public class MyHostedService : IHostedService, ISpecialWork
    {
        private int executionCount = 0;
        private Timer? _timer = null;
        private Func<IAService> _aService;

        public MyHostedService(Func<IAService> aService)
        {
            _aService = aService;
            Console.WriteLine("MyHostedService: Constructor");
        }
        Task IHostedService.StartAsync(CancellationToken cancellationToken)
        {
            Console.WriteLine("MyHostedService: Started");
            _timer = new Timer(DoWork, null, TimeSpan.Zero,
            TimeSpan.FromSeconds(5));
            return Task.CompletedTask;
        }

        private void DoWork(object? state)
        {
            var count = Interlocked.Increment(ref executionCount);
            Console.WriteLine($"MyHostedService: {count}", count);
            _aService().Log("hello");
        }

        Task IHostedService.StopAsync(CancellationToken cancellationToken)
        {
            Console.WriteLine("MyHostedService: Stoped");
            return Task.CompletedTask;
        }

        public void DoSpecialWork(string text)
        {
            Console.WriteLine($"MyHostedService.DoSpecialWork: {text}");
        }
    }
}
