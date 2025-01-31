using Microsoft.AspNetCore.Mvc;
using TestDi.Services;

namespace TestDi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class BController : ControllerBase
    {
        private IBService _bService;
        private readonly ILogger<BController> _logger;
        public BController(ILogger<BController> logger, IBService bService)
        {
            _logger = logger;
            _bService = bService;
        }

        [HttpGet]
        public void Get()
        {
            _bService.Log("Pizza");
        }
    }
}
