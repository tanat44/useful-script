﻿
using System.Timers;

namespace MemLeakDi
{
    public class ServiceBScoped : IDisposable
    {
        List<string>? bigList;
        int _id = -1;
        static int id = 0;
        System.Timers.Timer timer;
        public ServiceBScoped() {
            _id = id++;
            Console.WriteLine($"ServiceB: Created {_id}");
            bigList = new List<string>() { "asdf" };
            for (int i = 0; i < 25; ++i)
            {
                bigList.Add(bigList[bigList.Count - 1] + bigList[bigList.Count - 1]);
            }
            timer = new System.Timers.Timer(10000);
            timer.Elapsed += OnTimedEvent;
            timer.AutoReset = true;
            timer.Enabled = true;
        }

        private void OnTimedEvent(object? sender, ElapsedEventArgs e)
        {
            Console.WriteLine($"ServiceB: Tick {_id} Count {bigList.Count}");
        }

        public void Dispose()
        {
            Console.WriteLine($"ServiceB: Disposed {_id}");
            //GC.Collect();  // without this line the memory keeps growing forever
            var x = 1;
        }

        public int DoSomething()
        {
            if (bigList == null) {
                Console.WriteLine($"ServiceB: Big list are gone {_id}");
                return 0;
            }
            return bigList.Count;
        }

        ~ServiceBScoped() {
            Console.WriteLine($"ServiceB: Destructed {_id}");
        }

    }
}
