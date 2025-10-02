namespace mongo_ttl;

public class Document
{
    public string Message { get; set; }
    public int Count { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.Now;
}