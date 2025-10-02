namespace mongo_ttl;
using MongoDB.Driver;

public class HelloDatabase: IHostedService
{
    public const String DB_NAME = "hello";
    public const String COLLECTION_NAME = "world";
    private IMongoDatabase db;
    private IMongoCollection<Document> collection;
    private Timer timer;
    private int count = 0;
    private DateTime started = DateTime.Now;
    
    public HelloDatabase()
    {
        
    }

    public Task StartAsync(CancellationToken cancellationToken)
    {
        // connect & create collection
        var connectionString = "mongodb://test:test@localhost:27017/";
        var client = new MongoClient(connectionString);
        db = client.GetDatabase(DB_NAME);
        db.CreateCollection(COLLECTION_NAME);
        collection = db.GetCollection<Document>(COLLECTION_NAME);
        Console.WriteLine("created db & collection");
        
        // create index with ttl
        var keys = Builders<Document>.IndexKeys
            .Ascending(m => m.CreatedAt);
        var option = new CreateIndexOptions()
        {
            ExpireAfter = new TimeSpan(0, 0, 5),
        };
        var indexModel = new CreateIndexModel<Document>(keys, option);
        collection.Indexes.CreateOne(indexModel);
        
        // keep adding document
        timer = new Timer(this.Tick, null, TimeSpan.Zero, TimeSpan.FromSeconds(2));
        return Task.CompletedTask;
    }

    private void Tick(object? state)
    {
        Console.WriteLine($"tick {count++}");
        collection.InsertOne(new Document()
        {
            Message = $"example data ... life is awesome since {started.ToShortTimeString()}",
            Count = count,
        });
    }

    public Task StopAsync(CancellationToken cancellationToken)
    {
        throw new NotImplementedException();
    }
}