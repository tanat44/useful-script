namespace TestDi.Services;

public class CService : ICService, IDisposable
{
    private int count = 0;
    private static int countStatic = 0;
    public CService()
    {
        Console.WriteLine("CService: Start");
    }

    public void Log(string text)
    {
        Console.WriteLine($"CService.log: {text}, count: {count++}, countStatic: {countStatic++}");
    }

    public void Dispose()
    {
        Console.WriteLine("CService: Dispose");
    }

    ~CService()
    {
        Console.WriteLine("CService: Deconstruct");
    }
}
