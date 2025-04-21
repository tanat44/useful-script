using Microsoft.AspNetCore.Mvc;
using TestDi.Services;

namespace TestDi.Controllers;

[ApiController]
[Route("[controller]")]
public class CController : ControllerBase
{
    private ICService _cService;
    private readonly ILogger<CController> _logger;
    public CController(ILogger<CController> logger, ICService cService)
    {
        _logger = logger;
        _cService = cService;
    }

    [HttpGet]
    public void Get()
    {
        _cService.Log("Lanzhou Mian");
    }
}
