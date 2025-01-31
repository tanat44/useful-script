using System;

namespace TestDi.Services
{
    public class BService : IBService
    {
        ISpecialWork _specialService;
        public BService(ISpecialWork specialService)
        {
            _specialService = specialService;
            Console.WriteLine("BService: Start");
        }

        public void Log(string text)
        {
            Console.WriteLine($"BService.log: {text}");
            _specialService.DoSpecialWork(text);
        }
    }
}
