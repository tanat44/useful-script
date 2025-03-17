
using System.Timers;

namespace MemLeakDi
{
    public class ServiceAHosted : IHostedService
    {
        ServiceBScoped _serviceB;
        public ServiceAHosted(ServiceBScoped serviceB) {

            _serviceB = serviceB;

        }

        private void OnTimedEvent(object? sender, ElapsedEventArgs e)
        {
            _serviceB.DoSomething();
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
    }
}
