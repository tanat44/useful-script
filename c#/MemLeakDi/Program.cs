using MemLeakDi;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();


//// EXPERIMENT 1: DI Error because A requires B
//builder.Services.AddHostedService<ServiceAHosted>();
//builder.Services.AddScoped<ServiceBScoped>();

//// EXPERIMENT 2: Try to solve DI error by using Func. Result in bad mem leak because ServiceB will never goes out of scope. ServiceB.Dispose never runs.
//builder.Services.AddHostedService<ServiceA2Hosted>();
//builder.Services.AddScoped<ServiceBScoped>();
//builder.Services.AddSingleton<Func<ServiceBScoped>>((instance) => () =>
//{
//    var scope = instance.CreateScope();
//    return scope.ServiceProvider.GetService<ServiceBScoped>();
//});

//// EXPERIMENT 3: Try to fix error in Experiment1 without mem leak
//// Ref https://learn.microsoft.com/en-us/aspnet/core/fundamentals/dependency-injection?view=aspnetcore-9.0
builder.Services.AddHostedService<ServiceA3Hosted>();
builder.Services.AddScoped<ServiceBScoped>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseAuthorization();

app.MapControllers();

app.Run();
