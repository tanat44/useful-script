using TestDi.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// DI A+B
builder.Services.AddScoped<IAService, AService>();
builder.Services.AddScoped<IBService, BService>();
builder.Services.AddSingleton<Func<IAService>>((provider) => () =>
{
    Console.WriteLine("Creating AService");
    var scope = provider.CreateScope();
    return scope.ServiceProvider.GetService<IAService>()!;
});
builder.Services.AddScoped<ISpecialWork, MyHostedService>();
builder.Services.AddHostedService<MyHostedService>();

// DI C
builder.Services.AddScoped<ICService, CService>();
builder.Services.AddScoped<ICService, CService>();  // AddScoped multiple times don't create problem

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
