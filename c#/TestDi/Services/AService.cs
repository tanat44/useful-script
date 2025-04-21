namespace TestDi.Services;

public class AService : IAService
{
    private int count = 0;
    private static int countStatic = 0;
    public AService()
    {
        Console.WriteLine("AService: Start");
    }

    public void Log(string text)
    {
        Console.WriteLine($"AService.log: {text}, count: {count++}, countStatic: {countStatic++}");
    }
}
