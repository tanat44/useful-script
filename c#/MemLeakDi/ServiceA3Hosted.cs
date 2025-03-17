
using System.Timers;

namespace MemLeakDi
{
    public class ServiceA3Hosted : IHostedService, IDisposable
    {
        IServiceScope _scope;
        public ServiceA3Hosted(IServiceProvider services) {

            _scope = services.CreateScope();

        }
        private void OnTimedEvent(object? sender, ElapsedEventArgs e)
        {
            var serviceB = _scope.ServiceProvider.GetRequiredService<ServiceBScoped>();
            serviceB.DoSomething();
        }

        public Task StartAsync(CancellationToken cancellationToken)
        {
            // start timer at interval 0.1s
            var timer = new System.Timers.Timer(100);
            timer.Elapsed += OnTimedEvent;
            timer.AutoReset = true;
            timer.Enabled = true;
            return Task.CompletedTask;
        }

        public Task StopAsync(CancellationToken cancellationToken)
        {
            // do nothing
            return Task.CompletedTask;
        }

        public void Dispose()
        {
            _scope.Dispose();
        }
    }
}
